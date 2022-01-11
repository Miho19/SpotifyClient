import { VolumeOffIcon, VolumeUpIcon } from "@heroicons/react/outline";
import {
  RewindIcon,
  PauseIcon,
  PlayIcon,
  FastForwardIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";

import React, { useState, useEffect, useCallback, useContext } from "react";
import { SocketContext } from "../context/socket.context";

import useSpotify from "../hooks/useSpotify";

import { useRouter } from "next/router";
import useCurrentTrack from "../hooks/useCurrentTrack";

import CurrentTrackDisplay from "./CurrentTrackDisplay";
import usePlayer from "../hooks/usePlayer";
import VolumeControl from "./VolumeControl";
import PlayerControls from "./PlayerControls";

export default function Player() {
  const { socket, EVENTS } = useContext(SocketContext);

  const isActive = usePlayer({ socket, EVENTS });

  const spotifyApi = useSpotify();

  const [room, setRoom] = useState({});

  useEffect(() => {
    const initRoom = ({ roomID, roomName }) => {
      if (!roomID || !roomName) setRoom({});
      setRoom({ roomID: roomID, roomName: roomName });
    };

    socket?.emit(EVENTS.CLIENT.GET_CURRENT_ROOM, initRoom);
  }, [socket]);

  useEffect(() => {
    const joinRoom = ({ roomID, roomName }) => {
      setRoom({ roomID: roomID, roomName: roomName });
    };

    const leaveRoom = async () => {
      setRoom({});
      const pauseResponse = await spotifyApi.pause();
    };

    socket?.on(EVENTS.SERVER.CLIENT_JOINED_ROOM, joinRoom);
    socket?.on(EVENTS.SERVER.CLIENT_LEFT_ROOM, leaveRoom);

    return () => {
      socket?.off(EVENTS.SERVER.CLIENT_JOINED_ROOM, joinRoom);
      socket?.off(EVENTS.SERVER.CLIENT_LEFT_ROOM, leaveRoom);
    };
  }, [socket, room]);

  return (
    <div className=" sticky bottom-0 h-24 bg-[#1a1a1a] text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8 overflow-hidden">
      <CurrentTrackDisplay />
      <PlayerControls />
      <VolumeControl />
    </div>
  );
}
