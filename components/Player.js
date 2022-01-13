import React, { useContext } from "react";
import { SocketContext } from "../context/socket.context";

import CurrentTrackDisplay from "./CurrentTrackDisplay";
import usePlayer from "../hooks/usePlayer";
import VolumeControl from "./VolumeControl";
import PlayerControls from "./PlayerControls";

export default function Player() {
  const { socket, EVENTS } = useContext(SocketContext);

  const { isPaused, togglePlayback, isActive } = usePlayer({ socket, EVENTS });

  return (
    <div className=" sticky bottom-0 h-24 bg-[#1a1a1a] text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8 overflow-hidden">
      <CurrentTrackDisplay />
      <PlayerControls
        isPaused={isPaused}
        togglePlayback={togglePlayback}
        playerActive={isActive}
      />
      <VolumeControl playerActive={isActive} />
    </div>
  );
}
