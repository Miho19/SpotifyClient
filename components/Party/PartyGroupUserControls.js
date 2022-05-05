import { LogoutIcon } from "@heroicons/react/solid";
import React from "react";

import { leaveRoom } from "../../features/socketSlice";
import { useDispatch } from "react-redux";

export default function PartyGroupUserControls() {
  const dispatch = useDispatch();

  return (
    <div className="w-full h-full bg-black flex items-center ">
      <LogoutIcon
        className="w-5 h-5 text-red-500 ml-auto mr-4  hover:text-red-400 hover:bg-white/20 hover:rounded-full cursor-pointer"
        onClick={() => {
          dispatch(leaveRoom());
        }}
      />
    </div>
  );
}
