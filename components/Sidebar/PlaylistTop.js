import React from "react";

export default function PlaylistTop({ color, imgSource, playlistName }) {
  return (
    <header
      className={`space-x-1 bg-gradient-to-b ${color} to-[#0f0f0f] text-white p-8 flex space-x-2`}
    >
      <img
        src={imgSource}
        alt="playlist image"
        className="h-10 w-10 shadow-2xl"
      />

      <div className="flex flex-col">
        <p className="uppercase font-bold text-[0.5rem]">playlist</p>
        <h1 className="text-md font-bold truncate">{playlistName}</h1>
      </div>
    </header>
  );
}
