import { configureStore } from "@reduxjs/toolkit";
import roomReducer from "../features/roomSlice";
import messageReducer from "../features/messageSlice";
import userPlaylistReducer from "../features/userPlaylistSlice";
import SocketMiddleware from "./SocketMiddleware";
import socketReducer from "../features/socketSlice";
import trackReducer from "../features/trackSlice";

export const store = configureStore({
  reducer: {
    room: roomReducer,
    message: messageReducer,
    userPlaylist: userPlaylistReducer,
    socket: socketReducer,
    track: trackReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(SocketMiddleware),
});
