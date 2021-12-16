import { getSession } from "next-auth/react";
import Head from "next/head";

import Sidebar from "../components/Sidebar";

import Chatbar from "../components/Chatbar";

export default function Home() {
  return (
    <div className="bg-[#0f0f0f] h-[calc(100vh-6rem)] overflow-hidden scrollbar-hide ">
      <main className="flex h-full ">
        <Sidebar />
        <div className="flex flex-grow w-full"></div>
        <Chatbar />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return { props: { session } };
}
