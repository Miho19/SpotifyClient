import { VolumeOffIcon, VolumeUpIcon } from "@heroicons/react/outline";

import { debounce } from "lodash";

import React, { useState, useEffect, useCallback } from "react";

import useSpotify from "../../hooks/useSpotify";

export default function VolumeControl({ playerActive }) {
  const [volume, setVolume] = useState(30);
  const spotifyApi = useSpotify();

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
  );
}
