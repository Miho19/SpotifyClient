import { ChatIcon, HomeIcon, UserAddIcon } from "@heroicons/react/solid";
import React, { useState, useEffect, useRef } from "react";
import useSpotify from "../hooks/useSpotify";
import { useSession } from "next-auth/react";
// admin chat  <div class="flex justify-center"> <span class="text-gray-500 text-xs pt-4" style="font-size: 8px;">Call started at 02:33 am</span> </div>

const exampleMessages = [
  {
    message: "hello world!",
    email: "joshua28at@hotmail.com",
  },
  {
    message:
      "hello world! this is the supoer logne terweirwtiwriewrjoiwejroiwejroi  jrwe jroiwe orjwo rjwo jrowijr oiwoa ;er ;ewnr owae ornhewoa rj ",
    email: "joshua28at@hotmail.com",
  },

  {
    message:
      "hello world! this is the supoer logne terweirwtiwriewrjoiwejroiwejroi  jrwe jroiwe orjwo rjwo jrowijr oiwoa ;er ;ewnr owae ornhewoa rj ",
    email: "bigman",
  },
];

const generateChat = ({ message, email }, session, index) => (
  <div
    key={index}
    className=" p-1 text-white group flex flex-col items-start"
    onClick={(e) => console.log()}
  >
    <span
      className={`${
        email === session?.user?.email ? `bg-[#1DB954]` : `bg-black`
      }  h-auto text-white text-md font-normal rounded-md px-2 p-2`}
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
    </div>
  </div>
);

export default function Chatbar() {
  const { data: session, loading } = useSession();
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([...exampleMessages]);
  const messageEndReference = useRef(null);

  useEffect(() => {
    messageEndReference.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  return (
    <div className="min-w-[20rem] max-w-[20rem] bg-[#0f0f0f] max-h-[calc(100vh-6rem)] flex flex-col justify-start items-start ">
      <header className="flex w-full h-10 items-center justify-start pt-5 pb-5">
        <h2 className="text-lg text-white ml-5 font-medium">Party Chat</h2>
        <UserAddIcon className="w-5 h-5 text-white/50 ml-auto mr-5 hover:text-white/60 hover:bg-white/20 hover:rounded-full " />
      </header>
      <div className="flex flex-col h-[65%] w-full bg-[#191414] mt-1 p-1 overflow-scroll scrollbar-hide">
        {messages.map((message, index) => {
          return generateChat(message, session, index);
        })}
        <div ref={messageEndReference} />
      </div>
      <div className="flex items-center h-[10%] w-full bg-[#0f0f0f] group">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className=" max-w-full rounded-full border text-lg focus:outline-none ml-4 mr-2 pl-4 pr-[3rem] mt-4 mb-4 py-2"
          placeholder="Say Something..."
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            if (value.length === 0) return;

            setMessages([
              ...messages,
              { message: value, email: session?.user.email },
            ]);
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
      <div className="flex h-[25%] overflow-scroll scrollbar-hide w-full bg-white"></div>
    </div>
  );
}
