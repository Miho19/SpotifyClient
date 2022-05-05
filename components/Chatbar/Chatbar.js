import { ArrowRightIcon, ChatIcon } from "@heroicons/react/solid";
import React, { useContext } from "react";

import ChatMessageList from "./ChatMessageList";
import ChatbarForm from "./ChatbarForm";
import RoomList from "../Room/RoomList";
import PartyGroup from "../Party/PartyGroup";
import { DrawerContext } from "../../context/drawers.context";

import { useSelector } from "react-redux";

export default function Chatbar() {
  const { isChatOpen, isSidebarOpen, setDrawerStatus } =
    useContext(DrawerContext);

  const { id: roomID, name: roomName } = useSelector(
    (state) => state.room.data
  );

  if (isChatOpen)
    return (
      <aside className=" max-w-[calc(100vw-1rem)] min-w-[calc(100vw-1rem)] md:min-w-[18rem] md:max-w-[18rem] max-h-[calc(100vh-6rem)] flex flex-col justify-start items-start bg-black ">
        <header className="flex w-full h-10 items-center justify-start pt-5 pb-5">
          <h2 className="text-lg text-white ml-5 font-medium">
            {roomID ? `${roomName}` : `Party Chat`}
          </h2>
          <button
            className="ml-auto mr-5"
            aria-label="close chatbar"
            onClick={() => setDrawerStatus("CLOSE", "CHATBAR")}
          >
            <ArrowRightIcon className="w-5 h-5 text-white/50  hover:text-white/60 hover:bg-white/20 hover:rounded-full " />
          </button>
        </header>

        <ChatMessageList />
        <ChatbarForm roomID={roomID} />

        <div className="flex h-[25%] overflow-scroll scrollbar-hide w-full bg-black">
          <div className=" bg-black w-full">
            {roomID ? <PartyGroup /> : <RoomList />}
          </div>
        </div>
      </aside>
    );

  return (
    <button
      aria-label="open chatbar"
      className="max-h-[calc(100vh-6rem)] bg-black/20 w-[1rem] group flex items-center justify-center cursor-pointer hover:bg-black/80"
      onClick={() => setDrawerStatus("OPEN", "CHATBAR")}
    >
      <ChatIcon className="w-5 h-5 text-white/60 group-hover:text-white/100 group-hover:bg-white/20 group-hover:rounded-full " />
    </button>
  );
}
