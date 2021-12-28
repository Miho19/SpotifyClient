import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from "../context/socket.context";

export default function ChatbarForm() {
  const [value, setValue] = useState("");

  const { socket, EVENTS } = useContext(SocketContext);
  const [room, setRoom] = useState({});

  useEffect(() => {
    const joinRoom = ({ roomID, roomName }) => {
      setRoom({ roomID: roomID, roomName: roomName });
    };
    socket?.on(EVENTS.SERVER.CLIENT_JOINED_ROOM, joinRoom);

    return () => {
      socket?.off(EVENTS.SERVER.CLIENT_JOINED_ROOM, joinRoom);
    };
  }, [socket, room]);

  return (
    <div className="flex items-center h-[10%] w-full group bg-black">
      <input
        disabled={!room.roomID}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className=" max-w-full rounded-full border text-lg focus:outline-none ml-4 mr-2 pl-4 pr-[3rem] mt-4 mb-4 py-2"
        placeholder={!room.roomID ? "Join a Party" : "Say Something..."}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          if (value.length === 0) return;

          socket.emit(EVENTS.CLIENT.SEND_MESSAGE, {
            message: value,
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
  );
}
