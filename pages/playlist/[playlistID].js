import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import DrawersContextProvider from "../../context/drawers.context";
import Sidebar from "../../components/Sidebar/Sidebar";
import CenterPlayList from "../../components/Sidebar/CenterPlayList";
import Chatbar from "../../components/Chatbar/Chatbar";
import { getUserPlaylistObject } from "../../features/userPlaylistSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { setUserProfile } from "../../features/socketSlice";

export default function Playlist() {
  const router = useRouter();
  const { data: session, loading } = useSession();
  const { playlistID } = router.query;

  const dispatch = useDispatch();

  useEffect(() => {
    const { name, email, image, type } = session.user;
    dispatch(getUserPlaylistObject(playlistID));
    dispatch(setUserProfile({ name, email, imgSource: image, type }));
  }, [dispatch, playlistID, session]);

  return (
    <div className="bg-[#0f0f0f] h-[calc(100vh-6rem)] scrollbar-hide overflow-hidden">
      <main className="flex h-full w-full flex-grow">
        <DrawersContextProvider>
          <Sidebar />
          <CenterPlayList />
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
