"use client";

import { useState } from "react";
import PlaylistDropdown from "./PlaylistDropdown";
import VideoList from "./VideoList";

interface DashboardClientProps {
  initialPlaylists: any;
  initialVideos: Record<string, any[]>;
  getPlaylistVideos: (playlistId: string) => Promise<Record<string, any[]>>;
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
