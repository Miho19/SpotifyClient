import React, { useState, useContext } from "react";
import { SocketContext } from "../context/socket.context";
import PartyPlaylist from "./PartyPlaylist";

import PartyGroup from "./PartyGroup";
import RoomList from "./RoomList";

export default function Party() {
  const { room } = useContext(SocketContext);

  return (
    <div className="flex-grow h-[calc(100vh-6rem)] overflow-y-scroll scrollbar-hide bg-[#242424] ">
      <main className="p-8 grid grid-cols-1 grid-rows-6 lg:grid-cols-3 lg:grid-rows-6 h-full w-full gap-2">
        <div className="bg-black h-full w-full col-span-1 row-span-5 lg:row-span-full lg:col-span-2 overflow-scroll scrollbar-hide">
          <PartyPlaylist />
        </div>
      </main>
    </div>
  );
}
