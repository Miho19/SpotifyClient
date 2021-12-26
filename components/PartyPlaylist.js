import React from "react";

export default function PartyPlaylist() {
  return (
    <div className="h-full w-full flex flex-col">
      <header className="flex w-full h-10 items-center justify-start pt-5 pb-5">
        <h2 className=" text-white ml-5 font-medium text-xs sm:text-lg lg:text-sm lgg:text-lg">
          Hello
        </h2>
      </header>
      <main className="w-full h-[calc(100%-2.5rem)] overflow-scroll scrollbar-hide space-y-1">
        {memberList}
      </main>
      <footer className="w-full h-[2.5rem]">footer controls</footer>
    </div>
  );
}
