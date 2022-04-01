import { SessionProvider, signOut, useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

import useSpotify from "./useSpotify";

export default function usePlayer({ socket, EVENTS }) {
  const [isPaused, setIsPaused] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isHost, setIsHost] = useState(false);

  const spotifyApi = useSpotify();
  const { data: session, loading } = useSession();

  useEffect(() => {
    const handleGetSong = async (callback) => {
      if (!spotifyApi.getAccessToken()) return;

      let { body: playbackState } =
        await spotifyApi.getMyCurrentPlaybackState();

      if (playbackState) {
        callback({
          uri: playbackState.item.uri,
          progress: playbackState.progress_ms,
          timestamp: playbackState.timestamp,
        });
      }
    };

    socket?.on(EVENTS.SERVER.HOST_GET_SONG, handleGetSong);
    return () => {
      socket?.off(EVENTS.SERVER.HOST_GET_SONG, handleGetSong);
    };
  }, [socket]);

  useEffect(() => {
    const setHostStatus = ({ status }) => {
      setIsHost(status);
    };

    socket?.on(EVENTS.SERVER.CLIENT_SET_HOST, setHostStatus);

    return () => {
      socket?.off(EVENTS.SERVER.CLIENT_SET_HOST, setHostStatus);
    };
  }, [socket]);

  useEffect(() => {
    const handleHostInit = async ({ playlistID }, callback) => {
      try {
        if (session.user.type === "guest") return callback({}, "free");

        const getCurrentStateResponse =
          await spotifyApi.getMyCurrentPlaybackState();

        if (!getCurrentStateResponse.body) {
          signOut();
          alert("Must have an active spotify device."); // create a display
          return;
        }

        setIsActive(true);
        setIsPaused(false);
      } catch (error) {
        console.error(error);
        console.log("host init: get current song");
      }

      const getUserProfile = await spotifyApi.getMe();

      if (getUserProfile.body.product !== "premium") {
        return callback({}, "free");
      }

      // const playResponse = await spotifyApi.play({
      //   context_uri: `spotify:playlist:${playlistID}`,
      //   offset: { position: 0 },
      //   position_ms: 0,
      // });

      const getPlaylistResponse = await spotifyApi.getPlaylist(playlistID);
      const { snapshot_id } = getPlaylistResponse.body;

      socket.data.user.host = true;
      setIsHost(true);
      callback({ playlistID, snapshotID: snapshot_id });
    };

    socket?.on(EVENTS.SERVER.HOST_INIT, handleHostInit);
    return () => {
      socket?.off(EVENTS.SERVER.HOST_INIT, handleHostInit);
    };
  }, [socket]);

  useEffect(() => {
    const getActive = async () => {
      if (!spotifyApi || !spotifyApi.getAccessToken()) return;

      const getCurrentStateResponse =
        await spotifyApi.getMyCurrentPlaybackState();
      getCurrentStateResponse.body ? setIsActive(true) : setIsActive(false);
    };

    if (!session) return;

    session.user.type !== "guest" && getActive();
  }, []);

  const togglePlayback = () => {};

  return { isPaused, isActive, isHost, togglePlayback };
}
