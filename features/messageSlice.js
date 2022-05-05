import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  data: {
    messages: [],
  },
  error: "",
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.data.messages.push(action.payload);
    },
  },
});

export default messageSlice.reducer;

export const { addMessage } = messageSlice.actions;
