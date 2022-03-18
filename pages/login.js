import React, { useState } from "react";
import { getProviders, signIn } from "next-auth/react";

export default function Login({ providers }) {
  const [guestLogin, setGuestLogin] = useState(false);

  const [value, setValue] = useState("");
  const maxValueLength = 25;

  const spotify = providers.spotify;
  const guest = providers.guest;

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-[#161616] space-y-4">
      <img
        className="w-20 mb-5"
        src="https://links.papareact.com/9xl"
        alt="spotify icon"
      />
      {!guestLogin && (
        <div className="w-full  h-12 flex items-center justify-center space-x-7">
          <button
            onClick={() => signIn(spotify.id, { callbackUrl: "/" })}
            className="border border-black h-full  px-5 rounded-3xl bg-[#18D860] text-[#161616] font-normal text-lg hover:scale-110 transition-all hover:text-black hover:text-xl hover:font-semibold"
          >
            Login
          </button>
          <button
            onClick={() => setGuestLogin(true)}
            className="border border-white h-full bg-white px-5 rounded-3xl hover:scale-110 transition-all hover:text-black hover:text-xl hover:font-semibold"
          >
            Guest
          </button>
        </div>
      )}
      {guestLogin && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex flex-col items-center h-full space-y-4"
        >
          <div className="flex items-center">
            <input
              value={value}
              autoFocus
              id="name"
              name="name"
              placeholder="Full name"
              className={`w-full rounded-full border text-lg focus:outline-none ml-4 py-1 pl-4 pr-8 ${
                value.length > 0 ? `mr-8` : `mr-4`
              }`}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                if (value.length === 0) return;

                signIn(guest.id, { callbackUrl: "/", name: value });

                setValue("");
              }}
              onChange={(e) => {
                if (e.target.value.length > maxValueLength) return; // add in error message here
                setValue(e.target.value);
              }}
            />
            <span
              className={`items-center border-0  pr-7 ml-[-3.5rem]  ${
                value.length > 0 ? `flex` : `hidden`
              }`}
            >
              <button
                className="font-bold text-black"
                onClick={(e) => setValue("")}
              >
                X
              </button>
            </span>
          </div>
          <div className="flex w-full space-x-4 px-5 justify-between">
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                if (value.length === 0) return;
                signIn(guest.id, { callbackUrl: "/", name: value });
              }}
              className="w-full border border-black h-full  px-5 rounded-3xl bg-[#18D860] text-[#161616] font-normal text-lg hover:scale-110 transition-all hover:text-black hover:text-xl hover:font-semibold"
            >
              Enter
            </button>
            <button
              className="w-full border border-black h-full  px-5 rounded-3xl bg-red-500 text-[#161616] font-normal text-lg hover:scale-110 transition-all hover:text-black hover:text-xl hover:font-semibold"
              onClick={(e) => setGuestLogin(false)}
            >
              Close
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

//signIn(guest.id, { callbackUrl: "/" })

export async function getServerSideProps(context) {
  const providers = await getProviders();

  return {
    props: { providers },
  };
}
