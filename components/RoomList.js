import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/socket.context";
import RoomItem from "./RoomItem";

export default function RoomList({ setPartyNameValue }) {
  const { socket, EVENTS } = useContext(SocketContext);

  const [partyRooms, setPartyRooms] = useState([]);

  useEffect(() => {
    if (typeof window.document !== "undefined") {
      socket?.emit(EVENTS.CLIENT.GET_ROOM_LIST);
    }

    socket?.on(EVENTS.SERVER.SEND_ROOM_LIST, ({ roomList }) => {
      setPartyRooms(roomList);
    });
  }, [socket]);

  const partyRoomsList = partyRooms.map((room) => (
    <RoomItem
      setPartyNameValue={setPartyNameValue}
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
