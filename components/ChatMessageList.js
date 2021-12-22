import React, { useState, useEffect, useRef, useContext } from "react";
import { MessagesContext } from "../context/socket.context";

export default function ChatMessageList() {
  const messages = useContext(MessagesContext);

  const messageEndReference = useRef(null);
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
