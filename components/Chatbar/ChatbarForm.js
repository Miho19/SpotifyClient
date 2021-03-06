import React, { useContext, useState, useEffect } from "react";

import { sendMessage } from "../../features/socketSlice";
import { useDispatch } from "react-redux";

export default function ChatbarForm({ roomID }) {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const maxValueLength = 255;

  return (
    <form
      className="flex items-center h-[10%] w-full group bg-black"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        autoFocus
        aria-label="message input"
        disabled={!roomID}
        value={value}
        onChange={(e) => {
          if (e.target.value.length > maxValueLength) return; // add in error message here
          setValue(e.target.value);
        }}
        className={`w-full rounded-full border text-lg focus:outline-none ml-4 py-1 pl-4 pr-8 ${
          value.length > 0 ? `mr-8` : `mr-4`
        }`}
        placeholder={!roomID ? "Join a Party" : "Say Something..."}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          if (value.length === 0) return;

          dispatch(sendMessage(value));

          setValue("");
        }}
      />
      <span
        className={`items-center border-0 pr-5 ml-[-3rem]  ${
          value.length > 0 ? `flex` : `hidden`
        }`}
      >
        <button className="" onClick={(e) => setValue("")}>
          X
        </button>
      </span>
    </form>
  );
}
