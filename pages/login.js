import React from "react";
import { getProviders, signIn } from "next-auth/react";

export default function Login({ providers }) {
  const spotify = providers.spotify;

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-[#161616]">
      <img
        className="w-20 mb-5"
        src="https://links.papareact.com/9xl"
        alt="spotify icon"
      />
      <div className="w-full  h-12 flex items-center justify-center space-x-7">
        <button
          onClick={() => signIn(spotify.id, { callbackUrl: "/" })}
          className="border border-black h-full  px-5 rounded-3xl bg-[#18D860] text-[#161616] font-normal text-lg hover:scale-110 transition-all hover:text-black hover:text-xl hover:font-semibold"
        >
          Login
        </button>
        <button
          onClick={() => console.log("guest login")}
          className="border border-white h-full bg-white px-5 rounded-3xl hover:scale-110 transition-all hover:text-black hover:text-xl hover:font-semibold"
        >
          Guest
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();

  return {
    props: { providers },
  };
}
