import React, { useContext } from "react";
import { SocketContext } from "../context/socket.context";
import useCurrentTrack from "../hooks/useCurrentTrack";

export default function CurrentTrackDisplay() {
  const { socket, EVENTS } = useContext(SocketContext);
  const currentTrack = useCurrentTrack({ socket, EVENTS });

  return (
    <div className="flex items-center space-x-4">
      <img
        src={currentTrack && currentTrack?.album?.images[0].url}
        alt={`album cover of ${currentTrack?.album?.name} by ${currentTrack?.artists[0].name}`}
        className="hidden md:inline h-10 w-10"
      />
      <div>
        <h3>{currentTrack && currentTrack?.name}</h3>
        <p className="text-sm">{`${
          currentTrack && currentTrack?.artists[0].name
        }`}</p>
      </div>
    </div>
  );
}
