import clsx from "clsx";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../context/socket.context";
import useCurrentTrack from "../../hooks/useCurrentTrack";

export default function CurrentTrackDisplay() {
  const { socket, EVENTS } = useContext(SocketContext);
  const currentTrack = useCurrentTrack({ socket, EVENTS });

  const [songNameOverflow, setSongNameOverflow] = useState(false);

  const songNameReference = useRef();

  useEffect(() => {
    const determineScroll = (reference) => {
      if (!reference) return;
      setSongNameOverflow(reference.offsetWidth < reference.scrollWidth);
    };

    determineScroll(songNameReference.current);
  }, [songNameOverflow, currentTrack]);

  if (!currentTrack) return <div className="flex items-center space-x-4"></div>;

  return (
    <div className="flex items-center space-x-1">
      <img
        src={currentTrack?.album?.images[0].url}
        alt={`album cover of ${currentTrack?.album?.name} by ${currentTrack?.artists[0].name}`}
        className="hidden md:inline h-10 w-10"
      />
      <div className="w-[6.5rem] xxs:w-[9rem] xs:w-[15rem] sm:w-[17rem] overflow-hidden">
        <div
          className={clsx(
            "text-xs font-medium text-clip whitespace-nowrap w-full",
            songNameOverflow && "scroller"
          )}
          ref={songNameReference}
        >
          {currentTrack?.name}
        </div>

        <p className="text-xs w-28 text-clip overflow-hidden whitespace-nowrap">
          {currentTrack?.artists[0].name}
        </p>
      </div>
    </div>
  );
}
