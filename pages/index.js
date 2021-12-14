import { getSession } from "next-auth/react";
import Head from "next/head";

import Sidebar from "../components/Sidebar";
import Player from "../components/Player";
import Chatbar from "../components/Chatbar";

export default function Home() {
  return (
    <div className="bg-black h-screen scrollbar-hide overflow-hidden">
      <main className="flex h-full ">
        <Sidebar />
        <div className="flex flex-grow w-full"></div>
        <Chatbar />
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return { props: { session } };
}
