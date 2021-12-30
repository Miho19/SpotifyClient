import { useSession } from "next-auth/react";
import React, { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

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
    GET_CURRENT_ROOM: "GET_CURRENT_ROOM",
    CHANGED_PARTYPLAYLIST: "CHANGED_PARTYPLAYLIST"
  },
  SERVER: {
    CLIENT_JOINED_ROOM: "CLIENT_JOINED_ROOM",
    CLIENT_LEFT_ROOM: "CLIENT_LEFT_ROOM",
    EMIT_MESSAGE: "EMIT_MESSAGE",
    ROOM_MEMBERS_CHANGED: "ROOM_MEMBERS_CHANGED",
    ROOM_PLAYLIST_CHANGED: "ROOM_PLAYLIST_CHANGED"
  },
};

export default function SocketContextProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { data: session, loading } = useSession();

  useEffect(() => {
    if (typeof window.document !== "undefined") {
      const socketIO =  io("http://localhost:4000")
      setSocket(socketIO);

      socketIO?.data = {
        user: {
          name: session?.user.name,
          imgSource: session?.user.image,
          email: session?.user.email,
        },
      };
    }
    return () => socket?.close();
  }, []);

  useEffect(() => {
    socket?.on("connect", () => {
      socket.emit(EVENTS.CLIENT.SET_USER_PROFILE, {
        ...socket.data.user,
      });
    });
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        EVENTS,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
