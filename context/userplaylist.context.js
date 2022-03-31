import React, { createContext, useState, useEffect } from "react";
import useSpotify from "../hooks/useSpotify";

export const UserPlaylistContext = createContext({
  currentPlaylistId: "",
  currentPlaylistObject: {},
});

export default function UserPlaylistContextProvider({ children }) {
  const [currentPlaylistObject, setCurrentPlaylistObject] = useState({});
  const [currentPlaylistId, setCurrentPlaylistId] = useState("");

  const spotifyApi = useSpotify();

  useEffect(() => {
    const updatePlaylistObject = async () => {
      if (!currentPlaylistId) return;
      if (!spotifyApi.getAccessToken()) return;

      const getPlaylistObjectResponse = await spotifyApi.getPlaylist(
        currentPlaylistId
      );

      setCurrentPlaylistObject(getPlaylistObjectResponse.body);
    };

    updatePlaylistObject();
  }, [currentPlaylistId]);

  return (
    <UserPlaylistContext.Provider
      value={{
        currentPlaylistId,
        currentPlaylistObject,
        setCurrentPlaylistId,
        setCurrentPlaylistObject,
      }}
    >
      {children}
    </UserPlaylistContext.Provider>
  );
}
