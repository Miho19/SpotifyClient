import React from "react";
import Dayjs from "dayjs";

import UserIcon from "@heroicons/react/solid/UserIcon";

const generateTime = (time) => {
  const timeDayjs = Dayjs(time);
  const now = Dayjs();

  if (now.diff(timeDayjs, "year") > 0) {
    return `Joined ${now.diff(timeDayjs, "year")} years ago`;
  }

  if (now.diff(timeDayjs, "month") > 0) {
    return `joined ${now.diff(timeDayjs, "month")} months ago`;
  }

  if (now.diff(timeDayjs, "day") > 0) {
    return `Joined ${now.diff(timeDayjs, "day")} days ago`;
  }

  if (now.diff(timeDayjs, "hour") > 0) {
    return `Joined ${now.diff(timeDayjs, "hour")} hours ago`;
  }

  if (now.diff(timeDayjs, "minute") > 0) {
    return `Joined ${now.diff(timeDayjs, "minutes")} minutes ago`;
  }

  return `Joined ${now.diff(timeDayjs, "second")} seconds ago`;
};

export default function PartyMember({ name, imgSource, time }) {
  return (
    <div className="w-full h-10 flex space-x-2  bg-white/5 items-center group hover:bg-white/20">
      {imgSource ? (
        <img
          src={imgSource}
          alt="picture of user"
          className="w-8 h-8 rounded-full ml-4 lg:group-hover:hidden"
        />
      ) : (
        <UserIcon className="w-8 h-8 rounded-full ml-4 lg:group-hover:hidden" />
      )}
      <div className="flex flex-col">
        <h3 className="text-white font-medium hidden sm:inline group-hover:text-xs ">
          {name}
        </h3>
        <h3 className="text-white font-medium text-xs hidden group-hover:inline">
          {generateTime(time)}
        </h3>
      </div>
    </div>
  );
}
