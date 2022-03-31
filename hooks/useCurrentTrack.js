import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import useSpotify from "./useSpotify";

export default function useCurrentTrack({ socket, EVENTS }) {
  const [currentTrack, setCurrentTrack] = useState(null);

  const { data: session, loading } = useSession();

  const spotifyApi = useSpotify();

  useEffect(() => {
    const getRecentTrack = async () => {
      try {
        if (session.user.type === "guest") {
          return setCurrentTrack(null);
        }

        const getCurrentTrackResponse =
          await spotifyApi.getMyCurrentPlayingTrack();

        if (getCurrentTrackResponse?.body?.item) {
          return setCurrentTrack(getCurrentTrackResponse.body.item);
        }

        const pastTrackResponse = await spotifyApi.getMyRecentlyPlayedTracks({
          limit: 1,
        });

        if (pastTrackResponse.body.items.length) {
          return setCurrentTrack(pastTrackResponse.body.items[0].track);
        }

        setCurrentTrack(null);
      } catch (error) {
        console.error("get Recent Tracks: ", error);
      }
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

    socket?.on(EVENTS.SERVER.CURRENT_SONG_CHANGED, songChanged);

    return () => {
      socket?.off(EVENTS.SERVER.CURRENT_SONG_CHANGED, songChanged);
    };
  }, [socket]);

  return currentTrack;
}
