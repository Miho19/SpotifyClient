import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrack } from "../../features/trackSlice";

import { RefreshIcon } from "@heroicons/react/solid";

export default function ScrollingDisplay({ currentTrack }) {
  const dispatch = useDispatch();
  const playlistID = useSelector((state) => state.track.data.track.id);

  return (
    <article
      className="flex flex-col items-center space-x-1 w-full space-y-2 pt-4 px-1 group"
      aria-label="current track playing"
      onClick={() => dispatch(getTrack({ id: playlistID }))}
    >
      <img
        src={currentTrack?.album?.images[0].url}
        alt={`album cover of ${currentTrack?.album?.name} by ${currentTrack?.artists[0]?.name}`}
        className="h-10 w-10 shadow-lg self-center xxs:self-start xxs:ml-2 group-hover:hidden"
      />
      <div className="w-full whitespace-nowrap overflow-hidden text-sm xxs:text-base group-hover:hidden">
        <span className="scroller">
          {currentTrack?.name} &#9733;{" "}
          <span className="font-semibold text-white">
            {currentTrack?.artists[0].name}
          </span>
        </span>
        <span className="scroller scroller2 ">
          {currentTrack?.name} &#9733;{" "}
          <span className="font-semibold text-white">
            {currentTrack?.artists[0].name}
          </span>
        </span>
      </div>
      <RefreshIcon className="button hidden group-hover:inline w-10 h-10 text-white opacity-80" />
    </article>
  );
}
