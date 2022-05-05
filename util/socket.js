import { io } from "socket.io-client";
import EVENTS from "./events";

let socket = null;

const URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://spotifyserver1.herokuapp.com/";

export const getSocket = () => {
  if (socket) return socket;
  socket = io(URL);
  return socket;
};

export const socketDisconnect = () => {
  if (!socket) return;
  socket.close();
  socket = null;
  return socket;
};

export const setUser = ({ name, imgSource, email, type }) => {
  if (!socket) return;

  const host = socket?.data?.user?.host ?? false;

  socket.data = {
    user: {
      name,
      imgSource,
      email,
      host,
      type,
    },
  };

  socket.emit(EVENTS.CLIENT.SET_USER_PROFILE, { ...socket.data.user });
};

export const setHost = (value) => {
  if (!socket) return;
  socket.data.user.host = value;
};

export const getType = () => {
  if (!socket) return;

  return socket.data.user.type;
};
