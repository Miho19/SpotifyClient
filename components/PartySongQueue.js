import React, { useContext } from "react";
import { SocketContext } from "../context/socket.context";
import PartySong from "./PartySong";

export default function PartySongQueue() {
  const { partyPlaylistObject } = useContext(SocketContext);

  if (!partyPlaylistObject)
    return <div className="p-5 text-sm font-medium">Loading</div>;

  const songs = partyPlaylistObject.tracks.items.map((trackObject) => {
    return (
      <PartySong
        key={trackObject.track.id}
        name={trackObject.track.name}
        artist={trackObject.track.artists[0].name}
        albumImgSource={trackObject.track.album?.images[0].url}
        albumName={trackObject.track.album?.name}
        duration_ms={trackObject.track.duration_ms}
      />
    );
  });

  return <div className="w-full h-full text-white">{songs}</div>;
}
