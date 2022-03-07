import React, { useContext } from "react";

import { useRouter } from "next/router";

import Link from "next/link";

import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/solid";
import { LogoutIcon } from "@heroicons/react/outline";
import UserPlayLists from "./UserPlayLists";
import { DrawerContext } from "../../context/drawers.context";

const active = "text-white font-bold";

export default function Sidebar() {
  const router = useRouter();
  const { isChatOpen, isSidebarOpen, setDrawerStatus } =
    useContext(DrawerContext);

  if (isSidebarOpen)
    return (
      <div className="text-gray-500 pl-6 pr-8 pt-8 pb-8 border-r border-gray-900 bg-black h-[calc(100vh-6rem)] scrollbar-hide text-sm min-w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] sm:max-w-[14rem] sm:min-w-[14rem]">
        <div className="space-y-4">
          <div className="flex justify-between">
            <ArrowLeftIcon
              className="w-5 h-5 text-white/50 hover:text-white/60 hover:bg-white/20 hover:rounded-full "
              onClick={() => {
                setDrawerStatus("CLOSE", "SIDEBAR");
              }}
            />
            <LogoutIcon className="w-5 h-5 text-red-600 cursor-pointer button" />
          </div>
          <hr className="border-t-[0.1px] border-gray-900" />

          <Link href="/">
            <div
              className={` cursor-pointer flex items-center space-x-2 hover:text-white ${
                router.pathname === "/" ? active : ""
              }`}
            >
              <HomeIcon className="h-5 w-5" />
              <p>Home</p>
            </div>
          </Link>

          <hr className="border-t-[0.1px] border-gray-900" />
        </div>
        <UserPlayLists />
      </div>
    );

  return (
    <div
      className="max-h-[calc(100vh-6rem)] bg-gradient-to-b from-black to-[#292929] max-w-[1rem] min-w-[1rem] group flex items-center justify-center cursor-pointer hover:bg-black/80"
      onClick={() => {
        setDrawerStatus("OPEN", "SIDEBAR");
      }}
    >
      <HomeIcon className="w-5 h-5 text-white/60 group-hover:text-white/100 group-hover:bg-white/20 group-hover:rounded-full " />
    </div>
  );
}
