import { useSession } from "next-auth/react";
import React, { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import useMessages from "../hooks/useMessages";
import usePlayer from "../hooks/usePlayer";
import useRoom from "../hooks/useRoom";
import useSpotifyWedSDK from "../hooks/useSpotifyWedSDK";

const EVENTS = {
  connection: "connection",
  disconnect: "disconnect",
  disconnecting: "disconnecting",
  CLIENT: {
    SET_USER_PROFILE: "SET_USER_PROFILE",
    JOIN_ROOM: "JOIN_ROOM",
    LEAVE_ROOM: "LEAVE_ROOM",
    SEND_MESSAGE: "SEND_MESSAGE",
    GET_ROOM_MEMBERS: "GET_ROOM_MEMBERS",
    GET_ROOM_LIST: "GET_ROOM_LIST",
    GET_CURRENT_ROOM: "GET_CURRENT_ROOM",
    UPDATE_PLAYLIST: "CHANGED_PARTYPLAYLIST",
    HOST_CHANGE_SONG: "HOST_CHANGE_SONG",
    ADD_SONG_TO_CURRENT_ROOM: "ADD_SONG_TO_CURRENT_ROOM",
  },
  SERVER: {
    CLIENT_SET_HOST: "CLIENT_SET_HOST",
    CLIENT_JOINED_ROOM: "CLIENT_JOINED_ROOM",
    CLIENT_LEFT_ROOM: "CLIENT_LEFT_ROOM",
    EMIT_MESSAGE: "EMIT_MESSAGE",
    ROOM_MEMBERS_CHANGED: "ROOM_MEMBERS_CHANGED",
    PLAYLIST_UPDATED: "ROOM_PLAYLIST_CHANGED",
    CURRENT_SONG_CHANGED: "ROOM_PLAYLIST_SONG_CHANGED",
    HOST_GET_SONG: "HOST_GET_SONG",
    HOST_INIT: "HOST_INIT",
    HOST_START_PLAYER: "HOST_START_PLAYER",
  },
};

export const SocketContext = createContext({ socket: null, EVENTS });

export const RoomContext = createContext({
  room: { roomID: "", roomName: "" },
  roomPlaylistID: "",
  roomPlaylistObject: {},
  roomPlaylistSnapshotID: "",
  removeSong: () => {},
});

export const PlayerContext = createContext({
  isActive: false,
  isHost: false,
});

export const SpotifySDKContext = createContext({
  playerObject: false,
  deviceID: "",
  isPaused: true,
});

export default function SocketContextProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { data: session, loading } = useSession();

  const {
    room,
    roomPlaylistID,
    roomPlaylistObject,
    roomPlaylistSnapshotID,
    removeSong,
    joinRoom,
  } = useRoom({ socket, EVENTS });

  const messages = useMessages({ socket, EVENTS });

  const { isActive, isHost } = usePlayer({ socket, EVENTS });

  const {
    playerObject,
    deviceID,
    isPaused,
    togglePlayback,
    skipToNext,
    skipToPrevious,
  } = useSpotifyWedSDK({
    socket,
    EVENTS,
  });

  useEffect(() => {
    const URL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:4000"
        : "https://spotifyserver1.herokuapp.com/";

    if (typeof window.document !== "undefined" && session?.user) {
      const socketIO = io(URL);
      setSocket(socketIO);
    }
  }, [session]);

  useEffect(() => {
    socket?.on("connect", () => {
      socket.data = {
        user: {
          name: session?.user.name,
          imgSource: session?.user.image,
          email: session?.user.email,
          host: false,
        },
      };

      socket.emit(EVENTS.CLIENT.SET_USER_PROFILE, {
        ...socket.data.user,
      });
    });

    socket?.on("connect_error", (error) => {
      console.log("connection issues");
      socket.close();
    });

    return () => {
      socket?.close();
    };
  }, [socket, session]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        EVENTS,
      }}
    >
      <PlayerContext.Provider value={{ isActive, isHost }}>
        <RoomContext.Provider
          value={{
            room,
            roomPlaylistID,
            roomPlaylistObject,
            roomPlaylistSnapshotID,
            removeSong,
            messages,
            joinRoom,
          }}
        >
          <SpotifySDKContext.Provider
            value={{
              playerObject,
              deviceID,
              isPaused,
              togglePlayback,
              skipToNext,
              skipToPrevious,
            }}
          >
            {children}
          </SpotifySDKContext.Provider>
        </RoomContext.Provider>
      </PlayerContext.Provider>
    </SocketContext.Provider>
  );
}
