import {
  RewindIcon,
  PauseIcon,
  PlayIcon,
  FastForwardIcon,
} from "@heroicons/react/solid";

import React, { useContext } from "react";
import { SocketContext } from "../context/socket.context";

import { useRouter } from "next/router";
import useCurrentTrack from "../hooks/useCurrentTrack";

export default function PlayerControls() {
  const { socket, EVENTS } = useContext(SocketContext);

  const [currentTrack, isPaused] = useCurrentTrack({ socket, EVENTS });

  const router = useRouter();

  const handlePause = async () => {
    if (!spotifyApi) return;
    if (!spotifyApi.getAccessToken()) return;

    if (!room.roomID) {
      return router.push("/party");
    }
  };

  return (
    <div className="flex items-center justify-center space-x-5 lg:space-x-10">
      <RewindIcon className="button" />
      {!isPaused ? (
        <PauseIcon className="button w-10 h-10" onClick={handlePause} />
      ) : (
        <PlayIcon className="button w-10 h-10" onClick={handlePause} />
      )}
      <FastForwardIcon className="button" />
    </div>
  );
}
