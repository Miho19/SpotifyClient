import clsx from "clsx";
import { debounce } from "lodash";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SocketContext } from "../../context/socket.context";
import useCurrentTrack from "../../hooks/useCurrentTrack";
import ScrollingDisplay from "./ScrollingDisplay";
import StaticDisplay from "./StaticDisplay";

export default function CurrentTrackDisplay() {
  const { socket, EVENTS } = useContext(SocketContext);
  const currentTrack = useCurrentTrack({ socket, EVENTS });
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

  if (!currentTrack) return <div className="flex items-center space-x-4"></div>;

  if (windowWidth >= smBreakpoint)
    return <StaticDisplay currentTrack={currentTrack} />;

  return <ScrollingDisplay currentTrack={currentTrack} />;
}

/**
 * https://stackoverflow.com/questions/45847392/pure-css-continuous-horizontal-text-scroll-without-break
 *
 */
