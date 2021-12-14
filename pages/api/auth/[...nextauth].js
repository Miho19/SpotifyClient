import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../util/spotify";

async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      expires_at: Date.now() / 1000 + refreshedToken.expires_in, // expires in 1 hour from now
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken, // if no refreshtoken returned use old refresh token
    };
  } catch (e) {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, account, user }) {
      // initial sign in

      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expires_at: account.expires_at, // convert seconds to ms
        };
      }

      // return previous token if valid
      if (Date.now() < token.accessTokenExpires * 1000) {
        return { ...token };
      }

      // expired token
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.error = token.error;
      return session;
    },
  },
});

/**
 *
 * google --> refresh token rotation
 */
