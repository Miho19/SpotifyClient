import React, { useContext, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { currentPlayListObject } from "../../atoms/playlistAtom";
import Song from "./Song";
import useSpotify from "../../hooks/useSpotify";
import { SocketContext } from "../../context/socket.context";
import SongContextMenu from "./SongContextMenu";
import { useSession } from "next-auth/react";

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
  const { data: session, loading } = useSession();

  const SongContextMenuRefernce = useRef();

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

      session.user.type === "guest"
        ? await socket?.emit(EVENTS.CLIENT.ADD_SONG_TO_CURRENT_ROOM, {
            track,
            partyPlaylistID,
          })
        : await spotifyApi.addTracksToPlaylist(partyPlaylistID, [
            track.track.uri,
          ]);

      socket?.emit(EVENTS.CLIENT.UPDATE_PLAYLIST);
    } catch (error) {
      console.error("add to partyplaylist: ", error);
    }
  };

  useEffect(() => {
    const handleClick = (event) => {
      if (!SongContextMenuRefernce.current) return;

      event.target.offsetParent !== SongContextMenuRefernce.current &&
        setShowMenu({ ...showMenu, show: false });
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [showMenu]);

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
        <SongContextMenu
          x={showMenu.x}
          y={showMenu.y}
          track={showMenu.track}
          addToPartyPlaylist={addToPartyPlaylist}
          reference={SongContextMenuRefernce}
        />
      )}
    </div>
  );
}
