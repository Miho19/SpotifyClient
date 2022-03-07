import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import Dayjs from "dayjs";
import UserIcon from "@heroicons/react/solid/UserIcon";

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

const generateChat = (
  { message, senderID, senderName, senderImgSource, messageID, time },
  userID
) => (
  <div
    key={messageID}
    className=" text-white group flex flex-col items-start cursor-pointer w-full"
  >
    <span
      className={`${
        userID !== senderID ? `bg-[#1DB954]` : `bg-[#0e0b0b]`
      } h-auto text-white text-lg font-normal rounded-md max-w-full p-1 break-all`}
    >
      {message}
    </span>
    <div className="flex w-full h-5 mt-1 items-center">
      {senderImgSource ? (
        <img
          src={senderImgSource}
          alt="user profile picture"
          className="w-5 h-5 rounded-full ml-1 mr-2"
        />
      ) : (
        <UserIcon className="w-5 h-5 rounded-full ml-1 mr-2" />
      )}
      <span className="hidden group-hover:inline text-white text-sm">
        {senderName}
      </span>
      <span className="hidden group-hover:inline text-white text-sm ml-auto ">
        {generateTime(time)}
      </span>
    </div>
  </div>
);

const generateAdminChat = ({ message, messageID, time }) => (
  <div key={messageID} className="flex justify-center text-gray-400 text-xs">
    <span>{message}</span>
  </div>
);

export default function useMessages({ socket, EVENTS }) {
  const [messages, setMessages] = useState([]);

  const { data: session, loading } = useSession();

  useEffect(() => {
    const receiveMessage = ({
      message,
      senderID,
      senderName,
      senderImgSource,
      messageID,
      time,
    }) => {
      console.log(senderName);

      const newMessage =
        senderID === "__ADMIN__"
          ? generateAdminChat({ message, messageID, time })
          : generateChat(
              {
                message,
                senderID,
                senderName,
                senderImgSource,
                messageID,
                time,
              },
              socket.id
            );

      setMessages((messages) => [...messages, newMessage]);
    };

    socket?.on(EVENTS.SERVER.EMIT_MESSAGE, receiveMessage);

    return () => {
      socket?.off(EVENTS.SERVER.EMIT_MESSAGE, receiveMessage);
    };
  }, [socket]);

  return messages;
}
