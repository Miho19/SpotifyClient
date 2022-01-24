import {
  RewindIcon,
  PauseIcon,
  PlayIcon,
  FastForwardIcon,
} from "@heroicons/react/solid";

import React from "react";

export default function PlayerControls({ isPaused, togglePlayback }) {
  return (
    <div className="flex items-center justify-center space-x-5 lg:space-x-10">
      <RewindIcon className="button opacity-20 hover:opacity-10" />
      {!isPaused ? (
        <PauseIcon className="button w-10 h-10" onClick={togglePlayback} />
      ) : (
        <PlayIcon className="button w-10 h-10" onClick={togglePlayback} />
      )}
      <FastForwardIcon className="button opacity-20 hover:opacity-10" />
    </div>
  );
}
