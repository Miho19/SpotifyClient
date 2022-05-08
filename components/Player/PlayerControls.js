import {
  RewindIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FastForwardIcon,
} from "@heroicons/react/solid";

import React, { useContext, useEffect, useState } from "react";

import EVENTS from "../../util/events";

import { getSocket } from "../../util/socket";

export default function PlayerControls() {
  const [isHost, setIsHost] = useState(false);
  const socket = getSocket();

  const addAndSkipPrevious = () => {};

  const removeAndSkipNext = () => {};

  useEffect(() => {
    const handleStartPlayer = () => {
      setIsHost(true);
    };
    socket.on(EVENTS.SERVER.HOST_START_PLAYER, handleStartPlayer);

    return () => {
      socket.off(EVENTS.SERVER.HOST_START_PLAYER, handleStartPlayer);
    };
  }, [socket]);

  useEffect(() => {
    const handleLeaveRoom = () => {
      setIsHost(false);
    };

    socket.on(EVENTS.SERVER.CLIENT_LEFT_ROOM, handleLeaveRoom);

    return () => socket.off(EVENTS.SERVER.CLIENT_LEFT_ROOM, handleLeaveRoom);
  }, [socket]);

  return (
    <article
      className="flex items-center justify-center lg:space-x-10 w-full"
      aria-label="playback controls"
    >
      {isHost && (
        <button aria-label="skip to previous song" onClick={addAndSkipPrevious}>
          <RewindIcon className={`button`} />
        </button>
      )}

      <div className="h-full  flex flex-col text-center justify-center">
        <ChevronUpIcon className="button w-7 h-7 text-green-500" />
        <p className="text-white text-lg font-medium">-0</p>
        <ChevronDownIcon className="button w-7 h-7 text-red-600" />
      </div>

      {isHost && (
        <button aria-label="skip to next song" onClick={removeAndSkipNext}>
          <FastForwardIcon className={`button`} />
        </button>
      )}
    </article>
  );
}
