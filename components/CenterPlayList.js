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
import { SocketContext } from "../context/socket.context";

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
  const { socket, EVENTS } = useContext(SocketContext);
  const [color, setColor] = useState(null);

  const [playlistId, setCurrentPlaylistId] = useRecoilState(currentPlaylistId);
  const [playlistObject, setCurrentPlaylistObject] = useRecoilState(
    currentPlayListObject
  );

  const spotifyApi = useSpotify();

  const router = useRouter();

  const [partyPlaylistID, setPartyPlaylistID] = useState("");

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
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    if (!playlistId) return;

    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getPlaylist(playlistId)
        .then((data) => setCurrentPlaylistObject(data.body))
        .catch((err) => console.log(err));
    }
  }, [playlistId]);

  useEffect(() => {
    const updatePartyPlaylistID = ({ playlistID }) => {
      setPartyPlaylistID(playlistID);
    };

    const clientJoinedRoom = () => {
      socket?.emit(EVENTS.CLIENT.GET_ROOM_PLAYLISTID, updatePartyPlaylistID);
    };

    const clientLeftRoom = () => {
      setPartyPlaylistID("");
    };

    socket?.on(EVENTS.SERVER.CLIENT_JOINED_ROOM, clientJoinedRoom);
    socket?.on(EVENTS.SERVER.CLIENT_LEFT_ROOM, clientLeftRoom);

    socket?.emit(EVENTS.CLIENT.GET_ROOM_PLAYLISTID, updatePartyPlaylistID);

    return () => {
      socket?.off(EVENTS.SERVER.CLIENT_JOINED_ROOM, clientJoinedRoom);
      socket?.off(EVENTS.SERVER.CLIENT_LEFT_ROOM, clientLeftRoom);
    };
  }, [socket]);

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
        <Songs partyPlaylistID={partyPlaylistID} />
      </div>
    </div>
  );
}
