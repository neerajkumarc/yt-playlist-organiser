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
  return videos;
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
