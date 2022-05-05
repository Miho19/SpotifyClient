import { createSlice } from "@reduxjs/toolkit";
import { getSocket, setUser } from "../util/socket";

import EVENTS from "../util/events";
const socket = getSocket();

const initialState = {
  status: "",
  error: "",
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    connect: (state, action) => {
      state.status = "connected";
    },
    disconnect: (state, action) => {
      state.status = "disconnected";
      socket.close();
    },
    setUserProfile: (state, action) => {
      setUser({ ...action.payload });
    },
    joinRoom: (state, action) => {
      socket.emit(EVENTS.CLIENT.JOIN_ROOM, { joinLink: action.payload.link });
    },
    leaveRoom: () => {
      socket.emit(EVENTS.CLIENT.LEAVE_ROOM);
    },
    sendMessage: (state, action) => {
      socket.emit(EVENTS.CLIENT.SEND_MESSAGE, {
        message: action.payload,
      });
    },
    changeSong: () => {},
    addSong: (state, action) => {},
  },
});

export default socketSlice.reducer;
export const {
  connect,
  disconnect,
  setUserProfile,
  joinRoom,
  leaveRoom,
  sendMessage,
} = socketSlice.actions;
