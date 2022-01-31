import React from "react";
import msToMinutesAndSeconds from "../../util/time";
import { PlayIcon } from "@heroicons/react/outline";
import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/solid";

export default function PartySong({
  name,
  artist,
  albumImgSource,
  albumName,
  duration_ms,
  trackUri,
  index,
  handleClick,
}) {
  return (
    <div
      className="grid grid-cols-2 cursor-pointer px-4 py-1 hover:bg-white/25 w-full group"
      onClick={() => handleClick(trackUri, index)}
    >
      <div className="flex items-center space-x-2">
        {index !== 0 ? (
          <p className="mr-3">{index + 1}</p>
        ) : (
          <PlayIcon className="w-6 h-6 text-green-500 animate-bounce" />
        )}
        <img src={albumImgSource} alt={`${albumName}`} className="w-10 h-10" />
        <div className="">
          <p
            className={`text-md w-36 truncate ${
              index === 0 && `text-green-500 font-medium`
            }`}
          >
            {name}
          </p>
          <p className="text-sm w-40 truncate">{artist}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="hidden 2xl:inline w-64">{albumName}</p>
          <p className="ml-auto inline">{msToMinutesAndSeconds(duration_ms)}</p>
        </div>
      </div>
      <div className="ml-auto flex items-center space-x-2">
        <ThumbUpIcon className="button text-green-300" />
        <p>1</p>
        <ThumbDownIcon className="button text-red-500" />
      </div>
    </div>
  );
}
