import {
  RewindIcon,
  PauseIcon,
  PlayIcon,
  FastForwardIcon,
} from "@heroicons/react/solid";

import React, { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../../context/socket.context";

export default function PlayerControls() {
  const { isPaused, isHost } = useContext(PlayerContext);

  const togglePlayback = () => {
    console.log("playback toggled");
  };

  return (
    <div className="flex items-center justify-center space-x-5 lg:space-x-10">
      {isHost && <RewindIcon className="button opacity-20 hover:opacity-10" />}
      {!isPaused ? (
        <PauseIcon className="button w-10 h-10" onClick={togglePlayback} />
      ) : (
        <PlayIcon className="button w-10 h-10" onClick={togglePlayback} />
      )}

      {isHost && (
        <FastForwardIcon className="button opacity-20 hover:opacity-10" />
      )}
    </div>
  );
}
