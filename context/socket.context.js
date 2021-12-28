import { useSession } from "next-auth/react";
import React, { createContext, useEffect, useRef } from "react";
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
  const socketReference = useRef();
  const { data: session, loading } = useSession();

  useEffect(() => {
    if (typeof window.document !== "undefined") {
      socketReference.current = io("http://localhost:4000");
      socketReference.current.data = {
        user: {
          name: session?.user.name,
          imgSource: session?.user.image,
          email: session?.user.email,
        },
      };
    }
    return () => socketReference.current?.close();
  }, []);

  useEffect(() => {
    socketReference.current.on("connect", () => {
      socketReference.current.emit(EVENTS.CLIENT.SET_USER_PROFILE, {
        ...socketReference.current.data.user,
      });
    });
  }, [socketReference.current]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketReference.current,
        EVENTS,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
