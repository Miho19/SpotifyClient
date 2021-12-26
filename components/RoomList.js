import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/socket.context";

import RoomItem from "./RoomItem";

export default function RoomList() {
  const { roomList, getRoomList } = useContext(SocketContext);

  useEffect(() => {
    if (typeof window.document !== "undefined") {
      getRoomList();
    }
  }, []);

  const partyRoomsList = roomList.map((room) => (
    <RoomItem
      roomJoinLink={room.linkID}
      key={room.roomID}
      name={room.roomName}
      totalMembers={room.totalMembers}
    />
  ));

  return (
    <div className="h-full w-full flex flex-col">
      <header className="flex w-full h-10 items-center justify-start pt-5 pb-5">
        <h2 className="text-lg text-white ml-5 font-medium">Room List</h2>
      </header>
      <div className="w-full h-[100%-2.5rem] overflow-scroll scrollbar-hide space-y-1">
        {partyRoomsList}
      </div>
    </div>
  );
}