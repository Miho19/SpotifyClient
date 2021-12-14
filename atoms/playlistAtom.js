import { atom } from "recoil";

export const currentPlayListObject = atom({
  key: "currentPlayListObject",
  default: null,
});

export const currentPlaylistId = atom({
  key: "currentPlaylistId",
  default: "",
});
