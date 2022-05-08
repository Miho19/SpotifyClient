import { useSession } from "next-auth/react";
import React, { createContext, useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { getTrack } from "../features/trackSlice";
import useSpotify from "../hooks/useSpotify";
import EVENTS from "../util/events";
import { getSocket } from "../util/socket";

const socket = getSocket();

export const SpotifySDKContext = createContext({ playerObject: null });

export default function SpotifySDKProvider({ children }) {
  const [SDKObject, setSDKObject] = useState({});
  const scriptReference = useRef(null);

  const { data: session, loading } = useSession();

  const spotifyApi = useSpotify();

  const songReference = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!spotifyApi.getAccessToken()) return;
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
        name: "Spotify Friends",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.1,
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("SpotifyWebSDK connected");
        setSDKObject({ player, deviceID: device_id });
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log(`Device ${device_id} has gone offline`);
      });

      player.addListener("autoplay_failed", () => {
        console.log("Autoplay is not allowed by the browser autoplay rules");
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) return;
        if (!songReference.current) songReference.current = state.playback_id;
        if (state.playback_id !== songReference.current) {
          songReference.current = state.playback_id;
          dispatch(getTrack({ id: state.track_window.current_track.id }));
        }
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
      const iframes = window.document.getElementsByTagName("iframe");

      for (let i = 0; i < iframes.length; i++) {
        const frame = iframes.item(i);
        frame.parentNode.removeChild(frame);
      }

      scriptReference.current && scriptReference.current.remove();
    };
  }, []);

  useEffect(() => {
    const setSDKActive = async (playlistID, callback) => {
      if (!SDKObject.player) return;
      if (!spotifyApi.getAccessToken()) return;
      if (session.user.type === "guest") return;

      try {
        const transferPlayback = await spotifyApi.transferMyPlayback(
          [SDKObject.deviceID],
          { play: true }
        );

        const playResponse = await spotifyApi.play({
          context_uri: `spotify:playlist:${playlistID}`,
          offset: { position: 0 },
          position_ms: 0,
          device_id: SDKObject.deviceID,
        });

        callback("");
      } catch (error) {
        console.error(error);
        callback("PLAYER_FAILED");
        SDKObject.player.disconnect();
      }

      socket.emit(EVENTS.CLIENT.HOST_CHANGE_SONG);
    };
    socket.on(EVENTS.SERVER.HOST_START_PLAYER, setSDKActive);

    return () => {
      socket.off(EVENTS.SERVER.HOST_START_PLAYER, setSDKActive);
    };
  }, [SDKObject, spotifyApi, session]);

  return (
    <SpotifySDKContext.Provider value={SDKObject}>
      {children}
    </SpotifySDKContext.Provider>
  );
}
