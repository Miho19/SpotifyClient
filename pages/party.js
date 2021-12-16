import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";

import Chatbar from "../components/Chatbar";

import { SocketContext } from "../context/socket.context";
import Party from "../components/Party";

export default function party() {
  const { socket, EVENTS } = useContext(SocketContext);

  return (
    <div className="bg-[#0f0f0f] h-[calc(100vh-6rem)] scrollbar-hide overflow-hidden">
      <main className="flex h-full ">
        <Sidebar />
        <Party />
        <Chatbar />
      </main>
    </div>
  );
}
