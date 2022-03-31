import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";

import SocketContextProvider from "../context/socket.context";

import Player from "../components/Player/Player";
import UserPlaylistContextProvider from "../context/userplaylist.context";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <SocketContextProvider>
        <UserPlaylistContextProvider>
          <Component {...pageProps} />
          {session && <Player />}
        </UserPlaylistContextProvider>
      </SocketContextProvider>
    </SessionProvider>
  );
}

export default MyApp;
