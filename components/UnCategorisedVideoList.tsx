import React from "react";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const UnCategorisedVideoList = (video: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {video.video.map((video: any) => (
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
  );
};

export default UnCategorisedVideoList;
