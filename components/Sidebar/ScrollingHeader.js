import React from "react";
import { HomeIcon } from "@heroicons/react/solid/";

export default function ScrollingHeader({ color, imgSource, playlistName }) {
  return (
    <header
      className={`space-x-2 w-full h-12 flex items-center px-2 bg-gradient-to-b ${color} to-[#0f0f0f]`}
    >
      <img
        className="w-5 h-5 button"
        src={imgSource}
        alt={`${playlistName} playlist cover`}
      />

      <div className="text-sm font-medium text-white">{playlistName}</div>
    </header>
  );
}
