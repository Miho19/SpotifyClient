import React, { useContext } from "react";
import { SocketContext } from "../context/socket.context";

export default function PartySongQueue() {
  const { partyPlaylistObject } = useContext(SocketContext);

  if (!partyPlaylistObject) return <div>Loading</div>;

  const songs = partyPlaylistObject.tracks.items.map((trackObject) => {
    console.log(trackObject);
    return <div key={trackObject.track.id}>{trackObject.track.name}</div>;
  });

  return <div className="w-full h-full text-white">{songs}</div>;
}
