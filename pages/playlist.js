import React, { useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Player from "../components/Player";
import Chatbar from "../components/Chatbar";
import CenterPlayList from "../components/CenterPlayList";

import { useRecoilState } from "recoil";
import { currentPlaylistId } from "../atoms/playlistAtom";

export default function playlist() {
  const [playlistId, setCurrentPlaylistId] = useRecoilState(currentPlaylistId);

  useEffect(() => {
    if (playlistId === "") {
      console.log(playlistId);
    }
  }, []);

  return (
    <div className="bg-black h-screen scrollbar-hide overflow-hidden text-white">
      <main className="flex h-full ">
        <Sidebar />
        <CenterPlayList />
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}
