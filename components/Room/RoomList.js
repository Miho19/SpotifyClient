import React, { useEffect, useState } from "react";
import RoomItem from "./RoomItem";

import { getSocket } from "../../util/socket";
import EVENTS from "../../util/events";

export default function RoomList() {
  const socket = getSocket();
  const [roomList, setRoomList] = useState([]);

  useEffect(() => {
    const updateRoomList = ({ roomList }) => {
      if (!roomList) {
        setRoomList([]);
      }
      setRoomList(roomList);
    };

    socket?.emit(EVENTS.CLIENT.GET_ROOM_LIST, updateRoomList);
  }, [socket]);

  const partyRoomsList = roomList.map((room) => (
    <RoomItem
      roomJoinLink={room.linkID}
      key={room.roomID}
      name={room.roomName}
      totalMembers={room.totalMembers}
    />
  ));

  return (
    <article className="h-full w-full flex flex-col">
      <header className="flex w-full h-10 items-center justify-start pt-5 pb-5">
        <h2 className="text-lg text-white ml-5 font-medium">Room List</h2>
      </header>
      <main className="w-full h-[100%-2.5rem] overflow-scroll scrollbar-hide space-y-1">
        <ul aria-label="list of rooms to join">{partyRoomsList}</ul>
      </main>
    </article>
  );
}
