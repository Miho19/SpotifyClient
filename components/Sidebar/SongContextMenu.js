import React from "react";

export default function SongContextMenu({ x, y, track }) {
  const xpos = `${x}px`;
  const ypos = `${y}px`;

  const button =
    "text-gray-100 text-base cursor-pointer hover:bg-white/20 w-full rounded px-4 py-3";

  return (
    <div
      className={`absolute bg-[#1b1b1b] border border-black/30 rounded-lg flex`}
      style={{ top: ypos, left: xpos }}
    >
      <ul className="flex flex-col space-y-1 w-full text-left px-1 py-1">
        <li className={button}>Add to queue</li>
        <hr className="border-white/50" />
        <li className={button}>Link in chat</li>
      </ul>
    </div>
  );
}
