"use client";

import { useState } from "react";
import PlaylistDropdown from "./PlaylistDropdown";
import VideoList from "./VideoList";
import UnCategorisedVideoList from "./UnCategorisedVideoList";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";

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
  const [videos, setVideos] = useState<Record<string, any[]>>(initialVideos);
  const [showCategorised, setShowCategorised] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaylistChange = async (playlistId: string) => {
    const newVideos = await getPlaylistVideos(playlistId);
    setShowCategorised(false);
    setVideos(newVideos);
  };

  async function categorizeVideos(
    videos: any
  ): Promise<{ [key: string]: any[] }> {
    const categories: { [key: string]: any[] } = {};
    const videoData = videos.map((video: any) => [
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
      videos.forEach((video: any, index: number) => {
        const category = categories_array[index] || "Uncategorized";
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(video);
      });
    } catch (error) {
      console.log(error);
      categories["Uncategorized"] = videos;
    }
    return categories;
  }

  const handleCategoriseVideos = async () => {
    setIsLoading(true);
    const categorisedVideos = await categorizeVideos(videos);
    setShowCategorised(true);
    setVideos(categorisedVideos);
    setIsLoading(false);
  };

  return (
    <>
      <div className="my-2">
        <div className="flex gap-4">
          <PlaylistDropdown
            playlists={initialPlaylists}
            onPlaylistChange={handlePlaylistChange}
          />
          {!showCategorised && (
            <Button onClick={handleCategoriseVideos}>
              Categorise
              {isLoading && (
                <span className="animate-spin">
                  <LoaderCircle />
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
      {showCategorised ? (
        <VideoList videos={videos} />
      ) : (
        <UnCategorisedVideoList video={videos} />
      )}
    </>
  );
}
