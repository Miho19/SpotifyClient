import { responseSymbol } from "next/dist/server/web/spec-compliant/fetch-event";
import React, { useEffect, useState } from "react";

import useSpotify from "./useSpotify";

export default function useCurrentTrack({ socket, EVENTS }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const spotifyApi = useSpotify();

  useEffect(() => {
    const getRecentTrack = async () => {
      const getCurrentTrackResponse =
        await spotifyApi.getMyCurrentPlayingTrack();

      if (getCurrentTrackResponse?.body?.item) {
        setCurrentTrack(getCurrentTrackResponse.body.item);
        return;
      }

      const pastTrackResponse = await spotifyApi.getMyRecentlyPlayedTracks({
        limit: 1,
      });

      setCurrentTrack(pastTrackResponse.body.items[0].track);
    };

    if (!spotifyApi || !spotifyApi.getAccessToken()) return;

    getRecentTrack();
  }, []);

  useEffect(() => {
    const getPlaybackState = async () => {
      const playbackStateResponse =
        await spotifyApi.getMyCurrentPlaybackState();

      if (playbackStateResponse.body) {
        const { is_playing: playing } = playbackStateResponse.body;
        setIsPaused(!playing);
      }
    };

    getPlaybackState();
  }, [currentTrack]);

  useEffect(() => {
    const songChanged = async ({ uri, progress }) => {
      const getTrackresponse = await spotifyApi.getMyCurrentPlayingTrack();

      if (getTrackresponse) {
        setCurrentTrack(getTrackresponse);
      }
    };

    socket?.on(EVENTS.SERVER.ROOM_PLAYLIST_SONG_CHANGED, songChanged);

    return () => {
      socket?.off(EVENTS.SERVER.ROOM_PLAYLIST_SONG_CHANGED, songChanged);
    };
  }, [socket]);

  return [currentTrack, isPaused];
}
