import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import LoginButton from "@/components/LoginButton";
import { getPlaylists, getVideos } from "./utils/youtube";
import DashboardClient from "@/components/DashboardClient";
import LogoutButton from "@/components/LogoutButton";
import { UserCircle } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    !session.accessToken ||
    session.error === "RefreshAccessTokenError"
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="backdrop-blur-lg p-12 rounded-3xl  max-w-2xl w-full mx-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 ">
            AI Youtube Playlist Organiser
          </h1>
          <p className="text-muted-foreground mb-8 md:text-lg">
            Organize your YouTube playlists efficiently. Sort videos, and keep
            your content organized.
          </p>
          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-purple-500/10">✨</div>
              <p className="text-muted-foreground">
                Simple and intuitive playlist management
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-purple-500/10">🔒</div>
              <p className="text-muted-foreground">
                Secure Google account integration
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-purple-500/10">🎯</div>
              <p className="text-muted-foreground">Manage multiple playlists</p>
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
    <main className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="backdrop-blur-lg rounded-3xl shadow-xl border border-white/10 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h1 className="text-2xl md:text-4xl font-bold ">
              AI Youtube Playlist Organiser
            </h1>
            <div className="flex flex-col md:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <UserCircle className="w-5 h-5" />
                <span className="text-sm truncate max-w-[200px]">
                  {session.user.email}
                </span>
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
