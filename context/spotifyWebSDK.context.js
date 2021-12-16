import React, { createContext, useState, useEffect, useRef } from "react";
import useSpotify from "../hooks/useSpotify";

const SCRIPT_ID = "SpotifyWebSDKScript";

export const SpotifyWebSDKContext = createContext();

export default function SpotifyWebSDKContextProvider({ children }) {
  const spotifyApi = useSpotify();

  const [player, setPlayer] = useState(null);
  const [currentTrack, setTrack] = useState(null);
  const [webPlayerActive, setWebPlayerActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (typeof window.document === "undefined") return;

    if (spotifyApi.getAccessToken() === undefined) return;

    let timerBeforeAutoplay = null;

    const script = window.document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.id = SCRIPT_ID;
    window.document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Spotify Party",
        getOAuthToken: (callback) => {
          callback(spotifyApi.getAccessToken());
        },
        volume: 0.5,
      });
      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        // spotifyApi
        //   .transferMyPlayback([device_id])
        //   .then(() => {
        //     timerBeforeAutoplay = setTimeout(() => {
        //       //player.resume();
        //     }, 300);
        //   })
        //   .catch((e) => console.log(e));
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log(`Device ${device_id} has gone offline`);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) return;

        setTrack(state.track_window.current_track);
        setIsPaused(state.paused);

        player.getCurrentState().then((state) => {
          state ? setWebPlayerActive(true) : setWebPlayerActive(false);
        });
      });

      player.addListener("autoplay_failed", () => {
        console.log("Autoplay is not allowed by the browser autoplay rules");
      });

      player.on("playback_error", ({ message }) => {
        console.error("Failed to perform playback", message);
      });

      player.connect();
    };

    return () => {
      //clearTimeout(timerBeforeAutoplay);
    };
  }, []);

  return (
    <SpotifyWebSDKContext.Provider
      value={{ currentTrack, webPlayerActive, isPaused, player }}
    >
      {children}
    </SpotifyWebSDKContext.Provider>
  );
}
