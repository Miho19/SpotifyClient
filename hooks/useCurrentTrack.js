import React, { useEffect, useState } from "react";

import useSpotify from "./useSpotify";

export default function useCurrentTrack({ socket, EVENTS }) {
  const [currentTrack, setCurrentTrack] = useState(null);

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
    const songChanged = async ({ uri, progress }) => {
      const getTrackresponse = await spotifyApi.getMyCurrentPlayingTrack();

      if (getTrackresponse.body) {
        setCurrentTrack(getTrackresponse.body.item);
      }
    };

    socket?.on(EVENTS.SERVER.ROOM_PLAYLIST_SONG_CHANGED, songChanged);

    return () => {
      socket?.off(EVENTS.SERVER.ROOM_PLAYLIST_SONG_CHANGED, songChanged);
    };
  }, [socket]);

  return currentTrack;
}
