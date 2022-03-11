import React from "react";

export default function ScrollingDisplay({ currentTrack }) {
  return (
    <div className="flex flex-col items-center space-x-1 w-full  space-y-2 pt-4 px-1">
      <img
        src={currentTrack?.album?.images[0].url}
        alt={`album cover of ${currentTrack?.album?.name} by ${currentTrack?.artists[0].name}`}
        className="h-10 w-10 shadow-lg self-center xxs:self-start xxs:ml-2"
      />
      <div className="w-full whitespace-nowrap overflow-hidden text-sm xxs:text-base">
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
    </div>
  );
}
