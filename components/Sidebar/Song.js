import clsx from "clsx";
import React, { useState } from "react";

import msToMinutesAndSeconds from "../../util/time";

export default function Song({
  order,
  track,
  handleClick,
  handleContextMenu,
  adjustNameDisplay,
}) {
  return (
    <div
      className="grid grid-cols-2  hover:bg-white/20 rounded-lg cursor-pointer py-2 px-3 transition-all"
      onClick={() => handleClick(track)}
      onContextMenu={(e) => {
        e.preventDefault();
        handleContextMenu({ track: track, x: e.pageX, y: e.pageY });
      }}
    >
      <div className="flex items-center space-x-4 w-full">
        <p className="text-gray-400">{order + 1}</p>
        <img
          src={track.track.album.images[0].url}
          alt=""
          className={clsx(
            "",
            !adjustNameDisplay && "inline w-10 h-10",
            adjustNameDisplay && "hidden lg:inline w-10 h-10"
          )}
        />
        <div>
          <p
            className={clsx(
              " text-white truncate",
              !adjustNameDisplay && "w-36 xxs:w-48 xxss:w-72 xs:w-96",
              adjustNameDisplay && "w-36 mdd:w-72 xxl:w-96"
            )}
          >
            {track.track.name}
          </p>
          <p className="w-40 text-gray-400">{track.track.artists[0].name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0 w-full">
        <p className="hidden 2xl:inline w-40 text-gray-400">
          {track.track.album.name}
        </p>
        <p className="ml-auto text-gray-400">
          {msToMinutesAndSeconds(track.track.duration_ms)}
        </p>
      </div>
    </div>
  );
}
