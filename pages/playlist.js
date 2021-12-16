import React, { useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Player from "../components/Player";
import Chatbar from "../components/Chatbar";
import CenterPlayList from "../components/CenterPlayList";

import { useRecoilState } from "recoil";
import { currentPlaylistId } from "../atoms/playlistAtom";

export default function playlist() {
  const [playlistId, setCurrentPlaylistId] = useRecoilState(currentPlaylistId);

  return (
    <div className="bg-[#0f0f0f] h-screen scrollbar-hide overflow-hidden text-white">
      <main className="flex h-full ">
        <Sidebar />
        <CenterPlayList />
      </main>
    </div>
  );
}
