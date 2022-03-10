import { useSession, getSession, signOut } from "next-auth/react";
import React, { useState, useEffect, useContext } from "react";
import { shuffle } from "lodash";
import { useRecoilState } from "recoil";
import {
  currentPlaylistId,
  currentPlayListObject,
} from "../../atoms/playlistAtom";
import useSpotify from "../../hooks/useSpotify";
import Songs from "./Songs";
import { useRouter } from "next/router";
import { RoomContext } from "../../context/socket.context";

import StickyHeader from "./StickyHeader";

/**
 * https://stackoverflow.com/questions/16302483/event-to-detect-when-positionsticky-is-triggered
 */
/**  */

const colors = [
  "from-indigo-800",
  "from-purple-700",
  "from-red-900",
  "from-gray-600",
  "from-orange-600",
  "from-amber-400",
  "from-lime-800",
  "from-sky-500",
  "from-rose-700",
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

  const user = {
    name: session?.user.name,
    imgSource: session.user.image,
  };

  return (
    <div className="h-screen overflow-y-scroll scrollbar-hide overflow-hidden w-full">
      <StickyHeader
        playlistName={playlistObject?.name}
        imgSource={playlistObject?.images[0].url}
        color={color}
        user={user}
      />
      <div className="">
        <Songs partyPlaylistID={roomPlaylistID} />
      </div>
    </div>
  );
}
