import {
  RewindIcon,
  PauseIcon,
  PlayIcon,
  FastForwardIcon,
} from "@heroicons/react/solid";

import React, { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../../context/socket.context";

export default function PlayerControls() {
  const { isPaused, isHost, togglePlayback } = useContext(PlayerContext);

  return (
    <article
      className="flex items-center justify-center lg:space-x-10 w-full"
      aria-label="playback controls"
    >
      {isHost && (
        <button aria-label="skip to previous song">
          <RewindIcon className="button opacity-20 hover:opacity-10" />
        </button>
      )}

      {!isPaused ? (
        <button aria-label="pause playback" onClick={togglePlayback}>
          <PauseIcon className="button w-10 h-10" />
        </button>
      ) : (
        <button aria-label="resume playback" onClick={togglePlayback}>
          <PlayIcon className="button w-10 h-10" />
        </button>
      )}

      {isHost && (
        <button aria-label="skip to next song">
          <FastForwardIcon className="button opacity-20 hover:opacity-10" />
        </button>
      )}
    </article>
  );
}
