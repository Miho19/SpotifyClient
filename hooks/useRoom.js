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
      const getPlaylistResponse = await spotifyApi.getPlaylist(playlistID);
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
      socket.data.user.host = false;
    };

    socket?.on(EVENTS.SERVER.CLIENT_JOINED_ROOM, joinRoom);

    socket?.on(EVENTS.SERVER.CLIENT_LEFT_ROOM, leaveRoom);
    return () => {
      socket?.off(EVENTS.SERVER.CLIENT_JOINED_ROOM, joinRoom);

      socket?.off(EVENTS.SERVER.CLIENT_LEFT_ROOM, leaveRoom);
    };
  }, [socket, EVENTS]);

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

    socket?.on(EVENTS.SERVER.PLAYLIST_UPDATED, playlistChanged);

    return () => {
      socket?.off(EVENTS.SERVER.PLAYLIST_UPDATED, playlistChanged);
    };
  }, [socket, EVENTS, roomPlaylistID, roomPlaylistObject, spotifyApi]);

  const removeSong = async (songUri) => {
    try {
      if (!socket.data?.user?.host) return;

      let snapshotID = roomPlaylistSnapshotID || "";

      if (!roomPlaylistSnapshotID) {
        const getPlaylistResponse = await spotifyApi.getPlaylist(
          roomPlaylistID
        );
        const { snapshot_id: getSnapshotID } = getPlaylistResponse.body;

        snapshotID = getSnapshotID;
      }

      const deleteResponse = await spotifyApi.removeTracksFromPlaylist(
        roomPlaylistID,
        [{ uri: songUri }],
        { snapshot_id: snapshotID }
      );

      if (!deleteResponse.body.snapshot_id) {
        console.error("No valid snapshot id returned");
        return;
      }

      socket?.emit(EVENTS.CLIENT.UPDATE_PLAYLIST);
      setRoomPlaylistSnapshotID(deleteResponse.body.snapshot_id);
    } catch (error) {
      console.error("remove song: ", error);
    }
  };

  const joinRoom = ({ roomJoinLink }) => {
    socket.emit(EVENTS.CLIENT.JOIN_ROOM, { joinLink: roomJoinLink });
  };

  return {
    room,
    roomPlaylistID,
    roomPlaylistObject,
    roomPlaylistSnapshotID,
    removeSong,
    joinRoom,
  };
}
