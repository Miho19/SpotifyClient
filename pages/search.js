import React from "react";
import { getSession } from "next-auth/react";
import Head from "next/head";

import Sidebar from "../components/Sidebar";
import Player from "../components/Player";
import Chatbar from "../components/Chatbar";

export default function search() {
  return (
    <div className="bg-black h-screen scrollbar-hide overflow-hidden text-white">
      <main className="flex h-full ">
        <Sidebar />
        <h1>search</h1>
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}
