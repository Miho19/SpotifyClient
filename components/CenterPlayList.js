import { ChevronDownIcon } from "@heroicons/react/outline";
import { useSession, getSession, signOut } from "next-auth/react";
import React, { useState, useEffect, useContext } from "react";
import { shuffle } from "lodash";
import { useRecoilState } from "recoil";
import {
  currentPlaylistId,
  currentPlayListObject,
} from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import { useRouter } from "next/router";
import { RoomContext } from "../context/socket.context";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

export default function CenterPlayList() {
  const { data: session, loading } = useSession();
  const { roomPlaylistID } = useContext(RoomContext);
  const [color, setColor] = useState(null);

  const [playlistId, setCurrentPlaylistId] = useRecoilState(currentPlaylistId);
  const [playlistObject, setCurrentPlaylistObject] = useRecoilState(
    currentPlayListObject
  );

  const spotifyApi = useSpotify();

  const router = useRouter();

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    if (playlistId) return;
    if (!spotifyApi) return;

    if (!spotifyApi.getAccessToken()) return;

    spotifyApi
      .getUserPlaylists()
      .then((response) => {
        if (!response.body) {
          router.push("/");
          return;
        }
        setCurrentPlaylistId(response.body.items[0].id);
      })
      .catch((error) => console.error("get playlist:", error));
  }, []);

  useEffect(() => {
    if (!playlistId) return;

    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getPlaylist(playlistId)
        .then((data) => setCurrentPlaylistObject(data.body))
        .catch((error) => console.error("get playlist, id changed:", error));
    }
  }, [playlistId]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-[21rem]">
        <div
          className="flex items-center bg-black bg-opacity-70 space-x-3 hover:bg-opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white font-medium"
          onClick={() => signOut()}
        >
          <img
            className="rounded-full w-7 h-7 ml-1 sm:ml-0"
            src={session?.user.image}
            alt=""
          />
          <h2 className="hidden lg:block ">{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5 hidden lg:block" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
      >
        <img
          src={playlistObject?.images?.[0].url}
          alt="playlist image"
          className="h-44 w-44 shadow-2xl"
        />
        <div>
          <p className="uppercase font-bold">playlist</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {playlistObject?.name}
          </h1>
        </div>
      </section>
      <div>
        <Songs partyPlaylistID={roomPlaylistID} />
      </div>
    </div>
  );
}
