import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Player from "../components/Player/Player";

import { Provider } from "react-redux";
import { store } from "../app/store";
import SpotifySDKProvider from "../context/spotifyWebSDK.context";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <SpotifySDKProvider>
          <Component {...pageProps} />
          {session && <Player />}
        </SpotifySDKProvider>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
