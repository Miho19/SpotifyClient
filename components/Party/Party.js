import { debounce } from "lodash";
import React, { useState, useContext, useEffect, useRef } from "react";
import { DrawerContext } from "../../context/drawers.context";
import { RoomContext } from "../../context/socket.context";
import UserDisplay from "../Common/UserDisplay";
import Home from "./Home";

import PartySong from "./PartySong";

export default function Party() {
  const { room, roomPlaylistObject, removeSong } = useContext(RoomContext);
  const { isChatOpen, isSidebarOpen } = useContext(DrawerContext);
  const [displayMS, setDisplayMS] = useState(true);

  const [isClicked, setIsClicked] = useState({ index: -1 });

  const clickSong = (event, index) => {
    index === isClicked.index
      ? setIsClicked({ index: -1 })
      : setIsClicked({ index: index });
  };

  const voteSong = (track, type) => {
    console.log(`${track} ${type}`);
  };

  useEffect(() => {
    const handleResize = debounce(() => {
      if (isChatOpen && isSidebarOpen && window.innerWidth < 870) {
        setDisplayMS(false);
      } else {
        setDisplayMS(true);
      }
    }, [150]);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isChatOpen, isSidebarOpen, displayMS]);

  useEffect(() => {
    if (isChatOpen && isSidebarOpen && window.innerWidth < 870) {
      setDisplayMS(false);
    } else {
      setDisplayMS(true);
    }
  }, [isChatOpen, isSidebarOpen, displayMS]);

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
        clicked={isClicked.index === index}
        setClicked={clickSong}
        displayMS={displayMS}
      />
    );
  });

  return (
    <section className="h-[calc(100vh-6rem)] overflow-y-scroll scrollbar-hide w-full">
      <main className="h-full w-full pt-2 overflow-scroll scrollbar-hide space-y-3 lg:px-3">
        <UserDisplay />
        {!roomPlaylistObject || !room.roomID ? (
          <Home />
        ) : (
          <ul className="w-full h-full text-white space-y-4">{songs}</ul>
        )}
      </main>
    </section>
  );
}
