import React from "react";

export default function PartyForm({ value, setValue, placeholder }) {
  return (
    <div className="flex items-center group">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className=" min-w-full rounded-full border text-lg focus:outline-none  mr-2 pl-4 pr-[3rem] mt-4 py-2"
        placeholder={placeholder}
      />
      <span
        className={`items-center border-0 pr-4 ml-[-3rem] mt-4 ${
          value.length > 0 ? `flex` : `hidden`
        }`}
      >
        <button className="" onClick={(e) => setValue("")}>
          X
        </button>
      </span>
    </div>
  );
}
