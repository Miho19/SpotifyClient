import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Chatbar from "../components/Chatbar/Chatbar";
import Party from "../components/Party/Party";
import { getSession } from "next-auth/react";
import DrawersContextProvider from "../context/drawers.context";

export default function party() {
  return (
    <div className="bg-[#161616] h-[calc(100vh-6rem)] w-full scrollbar-hide overflow-hidden">
      <main className="flex h-full w-full">
        <DrawersContextProvider>
          <Sidebar />
          <Party />
          <Chatbar />
        </DrawersContextProvider>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return { props: { session } };
}
