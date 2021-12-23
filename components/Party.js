import React, { useState, useContext } from "react";
import { SocketContext } from "../context/socket.context";

import PartyForm from "./PartyForm";
import PartyGroup from "./PartyGroup";
import RoomList from "./RoomList";

export default function Party() {
  const [partyNameValue, setPartyNameValue] = useState("");

  const { socket, EVENTS } = useContext(SocketContext);

  const { room } = useContext(SocketContext);

  const handleJoinSubmit = (e) => {
    if (e.key !== "Enter") return;
    if (partyNameValue.length === 0) return;
    socket.emit(EVENTS.CLIENT.JOIN_ROOM, { roomName: partyNameValue });
    setPartyNameValue("");
  };

  return (
    <div className="flex-grow h-[calc(100vh-6rem)] overflow-y-scroll scrollbar-hide bg-[#242424] ">
      <main className="p-8 grid grid-cols-3 grid-rows-6 h-full w-full">
        <div className=" row-span-full ">
          <div className="grid grid-rows-6 h-full w-full">
            <div className="row-span-5 row-start-1 row-end-6 bg-black w-full">
              {room.roomID !== "" ? (
                <PartyGroup />
              ) : (
                <RoomList setPartyNameValue={setPartyNameValue} />
              )}
            </div>
            <div className="row-span-1 row-start-6 space-y-2">
              <PartyForm
                value={partyNameValue}
                setValue={setPartyNameValue}
                placeholder={"Party Name"}
              />

              <div className="flex space-x-1 ">
                <button
                  className="bg-green-500 text-white p-1 rounded-full w-[50%] font-medium"
                  onClick={() => {
                    if (partyNameValue.trim().length === 0) return;

                    socket.emit(EVENTS.CLIENT.JOIN_ROOM, {
                      roomName: partyNameValue.trim(),
                    });
                    setPartyNameValue("");
                  }}
                >
                  Join
                </button>
                <button
                  className="bg-red-500 text-white p-1 rounded-full w-[50%] font-medium "
                  onClick={() => {
                    socket.emit(EVENTS.CLIENT.LEAVE_ROOM);
                  }}
                >
                  Leave
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="hover:bg-red-700 row-span-full col-span-2"></div>
      </main>
    </div>
  );
}
