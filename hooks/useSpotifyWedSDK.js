import { useSession } from "next-auth/react";
import React, { useEffect, useState, useRef } from "react";

import useSpotify from "./useSpotify";

export default function useSpotifyWedSDK({ socket, EVENTS }) {
  const spotifyApi = useSpotify();
  const { data: session, loading } = useSession();

  const [deviceID, setDeviceID] = useState("");
  const [playerObject, setPlayerObject] = useState(null);

  const scriptReference = useRef(null);
  const iframeReference = useRef(null);

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
        console.log(`${device_id} ready!`);
        setPlayerObject(player);
        setDeviceID(device_id);
        iframeReference.current = window.document.querySelector("iframe");
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log(`Device ${device_id} has gone offline`);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) return;
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

    return () => {
      iframeReference.current &&
        iframeReference.current.parentNode.removeChild(iframeReference.current);

      scriptReference.current &&
        scriptReference.current.parentNode.removeChild(scriptReference.current);
    };
  }, [spotifyApi, session]);

  useEffect(() => {
    const setSDKActive = async (callback) => {
      if (!playerObject) return;
      if (spotifyApi && !spotifyApi.getAccessToken()) return;
      if (session.user.type === "guest") return;

      const transferResponse = await spotifyApi.transferMyPlayback([deviceID], {
        play: true,
      });

      transferResponse.statusCode !== 204
        ? callback("PLAYER_FAILED")
        : callback() && socket.emit(EVENTS.CLIENT.HOST_CHANGE_SONG);
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

  return { playerObject, deviceID };
}
