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
import { SpotifyWebSDKContext } from "../context/spotifyWebSDK.context";
import useSpotify from "../hooks/useSpotify";

import { useRouter } from "next/router";

export default function Player() {
  const { currentTrack, isPaused, player, deviceId } =
    useContext(SpotifyWebSDKContext);

  const [otherDevicePlaybackTrack, setOtherDevicePlaybackTrack] =
    useState(null);

  const { socket, EVENTS } = useContext(SocketContext);

  const [volume, setVolume] = useState(10);

  const spotifyApi = useSpotify();

  const [room, setRoom] = useState({});
  const router = useRouter();

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      player?.setVolume(volume / 100);
    }, 500),
    [volume]
  );

  useEffect(() => {
    if (volume >= 0 && volume <= 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const handlePause = async () => {
    if (!player) return;
    if (!spotifyApi) return;

    if (!room.roomID) {
      return router.push("/party");
    }

    const response = await player.getCurrentState();

    if (!response) {
      spotifyApi
        .transferMyPlayback([deviceId])
        .then(() => console.log("device changed"))
        .catch((e) => console.log(e));
    }

    player?.togglePlay();
  };

  useEffect(() => {
    const songChanged = async ({ uri, progress }) => {
      try {
        const playResponse = await spotifyApi.play({
          uris: [uri],
          position_ms: progress,
        });

        const getTrackresponse = await spotifyApi.getMyCurrentPlayingTrack();

        if (getTrackresponse) {
          setOtherDevicePlaybackTrack(getTrackresponse.body?.item);
        }
      } catch (error) {
        console.log(error);
      }
    };

    socket?.on(EVENTS.SERVER.ROOM_PLAYLIST_SONG_CHANGED, songChanged);

    return () => {
      socket?.off(EVENTS.SERVER.ROOM_PLAYLIST_SONG_CHANGED, songChanged);
    };
  }, [socket]);

  useEffect(() => {
    const getTrack = async () => {
      if (currentTrack) {
        return;
      }

      if (!spotifyApi || !spotifyApi.getAccessToken()) {
        return;
      }

      const response = await spotifyApi.getMyCurrentPlayingTrack();

      if (response.body) {
        setOtherDevicePlaybackTrack(response.body?.item);
        return;
      }

      const pastTrack = await spotifyApi.getMyRecentlyPlayedTracks({
        limit: 1,
      });

      setOtherDevicePlaybackTrack(pastTrack.body.items[0].track);
    };

    if (typeof window.document === "undefined") return;

    getTrack();

    return () => {};
  }, []);

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

  useEffect(() => {
    const handleGetSong = async (callback) => {
      if (!spotifyApi.getAccessToken()) return;
      if (!player) return;

      let { body: playbackState } =
        await spotifyApi.getMyCurrentPlaybackState();

      if (playbackState) {
        callback({
          uri: playbackState.item.uri,
          progress: playbackState.progress_ms,
          timestamp: playbackState.timestamp,
        });
      }

      //if you the host with no plyback
    };

    socket?.on(EVENTS.SERVER.HOST_GET_SONG, handleGetSong);

    return () => {
      socket?.off(EVENTS.SERVER.HOST_GET_SONG, handleGetSong);
    };
  }, [socket]);

  useEffect(() => {
    const handleHostInit = async () => {
      if (!player) return;
      if (!spotifyApi) return;

      const playResponse = await spotifyApi.play({
        context_uri: "spotify:playlist:1qzGPv5E2rf7KIeE9wN27Y",
        offset: { position: 0 },
      });
    };

    socket?.on(EVENTS.SERVER.HOST_INIT, handleHostInit);

    return () => {
      socket?.off(EVENTS.SERVER.HOST_INIT, handleHostInit);
    };
  }, [socket, player]);

  return (
    <div className=" sticky bottom-0 h-24 bg-[#1a1a1a] text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8 overflow-hidden">
      <div className="flex items-center space-x-4">
        <img
          src={
            currentTrack
              ? currentTrack?.album?.images[0].url
              : otherDevicePlaybackTrack?.album.images[0].url
          }
          alt={`album cover of ${currentTrack?.album.name} by ${currentTrack?.artists[0].name}`}
          className="hidden md:inline h-10 w-10"
        />
        <div>
          <h3>
            {currentTrack ? currentTrack?.name : otherDevicePlaybackTrack?.name}
          </h3>
          <p className="text-sm">{`${
            currentTrack
              ? currentTrack?.artists[0].name
              : otherDevicePlaybackTrack?.artists[0].name
          }`}</p>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-5 lg:space-x-10">
        <RewindIcon
          className="button"
          onClick={() => player && player.previousTrack()}
        />
        {!isPaused ? (
          <PauseIcon className="button w-10 h-10" onClick={handlePause} />
        ) : (
          <PlayIcon className="button w-10 h-10" onClick={handlePause} />
        )}
        <FastForwardIcon
          className="button"
          onClick={() => player && player.nextTrack()}
        />
      </div>
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        {volume === 0 ? (
          <VolumeOffIcon className="button" onClick={() => setVolume(50)} />
        ) : (
          <VolumeUpIcon className="button" onClick={() => setVolume(0)} />
        )}

        <input
          type="range"
          value={volume}
          min={0}
          max={100}
          className="w-14 md:w-28"
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
