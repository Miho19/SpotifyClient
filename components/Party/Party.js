import React, { useState, useContext } from "react";
import { RoomContext } from "../../context/socket.context";

import PartySong from "./PartySong";

export default function Party() {
  const { room, roomPlaylistObject, removeSong } = useContext(RoomContext);

  let text = "";

  if (!roomPlaylistObject || !room.roomID) text = "Join a Room";

  const songs = roomPlaylistObject.tracks?.items?.map((trackObject, index) => {
    return (
      <PartySong
        index={index}
        key={trackObject.track.id}
        name={trackObject.track.name}
        artist={trackObject.track.artists[0].name}
        albumImgSource={trackObject.track.album?.images[0].url}
        albumName={trackObject.track.album?.name}
        duration_ms={trackObject.track.duration_ms}
        trackUri={trackObject.track.uri}
        handleClick={removeSong}
      />
    );
  });

  return (
    <div className="flex-grow h-[calc(100vh-6rem)] overflow-y-scroll scrollbar-hide bg-gradient-to-b from-[#242424] to-[#161616] ">
      <main className="h-full w-full p-8 overflow-scroll scrollbar-hide ">
        <header className="flex w-full h-10 items-center justify-start pt-5 pb-5">
          <h2 className=" text-white ml-5 font-medium text-xs sm:text-lg lg:text-sm lgg:text-lg">
            {text !== "" ? text : "Queue"}
          </h2>
          <hr />
        </header>
        <div className="w-full h-full text-white space-y-4">{songs}</div>
      </main>
    </div>
  );
}
