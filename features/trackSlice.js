import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSpotify } from "../util/spotify";

const spotifyapi = getSpotify();

const initialState = {
  status: "",
  errror: "",
  data: {
    track: {},
    progressMs: 0,
  },
};

export const getTrack = createAsyncThunk("getTrack", async ({ id }) => {
  const track = await spotifyapi.getTrack(id);
  return track.body;
});

const trackSlice = createSlice({
  name: "track",
  initialState,
  reducers: {
    setProgress: (state, action) => {
      state.data.progressMs = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTrack.fulfilled, (state, action) => {
      state.status = "successful";
      state.data.track = action.payload;
    });
    builder.addCase(getTrack.rejected, (state, action) => {
      state.errror = "Track error";
      state.status = "error";
    });
    builder.addCase(getTrack.pending, (state, action) => {
      state.status = "loading";
    });
  },
});

export default trackSlice.reducer;
export const { setProgress } = trackSlice.actions;
