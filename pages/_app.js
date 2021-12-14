import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import SocketContextProvider from "../context/socket.context";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <SocketContextProvider>
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </SocketContextProvider>
    </SessionProvider>
  );
}

export default MyApp;
