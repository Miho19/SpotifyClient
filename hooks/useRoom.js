import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";

import useSpotify from "./useSpotify";

export default function useRoom({ socket, EVENTS }) {
  const [room, setRoom] = useState({ roomID: "", roomName: "" });

  const [roomMembers, setRoomMembers] = useState([]);

  const [roomList, setRoomList] = useState([]);

  const router = useRouter();

  const spotifyApi = useSpotify();

  const [partyPlaylistObject, setPartyPlaylistObject] = useState(null);

  useEffect(() => {
    socket?.on(EVENTS.SERVER.CLIENT_JOINED_ROOM, ({ roomID, roomName }) => {
      setRoom({ roomID: roomID, roomName: roomName });
      socket?.emit(EVENTS.CLIENT.GET_ROOM_MEMBERS, { roomID: roomID });
    });

    socket?.on(EVENTS.SERVER.CLIENT_LEFT_ROOM, () => {
      setRoom({ roomID: "", roomName: "" });
    });

    socket?.on(EVENTS.SERVER.SEND_ROOM_MEMBERS, ({ roomMembers }) => {
      setRoomMembers(roomMembers);
    });

    socket?.on(EVENTS.SERVER.SEND_ROOM_LIST, ({ roomList }) => {
      setRoomList(roomList);
    });

    socket?.on(EVENTS.SERVER.SEND_ROOM_PLAYLISTID, ({ playlistID }) => {
      if (spotifyApi && spotifyApi.getAccessToken()) {
        spotifyApi
          .getPlaylist(String(playlistID))
          .then((response) => {
            if (!response.body) return;
            setPartyPlaylistObject(response.body);
          })
          .catch((e) => console.log(e));
      }
    });

    return () => {
      socket?.off(EVENTS.SERVER.CLIENT_JOINED_ROOM);
      socket?.off(EVENTS.SERVER.CLIENT_LEFT_ROOM);
      socket?.off(EVENTS.SERVER.SEND_ROOM_MEMBERS);
      socket?.off(EVENTS.SERVER.SEND_ROOM_LIST);
      socket?.off(EVENTS.SERVER.SEND_ROOM_PLAYLISTID);
    };
  }, [socket]);

  useEffect(() => {
    if (room.roomID === "" || room.roomName === "") return;

    if (!spotifyApi || !spotifyApi.getAccessToken()) return;

    socket?.emit(EVENTS.CLIENT.GET_ROOM_PLAYLISTID, room);
  }, [socket, room]);

  const getRoomList = () => {
    if (!socket) {
      router.push("/");
    }
    socket?.emit(EVENTS.CLIENT.GET_ROOM_LIST);
  };

  return { room, roomMembers, roomList, getRoomList, partyPlaylistObject };
}
