import React, { useContext, useState, useEffect } from "react";
import { RoomContext } from "../context/socket.context";

import PartySong from "./PartySong";

export default function PartySongQueue() {
  const { room, roomPlaylistObject, removeSong } = useContext(RoomContext);

  if (!roomPlaylistObject || !room.roomID)
    return (
      <div className="p-5 text-lg font-medium text-center">Join a Party</div>
    );

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

  return <div className="w-full h-full text-white">{songs}</div>;
}
