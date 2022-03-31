import React, { useState, useEffect, useContext } from "react";
import useSpotify from "../../hooks/useSpotify";
import Link from "next/link";

import { Router, useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { UserPlaylistContext } from "../../context/userplaylist.context";

export default function UserPlayLists() {
  const [allUserPlaylists, setallUserPlaylists] = useState([]);

  const { currentPlaylistId, setCurrentPlaylistId } =
    useContext(UserPlaylistContext);

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
  }, []);

  return (
    <ul
      className="text-gray-500 text-md font-medium space-y-3 pt-4 overflow-auto scrollbar-hide"
      aria-label="List of playlists available to the user to click on"
    >
      {allUserPlaylists.map((playlist) => (
        <Link href="/playlist" passHref key={playlist.id}>
          <li
            aria-label={`Link to the playlist ${playlist.name}`}
            className={`cursor-pointer hover:text-white ${
              currentPlaylistId === playlist.id &&
              router.pathname !== "/" &&
              `text-white font-bold`
            }`}
            onClick={() => {
              setCurrentPlaylistId(playlist.id);
            }}
          >
            {playlist.name}
          </li>
        </Link>
      ))}
    </ul>
  );
}
