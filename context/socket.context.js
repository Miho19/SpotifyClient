import { useSession } from "next-auth/react";
import React, { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import useMessages from "../hooks/useMessages";

import useRoom from "../hooks/useRoom";

export const SocketContext = createContext();

export const MessagesContext = createContext();

const EVENTS = {
  connection: "connection",
  disconnect: "disconnect",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    SET_USER_PROFILE: "SET_USER_PROFILE",
    JOIN_ROOM: "JOIN_ROOM",
    SEND_MESSAGE: "SEND_MESSAGE",
    LEAVE_ROOM: "LEAVE_ROOM",
    GET_ROOM_MEMBERS: "GET_ROOM_MEMBERS",
    GET_ROOM_LIST: "GET_ROOM_LIST",
    GET_ROOM_PLAYLISTID: "GET_ROOM_PLAYLISTID",
  },
  SERVER: {
    CLIENT_JOINED_ROOM: "CLIENT_JOINED_ROOM",
    CLIENT_LEFT_ROOM: "CLIENT_LEFT_ROOM",
    EMIT_MESSAGE: "EMIT_MESSAGE",
    SEND_ROOM_MEMBERS: "SEND_ROOM_MEMBERS",
    SEND_ROOM_LIST: "SEND_ROOM_LIST",
    SEND_ROOM_PLAYLISTID: "SEND_ROOM_PLAYLISTID",
  },
};

export default function SocketContextProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { data: session, loading } = useSession();
  const { room, roomMembers, roomList, getRoomList, partyPlaylistObject } =
    useRoom({
      socket,
      EVENTS,
    });
  const messages = useMessages({ socket, EVENTS });

  useEffect(() => {
    if (typeof window.document !== "undefined") {
      const socketIO = io("http://localhost:4000");
      setSocket(socketIO);
    }

    return () => socket?.close();
  }, []);

  useEffect(() => {
    socket?.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socket?.on("connect", () => {
      socket.data = {
        user: {
          name: session?.user.name,
          imgSource: session?.user.image,
          email: session?.user.email,
        },
      };

      socket.emit(EVENTS.CLIENT.SET_USER_PROFILE, { ...socket.data.user });
    });

    return () => socket?.off("connect");
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        EVENTS,
        room,
        roomMembers,
        roomList,
        getRoomList,
        partyPlaylistObject,
      }}
    >
      <MessagesContext.Provider value={messages}>
        {children}
      </MessagesContext.Provider>
    </SocketContext.Provider>
  );
}
