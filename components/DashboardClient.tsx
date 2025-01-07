"use client";

import { useState } from "react";
import PlaylistDropdown from "./PlaylistDropdown";
import VideoList from "./VideoList";

interface Video {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    resourceId: {
      videoId: string;
    };
  };
}

interface DashboardClientProps {
  initialPlaylists: any;
  initialVideos: Record<string, Video[]>;
  getPlaylistVideos: (playlistId: string) => Promise<Record<string, Video[]>>;
}

export default function DashboardClient({
  initialPlaylists,
  initialVideos,
  getPlaylistVideos,
}: DashboardClientProps) {
  const [videos, setVideos] = useState(initialVideos);

  const handlePlaylistChange = async (playlistId: string) => {
    const newVideos = await getPlaylistVideos(playlistId);
    setVideos(newVideos);
  };

  return (
    <>
      <div className="my-2">
        <PlaylistDropdown
          playlists={initialPlaylists}
          onPlaylistChange={handlePlaylistChange}
        />
      </div>
      <VideoList videos={videos} />
    </>
  );
}
