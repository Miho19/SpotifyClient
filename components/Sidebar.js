import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";

import Link from "next/link";

import {
  HomeIcon,
  SearchIcon,
  PlusCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";

import UserPlayLists from "./UserPlayLists";

const active = "text-white font-bold";

export default function Sidebar() {
  const router = useRouter();

  return (
    <div className="text-gray-500 pl-6 pr-8 pt-8 pb-8 border-r border-gray-900 bg-black h-[calc(100vh-6rem)] scrollbar-hide text-xs lg:text-sm sm:min-w-[10rem] lg:min-w-[13rem] hidden md:inline-flex flex-col">
      <div className="space-y-4">
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

        <Link href="/search" passHref>
          <div
            className={` cursor-pointer flex item-center space-x-2 hover:text-white ${
              router.pathname === "/search" ? active : ""
            }`}
          >
            <SearchIcon className="h-5 w-5" />
            <p>Search</p>
          </div>
        </Link>

        <hr className="border-t-[0.1px] border-gray-900" />
        <button
          className={`flex item-center space-x-2 hover:text-white ${
            router.pathname === "/create" ? active : ""
          }`}
        >
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Party</p>
        </button>
        <button
          className={`flex item-center space-x-2 hover:text-white ${
            router.pathname === "/join" ? active : ""
          }`}
        >
          <UserGroupIcon className="h-5 w-5" />
          <p>Join Party</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />
      </div>
      <UserPlayLists />
    </div>
  );
}
