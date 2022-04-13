import { useSession } from "next-auth/react";
import React, { useEffect, useState, useRef } from "react";

import useSpotify from "./useSpotify";

export default function useSpotifyWedSDK({ socket, EVENTS }) {
  const spotifyApi = useSpotify();
  const { data: session, loading } = useSession();

  const [deviceID, setDeviceID] = useState("");
  const [playerObject, setPlayerObject] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [repeatMode, setRepeatMode] = useState(true);

  const scriptReference = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !spotifyApi.getAccessToken()) return;
    if (session.user.type === "guest") return;

    const script = window.document.createElement("script");

    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.id = "SpotifyWebSDKScript";
    window.document.body.appendChild(script);

    scriptReference.current = script;

    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = spotifyApi.getAccessToken();
      const player = new window.Spotify.Player({
        name: "Spotify Party",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.1,
      });

      player.addListener("ready", ({ device_id }) => {
        setPlayerObject(player);
        setDeviceID(device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log(`Device ${device_id} has gone offline`);
      });

      player.addListener("autoplay_failed", () => {
        console.log("Autoplay is not allowed by the browser autoplay rules");
      });

      player.on("playback_error", ({ message }) => {
        console.error("Failed to perform playback", message);
      });
      player.on("account_error", ({ message }) => {
        console.error("Failed to validate Spotify account", message);
      });
      player.on("authentication_error", ({ message }) => {
        console.error("Failed to authenticate", message);
      });
      player.on("initialization_error", ({ message }) => {
        console.error("Failed to initialize", message);
      });

      player.connect();
    };

    return async () => {
      const iframes = await window.document.getElementsByTagName("iframe");

      for (let i = 0; i < iframes.length; i++) {
        const frame = iframes.item(i);
        frame.parentNode.removeChild(frame);
      }

      scriptReference.current && scriptReference.current.remove();
    };
  }, []);

  useEffect(() => {
    const setSDKActive = async (playlistID, callback) => {
      if (!playerObject) return;
      if (spotifyApi && !spotifyApi.getAccessToken()) return;
      if (session.user.type === "guest") return;

      try {
        const transferResponse = await spotifyApi.transferMyPlayback(
          [deviceID],
          {
            play: true,
          }
        );

        const playResponse = await spotifyApi.play({
          context_uri: `spotify:playlist:${playlistID}`,
          offset: { position: 0 },
          position_ms: 0,
          device_id: deviceID,
        });

        callback(transferResponse.statusCode !== 204 ? "PLAYER_FAILED" : "");

        if (transferResponse.statusCode !== 204) return;

        setIsPaused(false);
      } catch (error) {
        console.log(error);
      }

      socket.emit(EVENTS.CLIENT.HOST_CHANGE_SONG);
    };

    socket?.on(EVENTS.SERVER.HOST_START_PLAYER, setSDKActive);

    return () => {
      socket?.off(EVENTS.SERVER.HOST_START_PLAYER, setSDKActive);
    };
  }, [socket, playerObject, deviceID, EVENTS, spotifyApi, session]);

  useEffect(() => {
    const disconnectPlayer = () => {
      if (typeof window === "undefined") return;
      if (session.user.type === "guest") return;

      playerObject.disconnect();
    };

    socket?.on(EVENTS.SERVER.CLIENT_LEFT_ROOM, disconnectPlayer);
    return () => {
      socket?.off(EVENTS.SERVER.CLIENT_LEFT_ROOM, disconnectPlayer);
    };
  }, [socket, playerObject, session, EVENTS]);

  const togglePlayback = () => {
    playerObject.togglePlay();
    setIsPaused(!isPaused);
  };

  const checkRepeatStatus = async () => {
    if (repeatMode) {
      const repeatModeResponse = await spotifyApi.setRepeat("context");
      setRepeatMode(false);
    }
  };

  const skipToPrevious = async () => {
    await checkRepeatStatus();
    try {
      playerObject.previousTrack();
    } catch (error) {
      console.log("no previous?");
    }

    socket.emit(EVENTS.CLIENT.HOST_CHANGE_SONG);
  };

  const skipToNext = async () => {
    await checkRepeatStatus();
    playerObject.nextTrack();
    socket.emit(EVENTS.CLIENT.HOST_CHANGE_SONG);
  };

  return {
    playerObject,
    deviceID,
    isPaused,
    togglePlayback,
    skipToPrevious,
    skipToNext,
  };
}
