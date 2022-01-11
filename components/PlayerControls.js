import {
  RewindIcon,
  PauseIcon,
  PlayIcon,
  FastForwardIcon,
} from "@heroicons/react/solid";

import React, { useContext } from "react";
import { SocketContext } from "../context/socket.context";

export default function PlayerControls({ isPaused, togglePlayback }) {
  return (
    <div className="flex items-center justify-center space-x-5 lg:space-x-10">
      <RewindIcon className="button" />
      {!isPaused ? (
        <PauseIcon className="button w-10 h-10" onClick={togglePlayback} />
      ) : (
        <PlayIcon className="button w-10 h-10" onClick={togglePlayback} />
      )}
      <FastForwardIcon className="button" />
    </div>
  );
}
