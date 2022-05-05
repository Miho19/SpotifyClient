import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { generateChat } from "../../util/message";
export default function ChatMessageList() {
  const messageEndReference = useRef(null);
  const rawMessages = useSelector((state) => state.message.data.messages);

  const messages = rawMessages.map((message) => generateChat(message));

  useEffect(() => {
    messageEndReference.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [rawMessages]);

  return (
    <div className="flex flex-col h-[65%] w-full bg-[#050404] mt-1 p-1 overflow-scroll scrollbar-hide space-y-2">
      {messages}
      <div ref={messageEndReference} />
    </div>
  );
}
