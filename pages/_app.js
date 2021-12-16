import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import SocketContextProvider from "../context/socket.context";
import SpotifyWebSDKContextProvider from "../context/spotifyWebSDK.context";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <SpotifyWebSDKContextProvider>
        <SocketContextProvider>
          <RecoilRoot>
            <Component {...pageProps} />
          </RecoilRoot>
        </SocketContextProvider>
      </SpotifyWebSDKContextProvider>
    </SessionProvider>
  );
}

export default MyApp;
