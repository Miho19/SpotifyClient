import { UserAddIcon } from "@heroicons/react/solid";
import React, { useContext, useState, useEffect } from "react";

import ChatMessageList from "./ChatMessageList";
import ChatbarForm from "./ChatbarForm";
import { SocketContext } from "../../context/socket.context";
import RoomList from "../Room/RoomList";
import PartyGroup from "../Party/PartyGroup";

export default function Chatbar() {
  const { socket, EVENTS } = useContext(SocketContext);
  const [room, setRoom] = useState({});

  useEffect(() => {
    const joinRoom = ({ roomID, roomName }) => {
      setRoom({ roomID: roomID, roomName: roomName });
    };

    const leaveRoom = () => {
      setRoom({});
    };

    socket?.on(EVENTS.SERVER.CLIENT_JOINED_ROOM, joinRoom);
    socket?.on(EVENTS.SERVER.CLIENT_LEFT_ROOM, leaveRoom);

    return () => {
      socket?.off(EVENTS.SERVER.CLIENT_JOINED_ROOM, joinRoom);
      socket?.off(EVENTS.SERVER.CLIENT_LEFT_ROOM, leaveRoom);
    };
  }, [socket, room]);

  useEffect(() => {
    const initRoom = ({ roomID, roomName }) => {
      if (!roomID || !roomName) setRoom({});
      setRoom({ roomID: roomID, roomName: roomName });
    };

    socket?.emit(EVENTS.CLIENT.GET_CURRENT_ROOM, initRoom);
  }, [socket]);

  return (
    <div className="min-w-[20rem] max-w-[20rem] max-h-[calc(100vh-6rem)] flex flex-col justify-start items-start bg-black ">
      <header className="flex w-full h-10 items-center justify-start pt-5 pb-5">
        <h2 className="text-lg text-white ml-5 font-medium">
          {room.roomID ? `${room.roomName}` : `Party Chat`}
        </h2>
        <UserAddIcon className="w-5 h-5 text-white/50 ml-auto mr-5 hover:text-white/60 hover:bg-white/20 hover:rounded-full " />
      </header>

      <ChatMessageList />
      <ChatbarForm roomID={room.roomID} />

      <div className="flex h-[25%] overflow-scroll scrollbar-hide w-full bg-black">
        <div className=" bg-black w-full">
          {room.roomID ? <PartyGroup /> : <RoomList />}
        </div>
      </div>
    </div>
  );
}
