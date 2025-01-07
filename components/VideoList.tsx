"use client";
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

interface VideoListProps {
  videos: Record<string, Video[]>;
}

export default function VideoList({ videos }: VideoListProps) {
  return (
    <>
      {Object.entries(videos).map(([category, categoryVideos]) => (
        <div key={category} className="mb-8">
          <hr className="border-gray-700" />
          <h2 className="text-2xl font-semibold text-gray-900 mt-4">
            {category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {categoryVideos.map((video: Video) => (
              <div
                key={video.id}
                className="border border-gray-700 rounded-lg p-4 bg-gray-100"
              >
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
                <h3 className="font-semibold text-gray-900">
                  {video.snippet.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {video.snippet.channelTitle}
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block bg-gray-900 text-white px-4 py-2 rounded text-sm"
                >
                  Watch on YouTube
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
