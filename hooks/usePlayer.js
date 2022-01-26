import { signOut } from "next-auth/react";
import React, { useState, useEffect } from "react";

import useSpotify from "./useSpotify";

export default function usePlayer({ socket, EVENTS }) {
  const [isPaused, setIsPaused] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const spotifyApi = useSpotify();

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
    const handleHostInit = async ({ playlistID }, callback) => {
      const getCurrentStateResponse =
        await spotifyApi.getMyCurrentPlaybackState();

      if (!getCurrentStateResponse.body) {
        signOut();
        alert("Must have an active spotify device.");
        return;
      }

      setIsActive(true);
      setIsPaused(false);

      const playResponse = await spotifyApi.play({
        context_uri: `spotify:playlist:${playlistID}`,
        offset: { position: 0 },
        position_ms: 0,
      });

      console.log("play response:", playResponse);

      const getPlaylistResponse = await spotifyApi.getPlaylist(playlistID);
      const { snapshot_id } = getPlaylistResponse.body;

      socket.data.user.host = true;
      socket.emit(EVENTS.CLIENT.HOST_CHANGE_SONG);
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

    getActive();
  }, []);

  return { isPaused, isActive };
}
