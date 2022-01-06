import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from "../context/socket.context";
import useSpotify from "../hooks/useSpotify";
import PartySong from "./PartySong";

export default function PartySongQueue() {
  const { socket, EVENTS } = useContext(SocketContext);
  const [partyPlaylistObject, setPartyPlaylistObject] = useState(null);
  const [partyPlaylistID, setPartyPlaylistID] = useState("");
  const [partyPlaylistSnapShotID, setpartyPlaylistSnapShotID] = useState("");

  const [room, setRoom] = useState({});
  const spotifyApi = useSpotify();

  useEffect(() => {
    const joinRoom = ({ roomID, roomName }) => {
      setRoom({ roomID: roomID, roomName: roomName });
      socket?.emit(EVENTS.CLIENT.GET_ROOM_PLAYLISTID, updatePlaylist);
    };

    const leaveRoom = () => {
      setPartyPlaylistObject(null);
      setRoom({});
    };

    const updatePlaylist = ({ playlistID, snapshotID }) => {
      if (spotifyApi && spotifyApi.getAccessToken()) {
        spotifyApi
          .getPlaylist(String(playlistID))
          .then((response) => {
            if (!response.body) return;

            setPartyPlaylistID(playlistID);
            setpartyPlaylistSnapShotID(snapshotID);
            setPartyPlaylistObject(response.body);
          })
          .catch((e) => console.log(e));
      }
    };

    socket?.on(EVENTS.SERVER.CLIENT_JOINED_ROOM, joinRoom);

    socket?.on(EVENTS.SERVER.CLIENT_LEFT_ROOM, leaveRoom);

    return () => {
      socket?.off(EVENTS.SERVER.CLIENT_JOINED_ROOM, joinRoom);
      socket?.off(EVENTS.SERVER.CLIENT_LEFT_ROOM, leaveRoom);
    };
  }, [socket, room, partyPlaylistObject]);

  useEffect(() => {
    const initRoom = ({ roomID, roomName }) => {
      if (!roomID || !roomName) setRoom({});
      setRoom({ roomID: roomID, roomName: roomName });
      socket?.emit(EVENTS.CLIENT.GET_ROOM_PLAYLISTID, updatePlaylist);
    };

    const updatePlaylist = ({ playlistID, snapshotID }) => {
      if (spotifyApi && spotifyApi.getAccessToken()) {
        spotifyApi
          .getPlaylist(String(playlistID))
          .then((response) => {
            if (!response.body) return;
            setPartyPlaylistID(playlistID);
            setpartyPlaylistSnapShotID(snapshotID);
            setPartyPlaylistObject(response.body);
          })
          .catch((e) => console.log(e));
      }
    };

    socket?.emit(EVENTS.CLIENT.GET_CURRENT_ROOM, initRoom);
  }, [socket]);

  useEffect(() => {
    const playlistChanged = async () => {
      if (!partyPlaylistID) return;
      if (!spotifyApi) return;

      try {
        const getPlaylistResponse = await spotifyApi.getPlaylist(
          String(partyPlaylistID)
        );
        setPartyPlaylistObject({ ...getPlaylistResponse.body });
      } catch (error) {
        console.log(error);
      }
    };

    socket?.on(EVENTS.SERVER.ROOM_PLAYLIST_CHANGED, playlistChanged);

    return () => {
      socket?.off(EVENTS.SERVER.ROOM_PLAYLIST_CHANGED, playlistChanged);
    };
  }, [socket, partyPlaylistSnapShotID]);

  if (!partyPlaylistObject)
    return (
      <div className="p-5 text-lg font-medium text-center">Join a Party</div>
    );

  const removeSong = async (songUri) => {
    try {
      const deleteResponse = await spotifyApi.removeTracksFromPlaylist(
        partyPlaylistID,
        [{ uri: songUri }],
        { snapshot_id: partyPlaylistSnapShotID }
      );

      setpartyPlaylistSnapShotID(deleteResponse.body.snapshot_id);

      socket?.emit(EVENTS.CLIENT.CHANGED_PARTYPLAYLIST);
    } catch (error) {
      console.log(error);
    }
  };

  const songs = partyPlaylistObject.tracks.items.map((trackObject) => {
    return (
      <PartySong
        key={trackObject.track.id}
        name={trackObject.track.name}
        artist={trackObject.track.artists[0].name}
        albumImgSource={trackObject.track.album?.images[0].url}
        albumName={trackObject.track.album?.name}
        duration_ms={trackObject.track.duration_ms}
        trackUri={trackObject.track.uri}
        handleClick={removeSong}
      />
    );
  });

  return <div className="w-full h-full text-white">{songs}</div>;
}
