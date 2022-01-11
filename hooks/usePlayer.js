import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import useSpotify from "./useSpotify";

export default function usePlayer({ socket, EVENTS }) {
  const [isActive, setIsActive] = useState(false);
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

  return isActive;
}
