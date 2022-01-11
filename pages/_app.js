import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import SocketContextProvider from "../context/socket.context";

import Player from "../components/Player";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <SocketContextProvider>
        <RecoilRoot>
          <Component {...pageProps} />
          {session && <Player />}
        </RecoilRoot>
      </SocketContextProvider>
    </SessionProvider>
  );
}

export default MyApp;
