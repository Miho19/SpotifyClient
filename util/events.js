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

export default EVENTS;
