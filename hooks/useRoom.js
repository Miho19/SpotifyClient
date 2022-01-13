import React, { useState, useEffect } from "react";
import useSpotify from "./useSpotify";

export default function useRoom({ socket, EVENTS }) {
  const [room, setRoom] = useState({});
  const [roomPlaylistID, setRoomPlaylistID] = useState("");
  const [roomPlaylistObject, setRoomPlaylistObject] = useState({});
  const [roomPlaylistSnapshotID, setRoomPlaylistSnapshotID] = useState("");

  const spotifyApi = useSpotify();

  const updatePlaylist = async ({ playlistID, snapshotID }) => {
    try {
      const getPlaylistResponse = await spotifyApi.getPlaylist(
        String(playlistID)
      );

      setRoomPlaylistObject({ ...getPlaylistResponse.body });
      setRoomPlaylistID(playlistID);
      setRoomPlaylistSnapshotID(snapshotID);
    } catch (error) {
      console.error("update playlist: ", error);
    }
  };

  useEffect(() => {
    const joinRoom = async ({ roomID, roomName, playlist }) => {
      setRoom({ roomID: roomID, roomName: roomName });
      updatePlaylist(playlist);
    };

    const leaveRoom = async () => {
      setRoom({});
      setRoomPlaylistObject({});
      socket.emit(EVENTS.CLIENT.TOGGLE_PLAYBACK, { left: true });
    };

    socket?.on(EVENTS.SERVER.CLIENT_JOINED_ROOM, joinRoom);

    socket?.on(EVENTS.SERVER.CLIENT_LEFT_ROOM, leaveRoom);
    return () => {
      socket?.off(EVENTS.SERVER.CLIENT_JOINED_ROOM, joinRoom);

      socket?.off(EVENTS.SERVER.CLIENT_LEFT_ROOM, leaveRoom);
    };
  }, [socket]);

  useEffect(() => {
    const playlistChanged = async () => {
      try {
        const getPlaylistResponse = await spotifyApi.getPlaylist(
          String(roomPlaylistID)
        );

        setRoomPlaylistObject({ ...getPlaylistResponse.body });
      } catch (error) {
        console.error("playlist has changed: ", error);
      }
    };

    socket?.on(EVENTS.SERVER.ROOM_PLAYLIST_CHANGED, playlistChanged);

    return () => {
      socket?.off(EVENTS.SERVER.ROOM_PLAYLIST_CHANGED, playlistChanged);
    };
  }, [socket]);

  const removeSong = async (songUri, index) => {
    try {
      if (index !== 0 || !socket.data?.user?.host) return;

      const deleteResponse = await spotifyApi.removeTracksFromPlaylist(
        roomPlaylistID,
        [{ uri: songUri }],
        { snapshot_id: roomPlaylistSnapshotID }
      );

      if (!deleteResponse.body.snapshot_id) {
        console.error("No valid snapshot id returned");
        return;
      }
      setRoomPlaylistSnapshotID(deleteResponse.body.snapshot_id);

      if (roomPlaylistObject.tracks.items.length > 1) {
        const skiptoNextResponse = await spotifyApi.skipToNext();
      }

      socket?.emit(EVENTS.CLIENT.HOST_CHANGE_SONG);
      socket?.emit(EVENTS.CLIENT.CHANGED_PARTYPLAYLIST);
    } catch (error) {
      console.error("remove song: ", error);
    }
  };

  useEffect(() => {
    const initRoom = ({ roomID, roomName, playlist }) => {
      setRoom({ roomID, roomName });
      updatePlaylist(playlist);
    };
    socket?.emit(EVENTS.CLIENT.GET_CURRENT_ROOM, initRoom);
  }, []);

  return {
    room,
    roomPlaylistID,
    roomPlaylistObject,
    roomPlaylistSnapshotID,
    removeSong,
  };
}
