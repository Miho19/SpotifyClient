import React, { useContext } from "react";

import { RoomContext } from "../../context/socket.context";

export default function RoomItem({ name, totalMembers, roomJoinLink }) {
  const { joinRoom } = useContext(RoomContext);

  return (
    <li>
      <button
        className=" bg-[rgb(7,7,7)] hover:bg-white/25 cursor-pointer text-xs sm:text-sm group grid grid-row-2 grid-flow-col h-10 w-full transition-all"
        onClick={() => {
          joinRoom({ roomJoinLink });
        }}
      >
        <div className="h-full text-white font-medium text-[15px] row-span-1 pt-2 px-5">
          {name}
        </div>
        <div className="h-full text-white font-medium row-span-1 text-right pt-2 px-5">{`Members: ${totalMembers}`}</div>
      </button>
    </li>
  );
}
