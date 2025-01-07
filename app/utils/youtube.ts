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

  console.log("playlistId", playlistId);
  if (!playlistId) {
    throw new Error("Playlist not found");
  }

  const videos = await getPlaylistItems(youtube, playlistId);
  console.log("videos", categorizeVideos(videos));
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
    part: ["snippet"],
    mine: true,
  });
  console.log("response", response.data.items);
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
  const systemPrompt = encodeURIComponent(
    "Analyze this video title and return ONLY a single category name, nothing else. Be consistent with category names."
  );

  for (const video of videos) {
    try {
      const prompt = encodeURIComponent(video.snippet.title);
      const response = await fetch(
        `https://text.pollinations.ai/${prompt}?model=mistral&system=${systemPrompt}&json=true`
      );
      const category = (await response.text()).trim();

      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(video);
    } catch {
      if (!categories["Uncategorized"]) {
        categories["Uncategorized"] = [];
      }
      categories["Uncategorized"].push(video);
    }
  }

  return categories;
}
