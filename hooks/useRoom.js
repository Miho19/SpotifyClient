import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";

export default function useRoom({ socket, EVENTS }) {
  const [room, setRoom] = useState({ roomID: "", roomName: "" });

  const [roomMembers, setRoomMembers] = useState([]);

  const [roomList, setRoomList] = useState([]);

  const router = useRouter();

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

    return () => {
      socket?.off(EVENTS.SERVER.CLIENT_JOINED_ROOM);
      socket?.off(EVENTS.SERVER.CLIENT_LEFT_ROOM);
      socket?.off(EVENTS.SERVER.SEND_ROOM_MEMBERS);
      socket?.off(EVENTS.SERVER.SEND_ROOM_LIST);
    };
  }, [socket]);

  const getRoomList = () => {
    if (!socket) {
      router.push("/");
    }
    socket?.emit(EVENTS.CLIENT.GET_ROOM_LIST);
  };

  return { room, roomMembers, roomList, getRoomList };
}
