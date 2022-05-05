import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Chatbar from "../components/Chatbar/Chatbar";
import PartyMain from "../components/Party/Party";
import { getSession } from "next-auth/react";
import DrawersContextProvider from "../context/drawers.context";
import { useDispatch } from "react-redux";
import { connect, disconnect, setUserProfile } from "../features/socketSlice";

import { useSession } from "next-auth/react";

export default function Party() {
  const { data: session, loading } = useSession();

  const dispatch = useDispatch();

  useEffect(() => {
    const { name, email, image, type } = session.user;
    dispatch(connect());
    dispatch(setUserProfile({ name, email, imgSource: image, type }));
  }, [dispatch, session]);

  return (
    <div className="bg-[#161616] h-[calc(100vh-6rem)] w-full scrollbar-hide overflow-hidden">
      <main className="flex h-full w-full">
        <DrawersContextProvider>
          <Sidebar />
          <PartyMain />
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
