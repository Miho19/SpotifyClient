import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export default function useSpotify() {
  const { data: session, loading } = useSession();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (session) {
      if (session.error === "RefreshAccessTokenError") {
        return signOut();
      }

      if (session.user) {
        return spotifyApi.setAccessToken(session.user.accessToken);
      }

      signOut();
    }
  }, [session]);

  return spotifyApi;
}
