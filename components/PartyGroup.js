import React, { useContext, useEffect, useState } from "react";
import { UserAddIcon } from "@heroicons/react/solid";
import { SocketContext } from "../context/socket.context";
import PartyMember from "./PartyMember";

const addTest = (memberList) => {
  for (let i = 0; i < 30; i++) {
    memberList.push(
      <PartyMember
        name={"Sam Man"}
        imgSource={socket?.data.user.imgSource}
        key={`Sam Man ${i}`}
      />
    );
  }
};

export default function PartyGroup() {
  const { socket, EVENTS, messages, setMessages, room } =
    useContext(SocketContext);

  const [partyMembers, setPartyMembers] = useState([]);

  useEffect(() => {
    if (typeof window.document !== "undefined" && socket) {
      socket?.emit(EVENTS.CLIENT.GET_ROOM_MEMBERS, { roomID: room.roomID });
    }

    socket?.on(EVENTS.SERVER.SEND_ROOM_MEMBERS, ({ roomMembers }) => {
      setPartyMembers(roomMembers);
    });
  }, [room, socket]);

  const memberList = partyMembers.map((user) => (
    <PartyMember name={user.name} imgSource={user.imgSource} key={user.name} />
  ));

  return (
    <div className="h-full w-full flex flex-col">
      <header className="flex w-full h-10 items-center justify-start pt-5 pb-5">
        <h2 className="text-lg text-white ml-5 font-medium">
          {partyMembers.length > 0
            ? `Group Members: ${memberList.length}`
            : `Join a Party`}
        </h2>
        <UserAddIcon className="w-5 h-5 text-white/50 ml-auto mr-5 hover:text-white/60 hover:bg-white/20 hover:rounded-full " />
      </header>
      <div className="w-full h-[100%-2.5rem] overflow-scroll scrollbar-hide space-y-1">
        {memberList}
      </div>
    </div>
  );
}
