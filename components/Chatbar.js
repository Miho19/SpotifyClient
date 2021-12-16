import { ChatIcon, HomeIcon, UserAddIcon } from "@heroicons/react/solid";
import React, { useState, useEffect, useRef, useContext } from "react";
import useSpotify from "../hooks/useSpotify";
import { useSession } from "next-auth/react";
import { SocketContext } from "../context/socket.context";
import { Socket } from "socket.io-client";
import Dayjs from "dayjs";

const generateTime = (time) => {
  const timeDayjs = Dayjs(time);
  const now = Dayjs();

  if (now.diff(timeDayjs, "month") > 12) {
    return timeDayjs.format("DD:MM:YYYY");
  }

  if (now.diff(timeDayjs, "day") > 7) {
    return timeDayjs.format("DD:MM");
  }

  return timeDayjs.format("ddd HH:mm A ");
};

const generateChat = ({ message, email, id, time }, session) => (
  <div
    key={id}
    className=" p-1 text-white group flex flex-col items-start cursor-pointer"
    onClick={(e) => console.log()}
  >
    <span
      className={`${
        email === session?.user?.email ? `bg-[#1DB954]` : `bg-black`
      }  h-auto text-white text-md font-normal rounded-md max-w-full text-clip overflow-hidden p-2 `}
    >
      {message}
    </span>
    <div className="flex w-full h-5 mt-1 items-center">
      <img
        src={session?.user?.image}
        alt="user profile picture"
        className="w-5 h-5 rounded-full ml-1 mr-2"
      />
      <span className="hidden group-hover:inline text-white text-sm">
        {session?.user?.name}
      </span>
      <span className="hidden group-hover:inline text-white text-sm ml-auto ">
        {generateTime(time)}
      </span>
    </div>
  </div>
);

const generateAdminChat = ({ message, id, time }) => (
  <div key={id} className="flex justify-center text-gray-400 text-xs">
    <span>{message}</span>
  </div>
);

export default function Chatbar() {
  const { data: session, loading } = useSession();
  const [value, setValue] = useState("");
  const messageEndReference = useRef(null);
  const { socket, EVENTS, messages, setMessages, room } =
    useContext(SocketContext);

  useEffect(() => {
    messageEndReference.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  return (
    <div className="min-w-[20rem] max-w-[20rem] max-h-[calc(100vh-6rem)] flex flex-col justify-start items-start bg-black ">
      <header className="flex w-full h-10 items-center justify-start pt-5 pb-5">
        <h2 className="text-lg text-white ml-5 font-medium">
          {room.roomId ? `${room.roomName}` : `Party Chat`}
        </h2>
        <UserAddIcon className="w-5 h-5 text-white/50 ml-auto mr-5 hover:text-white/60 hover:bg-white/20 hover:rounded-full " />
      </header>

      <div className="flex flex-col h-[65%] w-full bg-[#050404] mt-1 p-1 overflow-scroll scrollbar-hide">
        {messages.map((message, index) => {
          return message.email === "__ADMIN__"
            ? generateAdminChat(message)
            : generateChat(message, session);
        })}
        <div ref={messageEndReference} />
      </div>
      <div className="flex items-center h-[10%] w-full group bg-black">
        <input
          disabled={!room.roomId}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className=" max-w-full rounded-full border text-lg focus:outline-none ml-4 mr-2 pl-4 pr-[3rem] mt-4 mb-4 py-2"
          placeholder={!room.Id ? "Join or Create a Party" : "Say Something..."}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            if (value.length === 0) return;

            socket.emit(EVENTS.CLIENT.SEND_MESSAGE, {
              message: value,
              email: session.user.email,
              roomID: socket.id,
            });

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
      <div className="flex h-[25%] overflow-scroll scrollbar-hide w-full bg-black"></div>
    </div>
  );
}
