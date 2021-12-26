import React, { useEffect } from "react";

import Sidebar from "../components/Sidebar";

import Chatbar from "../components/Chatbar";
import CenterPlayList from "../components/CenterPlayList";

import { getSession } from "next-auth/react";

export default function playlist() {
  return (
    <div className="bg-[#0f0f0f] h-[calc(100vh-6rem)] scrollbar-hide overflow-hidden text-white">
      <main className="flex h-full ">
        <Sidebar />
        <CenterPlayList />
        <Chatbar />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return { props: { session } };
}
