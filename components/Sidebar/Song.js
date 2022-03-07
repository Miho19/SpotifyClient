import React from "react";

import msToMinutesAndSeconds from "../../util/time";

export default function Song({ order, track, handleClick }) {
  return (
    <div
      className="grid grid-cols-2  hover:bg-white/20 rounded-lg cursor-pointer py-2 px-3"
      onClick={() => handleClick(track)}
    >
      <div className="flex items-center space-x-4">
        <p className="text-gray-400">{order + 1}</p>
        <img
          src={track.track.album.images[0].url}
          alt=""
          className="w-10 h-10"
        />
        <div>
          <p className="w-36 lg:w-64 text-white truncate">{track.track.name}</p>
          <p className="w-40 text-gray-400">{track.track.artists[0].name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="hidden lg:inline w-40 text-gray-400">
          {track.track.album.name}
        </p>
        <p className="ml-auto text-gray-400">
          {msToMinutesAndSeconds(track.track.duration_ms)}
        </p>
      </div>
    </div>
  );
}
