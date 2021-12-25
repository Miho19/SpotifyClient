import React, { useContext } from "react";
import { SocketContext } from "../context/socket.context";

export default function RoomItem({ name, totalMembers, roomJoinLink }) {
  const { socket, EVENTS } = useContext(SocketContext);

  return (
    <div
      className="w-full h-10 flex justify-between bg-white/5 items-center group hover:bg-white/25 cursor-pointer text-xs sm:text-sm "
      onClick={() => {
        socket.emit(EVENTS.CLIENT.JOIN_ROOM, { joinLink: roomJoinLink });
      }}
    >
      <h3 className="text-white font-medium ml-4">{name}</h3>
      <h3 className="text-white font-medium mr-4 hidden xs:inline lg:hidden xl:inline">{`Members: ${totalMembers}`}</h3>
    </div>
  );
}
