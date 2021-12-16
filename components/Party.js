import React, { useState, useContext } from "react";
import { SocketContext } from "../context/socket.context";

export default function Party() {
  const [value, setValue] = useState("");
  const { socket, EVENTS, messages, setMessages, room } =
    useContext(SocketContext);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide bg-[#242424] ">
      <main className="flex flex-col p-8 justify-center items-center">
        <div className="flex items-center group">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className=" max-w-full rounded-full border text-lg focus:outline-none ml-4 mr-2 pl-4 pr-[3rem] mt-4 mb-4 py-2"
            placeholder={"Create Party"}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              if (value.length === 0) return;
              socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName: value });
              setValue("");
            }}
          />
          <span
            className={`items-center border-0 pr-4 ml-[-3rem]  ${
              value.length > 0 ? `flex` : `hidden`
            }`}
          >
            <button className="" onClick={(e) => setValue("")}>
              X
            </button>
          </span>
        </div>
        <button
          className="bg-white text-black p-1 rounded-full"
          onClick={() => {
            socket.emit(EVENTS.CLIENT.LEAVE_ROOM);
          }}
        >
          Leave Party
        </button>
      </main>
    </div>
  );
}
