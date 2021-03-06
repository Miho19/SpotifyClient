import React, { useContext } from "react";
import msToMinutesAndSeconds from "../../util/time";
import { PlayIcon, XIcon } from "@heroicons/react/solid";

import clsx from "clsx";

import { getSocket } from "../../util/socket";

const socket = getSocket();

export default function PartySong({
  songName,
  artist,
  albumImgSource,
  albumName,
  duration_ms,
  trackUri,
  index,
  voteNumber,
  removeAndSkipNext,
  voteSong,
  clicked,
  setClicked,
  displayMS,
}) {
  return (
    <li
      className="w-full h-16"
      onClick={(event) => {
        setClicked(event, index);
      }}
    >
      <div
        className={clsx(
          "grid grid-cols-2 grid-rows-1 gap-1 w-full h-full group cursor-pointer px-1",
          clicked && "bg-white/30",
          !clicked && "hover:bg-white/20"
        )}
      >
        <div className="col-span-1 flex items-center h-full w-full space-x-2">
          {index === 0 ? (
            <div className="w-5 h-5">
              {clicked && socket.data.user.host ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAndSkipNext({ trackUri: trackUri });
                  }}
                >
                  <XIcon className="button text-white" />
                </button>
              ) : (
                <PlayIcon className="w-5 h-5 text-green-500 animate-bounce" />
              )}
            </div>
          ) : (
            <div className="w-5 h-5 ml-1">{index + 1}</div>
          )}
          <img
            src={albumImgSource}
            alt={`image of ${albumName}`}
            className="hidden xxs:block w-5 h-5 xs:w-10 xs:h-10"
          />
          <div
            className={clsx(
              "w-36 flex flex-col justify-center xxs:w-60 xs:w-72 "
            )}
          >
            <div
              className={clsx(
                "text-sm text-white truncate text-left w-full",
                index === 0 && "text-green-400"
              )}
            >
              {songName}
            </div>
            <div className="text-gray-400 text-sm whitespace-nowrap w-full truncate text-left">
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
              "ml-auto mr-4 lg:ml-16",
              !displayMS && "hidden",
              displayMS && "block"
            )}
          >
            {msToMinutesAndSeconds(duration_ms)}
          </div>
        </div>
      </div>
    </li>
  );
}
