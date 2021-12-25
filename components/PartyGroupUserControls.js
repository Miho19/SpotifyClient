import { LogoutIcon } from "@heroicons/react/solid";
import React, { useContext } from "react";
import { SocketContext } from "../context/socket.context";

export default function PartyGroupUserControls() {
  const { socket, EVENTS } = useContext(SocketContext);

  return (
    <div
      className="w-full h-full bg-black flex items-center "
      onClick={() => {
        socket?.emit(EVENTS.CLIENT.LEAVE_ROOM);
      }}
    >
      <LogoutIcon className="w-5 h-5 text-red-500 ml-auto mr-4  hover:text-red-400 hover:bg-white/20 hover:rounded-full cursor-pointer" />
    </div>
  );
}
