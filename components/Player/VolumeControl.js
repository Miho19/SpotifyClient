import { VolumeOffIcon, VolumeUpIcon } from "@heroicons/react/outline";

import { debounce } from "lodash";

import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { PlayerContext, SpotifySDKContext } from "../../context/socket.context";

import useSpotify from "../../hooks/useSpotify";

/**
 *
 * Volume using the playerObject is based on range [0, 1].
 * Volume using spotifyApi is based on percentage [0, 100%].
 */

export default function VolumeControl() {
  const [volume, setVolume] = useState(10);
  const spotifyApi = useSpotify();

  const { isActive: playerActive } = useContext(PlayerContext);
  const { playerObject } = useContext(SpotifySDKContext);

  const volumeAdjust = useMemo(
    () =>
      debounce(async () => {
        const setPlayerVolume = async () => {
          if (volume < 0 || volume > 100) return;
          if (!playerObject) return;

          try {
            const playerVolumeAdjust = await playerObject.setVolume(
              Number(volume / 100)
            );
          } catch (error) {
            console.error("volume adjustment error: ", error);
          }
        };

        setPlayerVolume(volume);
      }, [150]),
    [playerObject, volume]
  );

  const debouncedAdjustVolume = useCallback(() => {
    volumeAdjust();
  }, [volumeAdjust]);

  useEffect(() => {
    if (!spotifyApi || !spotifyApi.getAccessToken()) return;
    if (!playerActive) return;

    if (volume >= 0 && volume <= 100) {
      return debouncedAdjustVolume();
    }
  }, [volume, spotifyApi, playerActive, debouncedAdjustVolume]);

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

// https://github.com/facebook/react/issues/19240#issuecomment-652945246
