import React from "react";

export default function PartyMember({ name, imgSource, handleRemove }) {
  return (
    <div className="w-full h-10 flex space-x-2  bg-white/5 items-center">
      <img
        src={imgSource}
        alt="picture of user"
        className="w-8 h-8 rounded-full ml-4"
      />
      <h3 className="text-white font-medium">{name}</h3>
    </div>
  );
}
