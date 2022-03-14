import React, { useContext, useEffect, useRef, useState } from "react";
import msToMinutesAndSeconds from "../../util/time";
import { PlayIcon, XIcon } from "@heroicons/react/solid";
import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { DrawerContext } from "../../context/drawers.context";
import { debounce } from "lodash";

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
  clicked,
  setClicked,
  displayMS,
}) {
  return (
    <li
      className={clsx(
        "grid grid-cols-2 grid-rows-1 gap-1 w-full h-16 group cursor-pointer px-1",
        clicked && "bg-white/30",
        !clicked && "hover:bg-white/20"
      )}
      onClick={(event) => {
        setClicked(event, index);
      }}
    >
      <div className="col-span-1 flex items-center h-full w-full space-x-2">
        {index === 0 ? (
          <div className="w-5 h-5">
            {clicked ? (
              <XIcon
                className="button text-white"
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
        <img
          src={albumImgSource}
          alt={`${albumName}`}
          className="hidden xxs:block w-5 h-5 xs:w-10 xs:h-10"
        />
        <div className="w-36 flex flex-col justify-center xxs:w-60 xs:w-72">
          <div
            className={clsx(
              "text-sm text-white truncate text-left w-full",
              index === 0 && "text-green-400"
            )}
          >
            {songName}
          </div>
          <div className="text-gray-400 text-sm whitespace-nowrap w-full truncate">
            {artist}
          </div>
        </div>
      </div>
      <div
        className={clsx(
          "col-span-1 w-full h-full flex flex-col justify-center"
        )}
      >
        <div
          className={clsx(
            "ml-auto",
            !displayMS && "hidden",
            displayMS && "block"
          )}
        >
          {msToMinutesAndSeconds(duration_ms)}
        </div>
      </div>
    </li>
  );
}
