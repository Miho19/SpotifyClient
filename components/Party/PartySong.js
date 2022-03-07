import React, { useState } from "react";
import msToMinutesAndSeconds from "../../util/time";
import { PlayIcon, XIcon } from "@heroicons/react/solid";
import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/solid";
import clsx from "clsx";

export default function PartySong({
  songName,
  artist,
  albumImgSource,
  albumName,
  duration_ms,
  trackUri,
  index,
  voteNumber,
  removeSong,
  voteSong,
  isChatOpen,
  clicked,
  setClicked,
}) {
  return (
    <div
      className={clsx(
        "grid grid-cols-2 grid-rows-1 gap-1 w-full h-16  group cursor-pointer",
        clicked && "bg-white/30",
        !clicked && "hover:bg-white/20"
      )}
      onClick={() => {
        setClicked(index);
      }}
    >
      <div
        className={clsx(
          "col-span-1  flex items-center h-full w-full space-x-2"
        )}
      >
        {index === 0 ? (
          <div className="">
            {clicked ? (
              <XIcon
                className="w-5 h-5 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSong(trackUri, index);
                }}
              />
            ) : (
              <PlayIcon className="w-5 h-5 text-green-500 animate-bounce" />
            )}
          </div>
        ) : (
          <div className="w-5 h-5 ml-1">{index + 1}</div>
        )}
        <img src={albumImgSource} alt={`${albumName}`} className="w-10 h-10" />
        <div>
          <div
            className={clsx(
              "text-sm text-white truncate",
              index === 0 && "text-green-400"
            )}
          >
            {songName}
          </div>
          <div className="text-gray-400 text-sm">{artist}</div>
        </div>
      </div>
      <div
        className={clsx(
          "col-span-1  w-full h-full flex flex-col justify-center"
        )}
      >
        <div className={clsx("ml-auto xs:ml-0")}>
          {msToMinutesAndSeconds(duration_ms)}
        </div>
      </div>
    </div>
  );
}
