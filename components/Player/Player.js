import React from "react";

import CurrentTrackDisplay from "./CurrentTrackDisplay";

import VolumeControl from "./VolumeControl";
import PlayerControls from "./PlayerControls";

export default function Player() {
  return (
    <div className=" sticky bottom-0 h-24 bg-[#1a1a1a] text-white grid grid-cols-3 text-xs md:text-base overflow-hidden w-full border border-gray-700 sm:px-4">
      <CurrentTrackDisplay />
      <PlayerControls />
      <VolumeControl />
    </div>
  );
}
