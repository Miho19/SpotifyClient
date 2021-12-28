import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/socket.context";

import RoomItem from "./RoomItem";

export default function RoomList() {
  const { socket, EVENTS } = useContext(SocketContext);

  const [roomList, setRoomList] = useState([]);

  useEffect(() => {
    socket?.emit(EVENTS.CLIENT.GET_ROOM_LIST);
  }, []);

  useEffect(() => {
    const getRoomList = ({ roomList }) => {
      setRoomList(roomList);
    };
    socket?.on(EVENTS.SERVER.SEND_ROOM_LIST, getRoomList);

    return () => {
      socket?.off(EVENTS.SERVER.SEND_ROOM_LIST, getRoomList);
    };
  }, [socket, roomList]);

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
