import React, { useState, useEffect, useRef, useContext } from "react";
import { RoomContext, SocketContext } from "../../context/socket.context";
import useMessages from "../../hooks/useMessages";

export default function ChatMessageList() {
  const messageEndReference = useRef(null);

  const { messages } = useContext(RoomContext);

  useEffect(() => {
    messageEndReference.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  return (
    <div className="flex flex-col h-[65%] w-full bg-[#050404] mt-1 p-1 overflow-scroll scrollbar-hide space-y-2">
      {messages}
      <div ref={messageEndReference} />
    </div>
  );
}
