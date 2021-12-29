import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from "../context/socket.context";
import useSpotify from "../hooks/useSpotify";
import PartySong from "./PartySong";

export default function PartySongQueue() {
  const { socket, EVENTS } = useContext(SocketContext);
  const [partyPlaylistObject, setPartyPlaylistObject] = useState(null);
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

    const updatePlaylist = ({ playlistID }) => {
      if (spotifyApi && spotifyApi.getAccessToken()) {
        spotifyApi
          .getPlaylist(String(playlistID))
          .then((response) => {
            if (!response.body) return;

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

    const updatePlaylist = ({ playlistID }) => {
      if (spotifyApi && spotifyApi.getAccessToken()) {
        spotifyApi
          .getPlaylist(String(playlistID))
          .then((response) => {
            if (!response.body) return;

            setPartyPlaylistObject(response.body);
          })
          .catch((e) => console.log(e));
      }
    };

    socket?.emit(EVENTS.CLIENT.GET_CURRENT_ROOM, initRoom);
  }, [socket]);

  if (!partyPlaylistObject)
    return (
      <div className="p-5 text-lg font-medium text-center">Join a Party</div>
    );

  const songs = partyPlaylistObject.tracks.items.map((trackObject) => {
    return (
      <PartySong
        key={trackObject.track.id}
        name={trackObject.track.name}
        artist={trackObject.track.artists[0].name}
        albumImgSource={trackObject.track.album?.images[0].url}
        albumName={trackObject.track.album?.name}
        duration_ms={trackObject.track.duration_ms}
      />
    );
  });

  return <div className="w-full h-full text-white">{songs}</div>;
}
