import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSpotify } from "../util/spotify";
import { getSocket } from "../util/socket";

const spotifyApi = getSpotify();
const socket = getSocket();

const initialState = {
  status: "",
  error: "",
  data: {
    id: "",
    name: "",
    playlistObject: {},
    snapshotID: "",
  },
};

export const getRoomPlaylistObject = createAsyncThunk(
  "getRoomPlaylistObject",
  async (playlistID) => {
    const response = await spotifyApi.getPlaylist(playlistID);
    return response.body;
  }
);

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    help: (state, action) => {
      console.log(action);
    },
    setRoom: (state, action) => {
      const { roomID, roomName, playlist } = action.payload;
      state.data.id = roomID;
      state.data.name = roomName;
      state.data.snapshotID = playlist.snapshotID;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRoomPlaylistObject.fulfilled, (state, action) => {
      state.data.playlistObject = action.payload;
      state.status = "success";
    });

    builder.addCase(getRoomPlaylistObject.pending, (state, action) => {
      state.status = "loading";
    });

    builder.addCase(getRoomPlaylistObject.rejected, (state, action) => {
      state.status = "failed";
    });
  },
});

export default roomSlice.reducer;

export const { help, setRoom } = roomSlice.actions;
