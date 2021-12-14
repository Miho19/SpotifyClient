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
  },
  SERVER: {
    UPDATE_ROOM: "UPDATE_ROOM",
    EMIT_MESSAGE: "EMIT_MESSAGE",
  },
};

export default function SocketContextProvider(props) {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState({ roomid: "", roomName: "" });
  const [messages, setMessages] = useState([]);
  const { data: session, loading } = useSession();

  useEffect(() => {
    if (typeof window.document !== "undefined") {
      const socketIO = io("http://localhost:4000");
      setSocket(socketIO);
      setRoom({
        roomid: String(socketIO.id),
        roomName: `${session?.user.name}`,
      });
    }

    return () => socket?.close();
  }, []);

  useEffect(() => {
    socket?.on(EVENTS.SERVER.EMIT_MESSAGE, ({ message, email, id, time }) => {
      setMessages((messages) => [...messages, { message, email, id, time }]);
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
