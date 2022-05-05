import { getSocket, setHost, socketDisconnect, getType } from "../util/socket";
import EVENTS from "../util/events";
import { getRoomPlaylistObject, setRoom } from "../features/roomSlice";
import { addMessage } from "../features/messageSlice";
import { getSpotify } from "../util/spotify";
import { signOut } from "next-auth/react";

import { getTrack, setProgress } from "../features/trackSlice";

const spotifyapi = getSpotify();

const handleHostInit = async ({ playlistID }, callback) => {
  const { type } = getType();

  if (type === "guest") return callback({}, "free");

  try {
    const getCurrentState = await spotifyapi.getMyCurrentPlaybackState();

    if (!getCurrentState.body) {
      signOut();
      alert("Must have an active spotify device!");
      return;
    }

    const getPlaylist = await spotifyapi.getPlaylist(playlistID);
    const { snapshot_id: snapshotID } = getPlaylist.body;

    setHost(true);

    callback({ playlistID, snapshotID });
  } catch (error) {
    console.error(error);
  }
};

const handleGetSong = async (callback) => {
  try {
    const { body: playbackState } =
      await spotifyapi.getMyCurrentPlaybackState();

    if (playbackState) {
      callback({
        id: playbackState.item.id,
        progress: playbackState.progress_ms,
        timestamp: playbackState.timestamp,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export default function SocketMiddleware(store) {
  let socket = null;

  return (next) => (action) => {
    if (!socket) {
      socket = getSocket();

      socket.on("connect", () => {
        console.log("socket connected");
      });

      socket.on("disconnect", () => {
        console.log("socket disconnected");
      });

      socket.on("connect_error", (error) => {
        console.log(error);
        socketDisconnect();
      });

      socket.on(EVENTS.SERVER.CLIENT_SET_HOST, () => {
        setHost(true);
      });

      socket.on(
        EVENTS.SERVER.CLIENT_JOINED_ROOM,
        ({ roomID, roomName, playlist }) => {
          store.dispatch(getRoomPlaylistObject(playlist.playlistID));
          store.dispatch(setRoom({ roomID, roomName, playlist }));
        }
      );

      socket.on(EVENTS.SERVER.CLIENT_LEFT_ROOM, () => {
        store.dispatch(setRoom({ roomID: "", roomName: "", playlist: {} }));
      });

      socket.on(EVENTS.SERVER.EMIT_MESSAGE, (message) => {
        store.dispatch(addMessage(message));
      });

      socket.on(EVENTS.SERVER.PLAYLIST_UPDATED, () => {
        store.dispatch(
          getRoomPlaylistObject(store.getState().room.data.playlistObject.id)
        );
      });

      socket.on(EVENTS.SERVER.CURRENT_SONG_CHANGED, ({ id, progress }) => {
        store.dispatch(getTrack({ id }));
        store.dispatch(setProgress(progress));
      });

      socket.on(EVENTS.SERVER.HOST_GET_SONG, handleGetSong);

      socket.on(EVENTS.SERVER.HOST_INIT, handleHostInit);

      socket.on(EVENTS.SERVER.HOST_START_PLAYER, () => {});
    }
    return next(action);
  };
}
