import React, { useState, useEffect } from "react";
import useSpotify from "../../hooks/useSpotify";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";

export default function UserPlayLists() {
  const [allUserPlaylists, setallUserPlaylists] = useState([]);

  const currentPlaylistID = useSelector(
    (state) => state.userPlaylist.data.currentPlaylistObject.id
  );

  const spotifyApi = useSpotify();

  const router = useRouter();

  const { data: session, loading } = useSession();

  useEffect(() => {
    const guestPlaylists = async () => {
      try {
        const spotifyResponse = await spotifyApi.getUserPlaylists("spotify", {
          limit: 10,
        });

        setallUserPlaylists(spotifyResponse.body.items);
      } catch (error) {
        console.error("guest playlist error: ", error);
      }
    };

    const getPlaylists = async () => {
      try {
        const playlistResponse = await spotifyApi.getUserPlaylists();

        setallUserPlaylists(playlistResponse.body.items);
      } catch (error) {
        console.error("getPlaylistAuthUser: ", error);
      }
    };

    if (!session) return router.push("/");

    if (!spotifyApi || !spotifyApi.getAccessToken()) return router.push("/");

    session.user.type === "guest" ? guestPlaylists() : getPlaylists();
  }, [router, session, spotifyApi]);

  return (
    <ul
      className="text-gray-500 text-md font-medium space-y-3 pt-4 overflow-auto scrollbar-hide"
      aria-label="List of playlists available to the user to click on"
    >
      {allUserPlaylists.map((playlist) => (
        <Link href={`/playlist/${playlist.id}`} passHref key={playlist.id}>
          <li
            aria-label={`Link to the playlist ${playlist.name}`}
            className={`cursor-pointer hover:text-white ${
              currentPlaylistID === playlist.id &&
              router.pathname !== "/" &&
              `text-white font-bold`
            }`}
          >
            {playlist.name}
          </li>
        </Link>
      ))}
    </ul>
  );
}
