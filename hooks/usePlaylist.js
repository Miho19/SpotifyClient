import React, { useState } from "react";

import useSpotify from "./useSpotify";

export default function usePlaylist() {
  const [partyPlaylistID, setPartyPlaylistID] = useState("");

  const spotifyApi = useSpotify();

  useEffect(() => {
    if (!spotifyApi.getAccessToken()) return;

    return () => {};
  }, []);

  return partyPlaylistID;
}
