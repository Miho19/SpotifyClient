import React, { useState, useContext } from "react";
import { SocketContext } from "../context/socket.context";
import PartyPlaylist from "./PartyPlaylist";

import PartyGroup from "./PartyGroup";
import RoomList from "./RoomList";

export default function Party() {
  const { room } = useContext(SocketContext);

  return (
    <div className="flex-grow h-[calc(100vh-6rem)] overflow-y-scroll scrollbar-hide bg-gradient-to-b from-[#242424] to-[#161616] ">
      <main className="h-full w-full p-8 overflow-scroll scrollbar-hide ">
        <PartyPlaylist />
      </main>
    </div>
  );
}
