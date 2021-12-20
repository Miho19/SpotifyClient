import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";

import Chatbar from "../components/Chatbar";

import { SocketContext } from "../context/socket.context";
import Party from "../components/Party";

import { getSession } from "next-auth/react";

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

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return { props: { session } };
}
