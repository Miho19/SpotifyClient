import React from "react";
import msToMinutesAndSeconds from "../util/time";

export default function PartySong({
  name,
  artist,
  albumImgSource,
  albumName,
  duration_ms,
  trackUri,
  handleClick,
}) {
  return (
    <div
      className="grid grid-cols-2 cursor-pointer px-4 py-1 hover:bg-white/25 w-full group"
      onClick={() => handleClick(trackUri)}
    >
      <div className="flex items-center space-x-2">
        <img src={albumImgSource} alt={`${albumName}`} className="w-5 h-5" />
        <div className="">
          <p className="text-md w-36 truncate">{name}</p>
          <p className="text-sm w-40 truncate">{artist}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="hidden xl:inline">{albumName}</p>
        <p className="ml-auto inline">{msToMinutesAndSeconds(duration_ms)}</p>
      </div>
    </div>
  );
}
