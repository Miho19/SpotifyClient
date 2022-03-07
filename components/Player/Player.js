import React from "react";

import CurrentTrackDisplay from "./CurrentTrackDisplay";

import VolumeControl from "./VolumeControl";
import PlayerControls from "./PlayerControls";

export default function Player() {
  return (
    <div className=" sticky bottom-0 h-24 bg-[#1a1a1a] text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8 overflow-hidden w-full">
      <CurrentTrackDisplay />
      <PlayerControls />
      <VolumeControl />
    </div>
  );
}
