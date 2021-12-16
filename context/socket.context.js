import { useSession } from "next-auth/react";
import React, { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const EVENTS = {
  connection: "connection",
  disconnect: "disconnect",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    JOIN_ROOM: "JOIN_ROOM",
    SEND_MESSAGE: "SEND_MESSAGE",
    LEAVE_ROOM: "LEAVE_ROOM",
  },
  SERVER: {
    CLIENT_JOINED_ROOM: "CLIENT_JOINED_ROOM",
    CLIENT_LEFT_ROOM: "CLIENT_LEFT_ROOM",
    EMIT_MESSAGE: "EMIT_MESSAGE",
  },
};

export default function SocketContextProvider(props) {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState({ roomId: "", roomName: "" });
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (typeof window.document !== "undefined") {
      const socketIO = io("http://localhost:4000");
      setSocket(socketIO);
    }

    return () => socket?.close();
  }, []);

  useEffect(() => {
    socket?.on(EVENTS.SERVER.EMIT_MESSAGE, ({ message, email, id, time }) => {
      setMessages((messages) => [...messages, { message, email, id, time }]);
    });

    socket?.on(EVENTS.SERVER.CLIENT_JOINED_ROOM, ({ roomId, roomName }) => {
      setRoom({ roomId: roomId, roomName: roomName });
    });

    socket?.on(EVENTS.SERVER.CLIENT_LEFT_ROOM, () => {
      setMessages([]);
      setRoom({ roomId: "", roomName: "" });
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
