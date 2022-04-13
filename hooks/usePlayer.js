import { SessionProvider, signOut, useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

import useSpotify from "./useSpotify";

export default function usePlayer({ socket, EVENTS }) {
  const [isHost, setIsHost] = useState(false);

  const spotifyApi = useSpotify();
  const { data: session, loading } = useSession();

  useEffect(() => {
    const handleGetSong = async (callback) => {
      if (!spotifyApi.getAccessToken()) return;

      try {
        let { body: playbackState } =
          await spotifyApi.getMyCurrentPlaybackState();

        if (playbackState) {
          callback({
            uri: playbackState.item.uri,
            progress: playbackState.progress_ms,
            timestamp: playbackState.timestamp,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    socket?.on(EVENTS.SERVER.HOST_GET_SONG, handleGetSong);
    return () => {
      socket?.off(EVENTS.SERVER.HOST_GET_SONG, handleGetSong);
    };
  }, [socket, EVENTS, spotifyApi]);

  useEffect(() => {
    const setHostStatus = ({ status }) => {
      setIsHost(status);
    };

    socket?.on(EVENTS.SERVER.CLIENT_SET_HOST, setHostStatus);

    return () => {
      socket?.off(EVENTS.SERVER.CLIENT_SET_HOST, setHostStatus);
    };
  }, [socket, EVENTS]);

  useEffect(() => {
    const handleHostInit = async ({ playlistID }, callback) => {
      try {
        if (session.user.type === "guest") return callback({}, "free");

        const getCurrentStateResponse =
          await spotifyApi.getMyCurrentPlaybackState();

        if (!getCurrentStateResponse.body) {
          signOut();
          alert("Must have an active spotify device."); // instead of alert, want to display a message
          return;
        }

        const getUserProfile = await spotifyApi.getMe();

        if (getUserProfile.body.product !== "premium") {
          return callback({}, "free");
        }

        const getPlaylistResponse = await spotifyApi.getPlaylist(playlistID);
        const { snapshot_id } = getPlaylistResponse.body;

        socket.data.user.host = true;
        setIsHost(true);
        setIsActive(true);
        callback({ playlistID, snapshotID: snapshot_id });
      } catch (error) {
        console.error(error);
        console.log("host init: get current song");
      }
    };

    socket?.on(EVENTS.SERVER.HOST_INIT, handleHostInit);
    return () => {
      socket?.off(EVENTS.SERVER.HOST_INIT, handleHostInit);
    };
  }, [socket, EVENTS, spotifyApi, session]);

  return { isHost };
}
