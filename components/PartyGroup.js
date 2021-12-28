import React, { useContext, useEffect, useState } from "react";
import { UserAddIcon } from "@heroicons/react/solid";
import { SocketContext } from "../context/socket.context";
import PartyMember from "./PartyMember";
import Dayjs from "dayjs";
import PartyGroupUserControls from "./PartyGroupUserControls";

export default function PartyGroup() {
  const { roomMembers } = useContext(SocketContext);

  const memberList = roomMembers.map((user) => (
    <PartyMember
      name={user.name}
      imgSource={user.imgSource}
      key={user.name}
      time={user.timeJoined}
    />
  ));

  const add = () => {
    let now = Dayjs();
    for (let i = 0; i < 50; i++) {
      memberList.push(
        <PartyMember
          name={`user ${i}`}
          imgSource={`data:image/png;base64,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`}
          key={i}
          time={now}
        />
      );
    }
  };

  add();

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
