import React, { useContext, useEffect, useState } from "react";
import { UserAddIcon } from "@heroicons/react/solid";
import { SocketContext } from "../context/socket.context";
import PartyMember from "./PartyMember";

import PartyGroupUserControls from "./PartyGroupUserControls";

export default function PartyGroup() {
  const { socket, EVENTS } = useContext(SocketContext);
  const [roomMembers, setRoomMembers] = useState([]);

  const [room, setRoom] = useState({});

  useEffect(() => {
    socket.emit(EVENTS.CLIENT.GET_ROOM_MEMBERS);
  }, []);

  useEffect(() => {
    const getMembers = ({ roomMembers }) => {
      setRoomMembers(roomMembers);
    };
    socket?.on(EVENTS.SERVER.SEND_ROOM_MEMBERS, getMembers);

    return () => {
      socket?.off(EVENTS.SERVER.SEND_ROOM_MEMBERS, getMembers);
    };
  }, [socket, roomMembers]);

  const memberList = roomMembers.map((user) => (
    <PartyMember
      name={user.name}
      imgSource={user.imgSource}
      key={user.name}
      time={user.timeJoined}
    />
  ));

  return (
    <div className="h-full w-full flex flex-col">
      <header className="flex w-full h-10 items-center justify-start pt-5 pb-5">
        <h2 className=" text-white ml-5 font-medium text-xs sm:text-lg lg:text-sm xl:text-lg">
          {`Members: ${memberList.length}`}
        </h2>
        <UserAddIcon className="w-5 h-5 text-white/50 ml-auto mr-5 hover:text-white/60 hover:bg-white/20 hover:rounded-full hidden xs:inline lg:hidden lgg:inline" />
      </header>
      <main className="w-full h-[calc(100%-2.5rem)] overflow-scroll scrollbar-hide space-y-1">
        {memberList}
      </main>
      <footer className="w-full min-h-[2rem] max-h-[2.5rem]">
        <PartyGroupUserControls />
      </footer>
    </div>
  );
}
