import React, { useState, useEffect } from "react";

import useSpotify from "./useSpotify";

export default function usePlayer({ socket, EVENTS }) {
  const [isPaused, setIsPaused] = useState(false);
  const spotifyApi = useSpotify();

  useEffect(() => {
    const songChanged = async ({ uri, progress }) => {
      const playResponse = await spotifyApi.play({
        uris: [uri],
        position_ms: progress,
      });
    };

    socket?.on(EVENTS.SERVER.ROOM_PLAYLIST_SONG_CHANGED, songChanged);

    return () => {
      socket?.off(EVENTS.SERVER.ROOM_PLAYLIST_SONG_CHANGED, songChanged);
    };
  }, [socket]);

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
      const playResponse = await spotifyApi.play({
        context_uri: `spotify:playlist:${playlistID}`,
        offset: { position: 0 },
      });

      socket.emit(EVENTS.CLIENT.HOST_CHANGE_SONG);

      const getPlaylistResponse = await spotifyApi.getPlaylist(playlistID);
      const { snapshot_id } = getPlaylistResponse.body;

      socket.data.user.host = true;
      callback({ playlistID, snapshotID: snapshot_id });
    };

    socket?.on(EVENTS.SERVER.HOST_INIT, handleHostInit);
    return () => {
      socket?.off(EVENTS.SERVER.HOST_INIT, handleHostInit);
    };
  }, [socket]);

  const togglePlayback = () => {
    socket?.emit(EVENTS.CLIENT.TOGGLE_PLAYBACK, { left: false });
  };

  useEffect(() => {
    const handleToggle = async ({ left, uri, progress }) => {
      try {
        if (left) {
          const pauseResponse = await spotifyApi.pause();
          setIsPaused(true);
        }

        const getCurrentStateResponse =
          await spotifyApi.getMyCurrentPlaybackState();

        console.log(getCurrentStateResponse);
        const { is_playing: isPlaying } = getCurrentStateResponse.body;
        setIsPaused(!isPlaying);

        isPlaying
          ? await spotifyApi.pause()
          : await spotifyApi.play({
              uris: [uri],
              position_ms: progress,
            });
      } catch (error) {
        console.error(error);
      }
    };

    socket?.on(EVENTS.SERVER.CLIENT_TOGGLED_PLAYBACK, handleToggle);
    return () => {
      socket?.off(EVENTS.SERVER.CLIENT_TOGGLED_PLAYBACK, handleToggle);
    };
  }, [socket]);

  return { isPaused, togglePlayback };
}
