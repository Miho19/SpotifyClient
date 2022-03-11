import React, { useContext, useState } from "react";
import { useRecoilValue } from "recoil";
import { currentPlayListObject } from "../../atoms/playlistAtom";
import Song from "./Song";
import useSpotify from "../../hooks/useSpotify";
import { SocketContext } from "../../context/socket.context";
import SongContextMenu from "./SongContextMenu";

export default function Songs({ partyPlaylistID }) {
  const playlist = useRecoilValue(currentPlayListObject);
  const spotifyApi = useSpotify();
  const { socket, EVENTS } = useContext(SocketContext);
  const [showMenu, setShowMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    track: null,
  });

  const handleContextMenu = ({ track, x, y }) => {
    setShowMenu({ show: true, x, y, track });
  };

  const addToPartyPlaylist = async (track) => {
    if (showMenu.show) setShowMenu(false);
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

      socket?.emit(EVENTS.CLIENT.UPDATE_PLAYLIST);
    } catch (error) {
      console.error("add to partyplaylist: ", error);
    }
  };

  return (
    <div className="flex flex-col w-full h-full space-y-5 px-1">
      {playlist?.tracks.items.map((track, i) => (
        <Song
          key={track.track.id}
          track={track}
          order={i}
          handleClick={addToPartyPlaylist}
          handleContextMenu={handleContextMenu}
        />
      ))}
      {showMenu.show && (
        <SongContextMenu x={showMenu.x} y={showMenu.y} track={showMenu.track} />
      )}
    </div>
  );
}
