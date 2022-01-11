import React, { useState } from "react";

import useSpotify from "./useSpotify";

export default function usePlaylist({ socket, EVENTS }) {
  const [partyPlaylistID, setPartyPlaylistID] = useState("");

  const spotifyApi = useSpotify();

  return partyPlaylistID;
}
