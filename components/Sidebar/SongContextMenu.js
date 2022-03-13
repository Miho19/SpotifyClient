import React from "react";

export default function SongContextMenu({
  x,
  y,
  track,
  reference,
  addToPartyPlaylist,
}) {
  const viewWidth = window.innerWidth;
  const viewHeight = window.innerHeight;

  const xpos = x > viewWidth - 150 ? `${x - 150}px` : `${x}px`;
  const ypos = y > viewHeight - 200 ? `${y - 75}px` : `${y}px`;

  const button =
    "text-gray-100 text-base cursor-pointer hover:bg-white/20 w-full rounded px-4 py-3";

  return (
    <div
      className={`absolute bg-[#1b1b1b] border border-black/30 rounded-lg flex`}
      style={{ top: ypos, left: xpos }}
      ref={reference}
    >
      <ul className="flex flex-col space-y-1 w-full text-left px-1 py-1">
        <li className={button} onClick={addToPartyPlaylist}>
          Add to queue
        </li>
      </ul>
    </div>
  );
}
