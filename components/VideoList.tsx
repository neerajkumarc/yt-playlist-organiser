"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";

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
    videoOwnerChannelTitle: string;
  };
}

interface VideoListProps {
  videos: Record<string, Video[]>;
}

export default function VideoList({ videos }: VideoListProps) {
  return (
    <>
      {Object.entries(videos).map(([category, categoryVideos]) => (
        <div key={category} className="mb-8">
          <hr className="border-gray-700" />
          <h2 className="text-2xl font-semibold mt-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {categoryVideos.map((video: Video) => (
              <Card key={video.id} className="flex flex-col h-[400px]">
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={
                        Object.keys(video.snippet.thumbnails).length == 0
                          ? "https://via.placeholder.com/150"
                          : video.snippet.thumbnails.medium.url
                      }
                      alt={video.snippet.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <CardTitle className="text-lg mt-4 line-clamp-2">
                      {video.snippet.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-1">
                      {video.snippet.videoOwnerChannelTitle}
                    </CardDescription>
                  </div>
                  <Button className="mt-auto w-full" variant="default" asChild>
                    <a
                      href={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Watch on YouTube
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
