import { useSession } from "next-auth/react";
import React, { createContext, useState, useEffect, useContext } from "react";
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
  },
  SERVER: {
    CLIENT_JOINED_ROOM: "CLIENT_JOINED_ROOM",
    CLIENT_LEFT_ROOM: "CLIENT_LEFT_ROOM",
    EMIT_MESSAGE: "EMIT_MESSAGE",
    SEND_ROOM_MEMBERS: "SEND_ROOM_MEMBERS",
    SEND_ROOM_LIST: "SEND_ROOM_LIST",
  },
};

export default function SocketContextProvider(props) {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState({ roomID: "", roomName: "" });
  const [messages, setMessages] = useState([]);
  const { data: session, loading } = useSession();

  useEffect(() => {
    if (typeof window.document !== "undefined") {
      const socketIO = io("http://localhost:4000");
      setSocket(socketIO);
    }

    return () => socket?.close();
  }, []);

  useEffect(() => {
    socket?.on("connect", () => {
      socket.data = {
        user: {
          name: session.user.name,
          imgSource: session.user.image,
          email: session.user.email,
        },
      };
      socket.emit(EVENTS.CLIENT.SET_USER_PROFILE, { ...socket.data.user });
    });

    socket?.on(EVENTS.SERVER.EMIT_MESSAGE, ({ message, email, id, time }) => {
      setMessages((messages) => [...messages, { message, email, id, time }]);
    });

    socket?.on(EVENTS.SERVER.CLIENT_JOINED_ROOM, ({ roomID, roomName }) => {
      setRoom({ roomID: roomID, roomName: roomName });
    });

    socket?.on(EVENTS.SERVER.CLIENT_LEFT_ROOM, () => {
      setMessages([]);
      setRoom({ roomID: "", roomName: "" });
    });

    return () => socket?.close();
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{ socket, EVENTS, messages, room }}
      {...props}
    />
  );
}
