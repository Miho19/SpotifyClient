import React from "react";
import { getProviders, signIn } from "next-auth/react";

export default function Login({ providers }) {
  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-black">
      <img
        className="w-20 mb-5"
        src="https://links.papareact.com/9xl"
        alt="spotify icon"
      />
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-[#18D860] text-white p-5 rounded-full"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();

  return {
    props: { providers },
  };
}
