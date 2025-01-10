import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import LoginButton from "@/components/LoginButton";
import { getPlaylists, getVideos } from "./utils/youtube";
import DashboardClient from "@/components/DashboardClient";
import LogoutButton from "@/components/LogoutButton";
import { UserCircle } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="backdrop-blur-lg bg-white/10 p-12 rounded-3xl shadow-2xl max-w-2xl w-full mx-4 flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white ">
            Youtube Playlist Organizer
          </h1>
          <p className="text-gray-300 mb-8 md:text-lg">
            Organize your YouTube playlists efficiently. Sort videos, and keep
            your content organized.
          </p>
          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-purple-500/10">✨</div>
              <p className="text-gray-300">
                Simple and intuitive playlist management
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-purple-500/10">🔒</div>
              <p className="text-gray-300">Secure Google account integration</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-purple-500/10">🎯</div>
              <p className="text-gray-300">Manage multiple playlists</p>
            </div>
          </div>
          <LoginButton />
        </div>
      </div>
    );
  }

  const playlists = await getPlaylists(session.accessToken as string);

  if (playlists?.length === 0)
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl ">
          There are no playlists, please add one
        </div>
      </div>
    );

  const initialVideos = await getVideos(
    session.accessToken as string,
    playlists[0]?.id
  );

  async function getPlaylistVideos(playlistId: string) {
    "use server";
    if (!session?.accessToken) throw new Error("No access token");
    return getVideos(session.accessToken, playlistId);
  }

  return (
    <main className="min-h-screen ">
      <div className="container mx-auto p-6">
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold ">Youtube Playlist Organizer</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 ">
                <UserCircle className="w-5 h-5" />
                <span>{session.user.email}</span>
              </div>
              <LogoutButton />
            </div>
          </div>
          <DashboardClient
            initialPlaylists={playlists}
            initialVideos={initialVideos}
            getPlaylistVideos={getPlaylistVideos}
          />
        </div>
      </div>
    </main>
  );
}
