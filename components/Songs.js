import React, { useContext } from "react";
import { useRecoilValue } from "recoil";
import { currentPlayListObject } from "../atoms/playlistAtom";
import Song from "./Song";
import useSpotify from "../hooks/useSpotify";
import { SocketContext } from "../context/socket.context";

export default function Songs({ partyPlaylistID }) {
  const playlist = useRecoilValue(currentPlayListObject);
  const spotifyApi = useSpotify();
  const { socket, EVENTS } = useContext(SocketContext);

  const addToPartyPlaylist = async (track) => {
    if (!spotifyApi || !spotifyApi.getAccessToken() || !partyPlaylistID) return;

    try {
      const trackToAddID = track.track.id;

      const trackReponse = await spotifyApi.getPlaylistTracks(partyPlaylistID);
      const tracks = trackReponse.body.items;

      const isUnqiue = tracks.every((track) => track.track.id !== trackToAddID);

      if (!isUnqiue) return; // TODO add in dialog or something saying track must be unique

      const addTrackResponse = await spotifyApi.addTracksToPlaylist(
        partyPlaylistID,
        [track.track.uri]
      );

      socket?.emit(EVENTS.CLIENT.CHANGED_PARTYPLAYLIST);
    } catch (error) {
      console.error("add to partyplaylist: ", error);
    }
  };

  return (
    <div className="flex flex-col px-8 space-y-1 pb-28 text-white">
      {playlist?.tracks.items.map((track, i) => (
        <Song
          key={track.track.id}
          track={track}
          order={i}
          handleClick={addToPartyPlaylist}
        />
      ))}
    </div>
  );
}
