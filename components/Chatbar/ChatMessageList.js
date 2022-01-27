import React, { useState, useEffect, useRef, useContext } from "react";
import { SocketContext } from "../../context/socket.context";
import useMessages from "../../hooks/useMessages";

export default function ChatMessageList() {
  const messageEndReference = useRef(null);

  const { socket, EVENTS } = useContext(SocketContext);

  const messages = useMessages({ socket, EVENTS });

  useEffect(() => {
    messageEndReference.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  return (
    <div className="flex flex-col h-[65%] w-full bg-[#050404] mt-1 p-1 overflow-scroll scrollbar-hide">
      {messages}
      <div ref={messageEndReference} />
    </div>
  );
}
