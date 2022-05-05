import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

import { getSpotify } from "../util/spotify";

const spotifyApi = getSpotify();

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
