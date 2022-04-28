import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import useSpotify from "./useSpotify";

export default function useCurrentTrack({ socket, EVENTS }) {
  const [currentTrack, setCurrentTrack] = useState({
    current: {},
    previous: {},
  });

  const { data: session, loading } = useSession();

  const spotifyApi = useSpotify();

  useEffect(() => {
    const getRecentTrack = async () => {
      try {
        if (session.user.type === "guest") {
          return setCurrentTrack({ current: {}, previous: {} });
        }

        const getCurrentTrackResponse =
          await spotifyApi.getMyCurrentPlayingTrack();

        if (getCurrentTrackResponse?.body?.item) {
          return setCurrentTrack({
            previous: {},
            current: getCurrentTrackResponse.body.item,
          });
        }

        const pastTrackResponse = await spotifyApi.getMyRecentlyPlayedTracks({
          limit: 1,
        });

        if (pastTrackResponse.body.items.length) {
          return setCurrentTrack({
            ...currentTrack,
            current: pastTrackResponse.body.items[0].track,
          });
        }

        return setCurrentTrack({ current: {}, previous: {} });
      } catch (error) {
        console.error("get Recent Tracks: ", error);
      }
    };

    if (!spotifyApi || !spotifyApi.getAccessToken()) return;

    getRecentTrack();
  }, [spotifyApi, session]);

  useEffect(() => {
    const songChanged = async ({ uri, progress }) => {
      try {
        const getTrackresponse = await spotifyApi.getMyCurrentPlayingTrack();

        if (getTrackresponse.body) {
          setCurrentTrack((prev) => {
            if (prev.current.uri === getTrackresponse.body.item.uri)
              return { ...prev };

            return {
              current: getTrackresponse.body.item,
              previous: prev.current,
            };
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    socket?.on(EVENTS.SERVER.CURRENT_SONG_CHANGED, songChanged);

    return () => {
      socket?.off(EVENTS.SERVER.CURRENT_SONG_CHANGED, songChanged);
    };
  }, [socket, EVENTS, spotifyApi]);

  return currentTrack;
}
