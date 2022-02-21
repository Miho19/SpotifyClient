import React, { useContext } from "react";
import { SocketContext } from "../../context/socket.context";

export default function RoomItem({ name, totalMembers, roomJoinLink }) {
  const { socket, EVENTS } = useContext(SocketContext);

  return (
    <div
      className="w-full h-10 bg-white/5  hover:bg-white/25 cursor-pointer text-xs sm:text-sm group grid grid-row-2 grid-flow-col"
      onClick={() => {
        socket.emit(EVENTS.CLIENT.JOIN_ROOM, { joinLink: roomJoinLink });
      }}
    >
      <div className="h-full text-white font-medium text-[15px] row-span-1  pt-2 px-5">
        {name}
      </div>
      <div className="h-full text-white font-medium row-span-1 text-right pt-2 px-5">{`Members: ${totalMembers}`}</div>
    </div>
  );
}
