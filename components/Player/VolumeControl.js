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
          console.log(error);
        }
      };
      volumeAdjust();
    }, 500),
    [volume]
  );

  useEffect(() => {
    if (!spotifyApi || !spotifyApi.getAccessToken()) return;
    if (!playerActive) return;

    if (volume >= 0 && volume <= 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  return (
    <div className="flex items-center justify-center space-x-1 sm:justify-end w-full">
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
        className="w-10 xxs:w-14 xs:w-20"
        onChange={(e) => setVolume(Number(e.target.value))}
      />
    </div>
  );
}
