import React, { useContext } from "react";
import { SocketContext } from "../../context/socket.context";
import useCurrentTrack from "../../hooks/useCurrentTrack";

export default function CurrentTrackDisplay() {
  const { socket, EVENTS } = useContext(SocketContext);
  const currentTrack = useCurrentTrack({ socket, EVENTS });

  if (!currentTrack) return <div className="flex items-center space-x-4"></div>;

  return (
    <div className="flex items-center space-x-1">
      <img
        src={currentTrack?.album?.images[0].url}
        alt={`album cover of ${currentTrack?.album?.name} by ${currentTrack?.artists[0].name}`}
        className="hidden md:inline h-10 w-10"
      />
      <div>
        <h3 className="text-xs font-medium w-[6.5rem] text-clip overflow-hidden whitespace-nowrap">
          {currentTrack?.name}
        </h3>
        <p className="text-xs w-28 text-clip overflow-hidden whitespace-nowrap">
          {currentTrack?.artists[0].name}
        </p>
      </div>
    </div>
  );
}
