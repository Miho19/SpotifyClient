import React, { useState, useEffect } from "react";
import useSpotify from "../../hooks/useSpotify";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { currentPlaylistId } from "../../atoms/playlistAtom";

import { useRouter } from "next/router";

export default function UserPlayLists() {
  const [allUserPlaylists, setallUserPlaylists] = useState([]);

  const spotifyApi = useSpotify();

  const [playlistID, setCurrentPlaylistId] = useRecoilState(currentPlaylistId);
  const router = useRouter();

  useEffect(() => {
    if (spotifyApi.getAccessToken() === undefined) {
      router.push("/");
    }

    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setallUserPlaylists(data.body.items);
      });
    }
  }, []);

  return (
    <div className="text-gray-500 text-xs lg:text-sm space-y-4 pt-4 overflow-auto scrollbar-hide">
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
