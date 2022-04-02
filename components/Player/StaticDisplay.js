import clsx from "clsx";
import React, { useState, useEffect, useRef } from "react";

export default function StaticDisplay({ currentTrack }) {
  const [songOverflow, setSongOverflow] = useState(false);

  const songNameReference = useRef();

  useEffect(() => {
    const reference = songNameReference.current;

    reference && setSongOverflow(reference.scrollWidth > reference.clientWidth);
  }, [songOverflow]);

  return (
    <article
      className="w-full h-full flex p-2 items-center space-x-3"
      aria-label="current track playing"
    >
      <img src={currentTrack?.album?.images[0].url} className="w-14 h-14" />
      <div className="space-y-1 overflow-hidden">
        <div
          className="overflow-hidden whitespace-nowrap"
          ref={songNameReference}
        >
          <span
            className={clsx(
              "text-sm text-white font-medium",
              songOverflow && "scroller"
            )}
          >
            {currentTrack?.name}
          </span>
        </div>
        <div className="text-sm text-gray-400">
          {currentTrack?.artists[0].name}
        </div>
      </div>
    </article>
  );
}

/**
 * https://stackoverflow.com/questions/42012130/how-to-detect-overflow-of-react-component-without-reactdom
 */
