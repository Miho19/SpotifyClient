import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

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
  { message, senderID, messageID, time },
  userID,
  imgSource,
  userName
) => (
  <div
    key={messageID}
    className=" p-1 text-white group flex flex-col items-start cursor-pointer"
    onClick={(e) => console.log()}
  >
    <span
      className={`${
        userID === senderID ? `bg-[#1DB954]` : `bg-black`
      }  h-auto text-white text-md font-normal rounded-md max-w-full text-clip overflow-hidden p-2 `}
    >
      {message}
    </span>
    <div className="flex w-full h-5 mt-1 items-center">
      <img
        src={imgSource}
        alt="user profile picture"
        className="w-5 h-5 rounded-full ml-1 mr-2"
      />
      <span className="hidden group-hover:inline text-white text-sm">
        {userName}
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
    if (typeof window.document !== "undefined") {
      socket?.on(
        EVENTS.SERVER.EMIT_MESSAGE,
        ({ message, senderID, messageID, time }) => {
          const newMessage =
            senderID === "__ADMIN__"
              ? generateAdminChat({ message, messageID, time })
              : generateChat(
                  { message, senderID, messageID, time },
                  socket.id,
                  session?.user.image,
                  session?.user.name
                );

          setMessages((messages) => [...messages, newMessage]);
        }
      );
    }

    return () => {
      socket?.off(EVENTS.SERVER.EMIT_MESSAGE);
    };
  }, [socket]);

  return messages;
}
