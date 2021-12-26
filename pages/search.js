import React from "react";
import { getSession } from "next-auth/react";
import Head from "next/head";

import Sidebar from "../components/Sidebar";
import Player from "../components/Player";
import Chatbar from "../components/Chatbar";

export default function search() {
  return (
    <div className="bg-[#0f0f0f] h-screen scrollbar-hide overflow-hidden text-white">
      <main className="flex h-full ">
        <Sidebar />
        <h1>search</h1>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return { props: { session } };
}
