"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Playlist {
  id: string;
  snippet: {
    title: string;
  };
}

interface PlaylistDropdownProps {
  playlists: Playlist[];
  onPlaylistChange: (playlistId: string) => Promise<void>;
}

export default function PlaylistDropdown({
  playlists,
  onPlaylistChange,
}: PlaylistDropdownProps) {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>(
    playlists[0]?.id || ""
  );

  const handlePlaylistChange = async (playlistId: string) => {
    setSelectedPlaylist(playlistId);
    await onPlaylistChange(playlistId);
  };

  return (
    <Select value={selectedPlaylist} onValueChange={handlePlaylistChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Playlist" />
      </SelectTrigger>
      <SelectContent>
        {playlists.map((playlist) => (
          <SelectItem key={playlist.id} value={playlist.id}>
            {playlist.snippet.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
