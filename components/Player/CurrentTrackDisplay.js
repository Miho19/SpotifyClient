import { debounce } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../../context/socket.context";
import ScrollingDisplay from "./ScrollingDisplay";
import StaticDisplay from "./StaticDisplay";

export default function CurrentTrackDisplay() {
  const { currentTrack } = useContext(PlayerContext);
  const [windowWidth, setWindowWidth] = useState(0);
  const smBreakpoint = 640;

  useEffect(() => {
    const deboucedWidthAdjustment = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 150);

    window.addEventListener("resize", deboucedWidthAdjustment);

    return () => {
      window.removeEventListener("resize", deboucedWidthAdjustment);
    };
  }, [windowWidth]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setWindowWidth(window.innerWidth);
  }, [windowWidth]);

  if (!currentTrack?.id)
    return (
      <article
        className="flex items-center space-x-4 w-full justify-center xs:justify-start xs:px-4"
        aria-label="display no track history"
      >
        <div className="w-14 h-14 rounded-full border-2 border-gray-500 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-gray-500"></div>
        </div>
      </article>
    );

  if (windowWidth >= smBreakpoint)
    return <StaticDisplay currentTrack={currentTrack} />;

  return <ScrollingDisplay currentTrack={currentTrack} />;
}

/**
 * https://stackoverflow.com/questions/45847392/pure-css-continuous-horizontal-text-scroll-without-break
 *
 */
