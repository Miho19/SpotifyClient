import React from "react";

export default function RoomItem({
  name,
  totalMembers,
  roomID,
  setPartyNameValue,
}) {
  return (
    <div
      className="w-full h-10 flex justify-between bg-white/5 items-center group hover:bg-white/25 cursor-pointer"
      onClick={() => {
        setPartyNameValue(name);
      }}
    >
      <h3 className="text-white font-medium ml-4">{name}</h3>
      <h3 className="text-white font-medium mr-4">{`members: ${totalMembers}`}</h3>
    </div>
  );
}
