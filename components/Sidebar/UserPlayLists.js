import React, { useState, useEffect } from "react";
import useSpotify from "../../hooks/useSpotify";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { currentPlaylistId } from "../../atoms/playlistAtom";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function UserPlayLists() {
  const [allUserPlaylists, setallUserPlaylists] = useState([]);

  const spotifyApi = useSpotify();

  const [playlistID, setCurrentPlaylistId] = useRecoilState(currentPlaylistId);
  const router = useRouter();

  const { data: session, loading } = useSession();

  useEffect(() => {
    const guestPlaylists = async () => {
      const spotifyResponse = await spotifyApi.getUserPlaylists("spotify", {
        limit: 10,
      });

      setallUserPlaylists(spotifyResponse.body.items);
    };

    const getPlaylists = async () => {
      const playlistResponse = await spotifyApi.getUserPlaylists();

      setallUserPlaylists(playlistResponse.body.items);
    };

    if (!spotifyApi.getAccessToken()) {
      return router.push("/");
    }

    session.user.type === "guest" ? guestPlaylists() : getPlaylists();
  }, []);

  return (
    <div className="text-gray-500 text-md font-medium space-y-3 pt-4 overflow-auto scrollbar-hide">
      {allUserPlaylists.map((playlist) => (
        <Link href="/playlist" passHref key={playlist.id}>
          <p
            className="cursor-pointer hover:text-white "
            onClick={() => {
              setCurrentPlaylistId(playlist.id);
            }}
          >
            {playlist.name}
          </p>
        </Link>
      ))}
    </div>
  );
}
