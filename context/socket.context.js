import { useSession } from "next-auth/react";
import React, { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import useSpotify from "../hooks/useSpotify";

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
    GET_CURRENT_ROOM: "GET_CURRENT_ROOM",
    CHANGED_PARTYPLAYLIST: "CHANGED_PARTYPLAYLIST",
    HOST_CHANGE_SONG: "HOST_CHANGE_SONG",
    TOGGLE_PLAYBACK: "TOGGLE_PLAYBACK",
  },
  SERVER: {
    CLIENT_TOGGLED_PLAYBACK: "CLIENT_TOGGLED_PLAYBACK",
    CLIENT_JOINED_ROOM: "CLIENT_JOINED_ROOM",
    CLIENT_LEFT_ROOM: "CLIENT_LEFT_ROOM",
    EMIT_MESSAGE: "EMIT_MESSAGE",
    ROOM_MEMBERS_CHANGED: "ROOM_MEMBERS_CHANGED",
    ROOM_PLAYLIST_CHANGED: "ROOM_PLAYLIST_CHANGED",
    ROOM_PLAYLIST_SONG_CHANGED: "ROOM_PLAYLIST_SONG_CHANGED",
    HOST_GET_SONG: "HOST_GET_SONG",
    HOST_INIT: "HOST_INIT",
  },
};

export default function SocketContextProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { data: session, loading } = useSession();

  const URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:4000"
      : "https://spotifyserver1.herokuapp.com/";

  useEffect(() => {
    if (typeof window.document !== "undefined") {
      const socketIO = io(URL);

      setSocket(socketIO);
    }
    return () => socket?.close();
  }, []);

  useEffect(() => {
    socket?.on("connect", () => {
      socket.data = {
        user: {
          name: session?.user.name,
          imgSource: session?.user.image,
          email: session?.user.email,
          host: false,
        },
      };

      socket.emit(EVENTS.CLIENT.SET_USER_PROFILE, {
        ...socket.data.user,
      });
    });

    socket?.on("connect_error", (error) => {
      console.log("connection issues");
      socket.close();
    });

    return () => {};
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
