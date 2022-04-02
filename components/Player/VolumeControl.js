import { VolumeOffIcon, VolumeUpIcon } from "@heroicons/react/outline";

import { debounce } from "lodash";

import React, { useState, useEffect, useCallback, useContext } from "react";
import { PlayerContext } from "../../context/socket.context";

import useSpotify from "../../hooks/useSpotify";

export default function VolumeControl() {
  const [volume, setVolume] = useState(50);
  const spotifyApi = useSpotify();

  const { isActive: playerActive } = useContext(PlayerContext);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      const volumeAdjust = async () => {
        try {
          const volumeAdjustResponse = await spotifyApi.setVolume(volume);
        } catch (error) {
          console.error("volume adjustment error: ", error);
        }
      };
      volumeAdjust();
    }, 300),
    [volume]
  );

  useEffect(() => {
    if (!spotifyApi || !spotifyApi.getAccessToken()) return;
    if (!playerActive) return;

    if (volume >= 0 && volume <= 100) {
      return debouncedAdjustVolume(volume);
    }
  }, [volume]);

  return (
    <form
      className="flex space-x-1 sm:justify-end w-full h-full items-center justify-center"
      aria-label="control playback volume"
      onSubmit={(e) => e.preventDefault()}
    >
      <label htmlFor="playback volume" className="block pt-1">
        {volume === 0 ? (
          <button aria-label="unmute playback" onClick={() => setVolume(50)}>
            <VolumeOffIcon className="button" />
          </button>
        ) : (
          <button aria-label="mute playback" onClick={() => setVolume(0)}>
            <VolumeUpIcon className="button" />
          </button>
        )}
      </label>

      <input
        aria-label="playback volume"
        type="range"
        value={volume}
        min={0}
        max={100}
        id="playback volume"
        className="w-10 xxs:w-14 xs:w-20"
        onChange={(e) => setVolume(Number(e.target.value))}
      />
    </form>
  );
}
