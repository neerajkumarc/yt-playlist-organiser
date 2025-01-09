import { google } from "googleapis";

export async function getVideos(
  accessToken: string,
  playlistId: string | null | undefined
) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({ access_token: accessToken });

  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  if (!playlistId) {
    throw new Error("Playlist not found");
  }

  const videos = await getPlaylistItems(youtube, playlistId);
  return categorizeVideos(videos);
}

export async function getPlaylists(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({ access_token: accessToken });

  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });
  const response = await youtube.playlists.list({
    access_token: accessToken,
    part: ["snippet"],
    mine: true,
  });
  return response.data.items || [];
}

async function getPlaylistItems(youtube: any, playlistId: string) {
  const response = await youtube.playlistItems.list({
    part: "snippet",
    playlistId: playlistId,
    maxResults: 50,
  });

  return response.data.items;
}

async function categorizeVideos(
  videos: any[]
): Promise<{ [key: string]: any[] }> {
  const categories: { [key: string]: any[] } = {};

  const videoData = videos.map((video) => [
    {
      titles: video.snippet.title,
      descriptions: video.snippet.description.substring(0, 200),
    },
  ]);
  const systemPrompt = encodeURIComponent(
    'For each video data in the following list, return ONLY its category name. Respond with a JSON array of categories in the same order as the input titles. Be consistent with category names and use only common categories. If a video title is not in any category, then return "Uncategorized".'
  );
  const dataPrompt = encodeURIComponent(JSON.stringify(videoData));

  try {
    const response = await fetch(
      `https://text.pollinations.ai/${dataPrompt}?model=mistral&system=${systemPrompt}&json=true`
    );

    const categories_array = await response.json();
    videos.forEach((video, index) => {
      const category = categories_array[index] || "Uncategorized";
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(video);
    });
  } catch (error) {
    categories["Uncategorized"] = videos;
  }
  return categories;
}
