import { UserAddIcon } from "@heroicons/react/solid";
import React, { useContext } from "react";

import ChatMessageList from "./ChatMessageList";
import ChatbarForm from "./ChatbarForm";
import { SocketContext } from "../context/socket.context";
import RoomList from "./RoomList";
import PartyGroup from "./PartyGroup";

export default function Chatbar() {
  const { room } = useContext(SocketContext);

  return (
    <div className="min-w-[20rem] max-w-[20rem] max-h-[calc(100vh-6rem)] flex flex-col justify-start items-start bg-black ">
      <header className="flex w-full h-10 items-center justify-start pt-5 pb-5">
        <h2 className="text-lg text-white ml-5 font-medium">
          {room.roomID ? `${room.roomName}` : `Party Chat`}
        </h2>
        <UserAddIcon className="w-5 h-5 text-white/50 ml-auto mr-5 hover:text-white/60 hover:bg-white/20 hover:rounded-full " />
      </header>

      <ChatMessageList />
      <ChatbarForm />

      <div className="flex h-[25%] overflow-scroll scrollbar-hide w-full bg-black">
        <div className=" bg-black w-full">
          {room.roomID !== "" ? <PartyGroup /> : <RoomList />}
        </div>
      </div>
    </div>
  );
}
