import React, { useState, useContext } from "react";
import { RoomContext } from "../../context/socket.context";
import UserDisplay from "../Common/UserDisplay";

import PartySong from "./PartySong";

export default function Party({ isChatOpen }) {
  const { room, roomPlaylistObject, removeSong } = useContext(RoomContext);

  const [isClicked, setIsClicked] = useState({ index: -1 });

  const clickSong = (index) => {
    isClicked.index === index
      ? setIsClicked({ index: -1 })
      : setIsClicked({ index: index });
  };

  let text = "";

  if (!roomPlaylistObject || !room.roomID) text = "Join a Room";

  const voteSong = (track, type) => {
    console.log(`${track} ${type}`);
  };

  const songs = roomPlaylistObject.tracks?.items?.map((trackObject, index) => {
    return (
      <PartySong
        index={index}
        key={trackObject.track.id}
        songName={trackObject.track.name}
        artist={trackObject.track.artists[0].name}
        albumImgSource={trackObject.track.album?.images[0].url}
        albumName={trackObject.track.album?.name}
        duration_ms={trackObject.track.duration_ms}
        trackUri={trackObject.track.uri}
        removeSong={removeSong}
        voteSong={voteSong}
        voteNumber={0}
        isChatOpen={isChatOpen}
        clicked={isClicked.index === index}
        setClicked={clickSong}
      />
    );
  });

  return (
    <div className="h-[calc(100vh-6rem)] overflow-y-scroll scrollbar-hide bg-gradient-to-b from-[#242424] to-[#161616] w-full">
      <main className="h-full w-full pt-2 px-3 md:p-8 overflow-scroll scrollbar-hide">
        <UserDisplay />
        <header className="w-full h-10">
          <h2 className=" text-white font-medium text-lg">
            {text !== "" ? text : "Now playing"}
          </h2>
        </header>
        <div className="w-full h-full text-white space-y-4">{songs}</div>
      </main>
    </div>
  );
}
