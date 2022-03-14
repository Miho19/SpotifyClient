import React from "react";

import { ChevronDownIcon } from "@heroicons/react/solid";
import { useSession, getSession, signOut } from "next-auth/react";

export default function UserDisplay() {
  const { data: session, loading } = useSession();

  return (
    <div className="flex items-center justify-end w-full pr-1">
      <div className="bg-black bg-opacity-70 hover:bg-opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white font-medium inline-flex space-x-1 sm:space-x-3 items-center">
        <img
          className="rounded-full w-7 h-7 ml-1 sm:ml-0"
          src={session?.user.image}
          alt=""
        />
        <h2 className="hidden lg:block ">{session?.user.name}</h2>
        <ChevronDownIcon className="h-5 w-5 lg:block" />
      </div>
    </div>
  );
}
