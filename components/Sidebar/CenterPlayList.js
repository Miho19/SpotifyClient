import { useSession, getSession, signOut } from "next-auth/react";
import React, { useState, useEffect, useContext } from "react";
import { debounce, shuffle } from "lodash";

import useSpotify from "../../hooks/useSpotify";
import Songs from "./Songs";
import { useRouter } from "next/router";
import { RoomContext } from "../../context/socket.context";

import StickyHeader from "./StickyHeader";
import { DrawerContext } from "../../context/drawers.context";
import { UserPlaylistContext } from "../../context/userplaylist.context";

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

  const { isChatOpen, isSidebarOpen } = useContext(DrawerContext);
  const [adjustNameDisplay, setAdjustNameDisplay] = useState(false);

  const xlBreakPoint = 1280;

  const { currentPlaylistId, currentPlaylistObject } =
    useContext(UserPlaylistContext);

  const spotifyApi = useSpotify();

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [currentPlaylistId]);

  useEffect(() => {
    const windowResized = debounce(() => {
      const width = window.innerWidth;

      setAdjustNameDisplay(isChatOpen && isSidebarOpen && width < xlBreakPoint);
    }, 150);

    window.addEventListener("resize", windowResized);

    return () => {
      window.removeEventListener("resize", windowResized);
    };
  }, [adjustNameDisplay, isSidebarOpen, isChatOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const width = window.innerWidth;

    setAdjustNameDisplay(isChatOpen && isSidebarOpen && width < xlBreakPoint);
  }, [adjustNameDisplay, isSidebarOpen, isChatOpen]);

  const user = {
    name: session?.user.name,
    imgSource: session.user.image,
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] overflow-y-scroll scrollbar-hide overflow-hidden w-full">
      <StickyHeader
        playlistName={currentPlaylistObject?.name}
        imgSource={
          currentPlaylistObject?.images?.length
            ? currentPlaylistObject?.images[0].url
            : null
        }
        color={color}
        user={user}
      />
      <div className="">
        <Songs
          partyPlaylistID={roomPlaylistID}
          adjustNameDisplay={adjustNameDisplay}
        />
      </div>
    </div>
  );
}
