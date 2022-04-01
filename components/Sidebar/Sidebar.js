import React, { useContext } from "react";

import { useRouter } from "next/router";

import Link from "next/link";

import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/solid";
import { LogoutIcon } from "@heroicons/react/outline";
import UserPlayLists from "./UserPlayLists";
import { DrawerContext } from "../../context/drawers.context";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const router = useRouter();
  const { isChatOpen, isSidebarOpen, setDrawerStatus } =
    useContext(DrawerContext);

  if (isSidebarOpen)
    return (
      <aside className="text-gray-500 pl-6 pr-8 pt-8 pb-8 border-r border-gray-900 bg-black h-[calc(100vh-6rem)] scrollbar-hide text-sm min-w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] sm:max-w-[14rem] sm:min-w-[14rem]">
        <nav className="w-full h-full">
          <div className="space-y-4">
            <header className="flex justify-between">
              <button
                aria-label="close sidebar"
                onClick={() => {
                  setDrawerStatus("CLOSE", "SIDEBAR");
                }}
              >
                <ArrowLeftIcon className="w-5 h-5 text-white/50 hover:text-white/60 hover:bg-white/20 hover:rounded-full " />
              </button>

              <button
                aria-label="sign out"
                onClick={() => {
                  signOut();
                }}
              >
                <LogoutIcon className="w-5 h-5 text-red-600 cursor-pointer button" />
              </button>
            </header>
            <hr className="border-t-[0.1px] border-gray-900" />

            <Link href="/">
              <button
                className={`cursor-pointer flex items-center space-x-2 hover:text-white ${
                  router.pathname === "/" && `text-white font-bold`
                }`}
              >
                <HomeIcon className="h-5 w-5" />
                <p>Home</p>
              </button>
            </Link>

            <hr className="border-t-[0.1px] border-gray-900" />
          </div>

          <UserPlayLists />
        </nav>
      </aside>
    );

  return (
    <button
      className="max-h-[calc(100vh-6rem)]  bg-black/20 max-w-[1rem] min-w-[1rem] group flex items-center justify-center cursor-pointer hover:bg-black/80"
      onClick={() => {
        setDrawerStatus("OPEN", "SIDEBAR");
      }}
      aria-label="open sidebar"
    >
      <HomeIcon className="w-5 h-5 text-white/60 group-hover:text-white/100 group-hover:bg-white/20 group-hover:rounded-full " />
    </button>
  );
}
