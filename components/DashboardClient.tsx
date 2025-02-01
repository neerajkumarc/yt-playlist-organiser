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
    const BATCH_SIZE = 10;
    
    // Process videos in batches
    for (let i = 0; i < videos.length; i += BATCH_SIZE) {
      const videoBatch = videos.slice(i, i + BATCH_SIZE);
      const videoData = videoBatch.map((video: any) => ({
        titles: video.snippet.title,
        descriptions: video.snippet.description.substring(0, 200),
      }));
  
      const systemPrompt = encodeURIComponent(
        'For each video title in the following list, return only its category name. Provide the results as a JSON array with categories corresponding to the titles in the same order as the input. Ensure the category names are consistent. If a video does not fall into any of these categories, return "Uncategorized" for that title.'
      );
      const dataPrompt = encodeURIComponent(JSON.stringify(videoData));
  
      try {
        const response = await fetch(
          `https://text.pollinations.ai/${dataPrompt}?&system=${systemPrompt}&json=true`
        );
  
        const categories_array = await response.json();
        
        // Process each video in the current batch
        videoBatch.forEach((video: any, index: number) => {
          const category = categories_array.categories[index] || "Uncategorized";
          if (!categories[category]) {
            categories[category] = [];
          }
          categories[category].push(video);
        });
        
        // Optional: Add a small delay between batches to avoid rate limiting
        if (i + BATCH_SIZE < videos.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.log('Error processing batch:', error);
        // Add failed batch videos to Uncategorized
        videoBatch.forEach((video: any) => {
          if (!categories["Uncategorized"]) {
            categories["Uncategorized"] = [];
          }
          categories["Uncategorized"].push(video);
        });
      }
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
            <Button onClick={handleCategoriseVideos} disabled={isLoading}>
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
