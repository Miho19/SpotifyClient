import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getSpotify } from "../util/spotify";

const spotifyApi = getSpotify();

const initialState = {
  status: "",
  data: {
    currentPlaylistObject: {},
  },
  error: "",
};

export const getUserPlaylistObject = createAsyncThunk(
  "user/getPlaylists",
  async (playlistID, thunkAPI) => {
    const response = await spotifyApi.getPlaylist(playlistID);
    return response.body;
  }
);

const userPlaylistSlice = createSlice({
  name: "userplaylist",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getUserPlaylistObject.fulfilled, (state, action) => {
      state.data.currentPlaylistObject = action.payload;
      state.status = "success";
    });

    builder.addCase(getUserPlaylistObject.pending, (state, action) => {
      state.status = "loading";
    });

    builder.addCase(getUserPlaylistObject.rejected, (state, action) => {
      state.status = "failed";
    });
  },
});

export default userPlaylistSlice.reducer;
