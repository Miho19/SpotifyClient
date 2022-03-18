import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import CredentialsProvider from "next-auth/providers/credentials";
import spotifyApi, { LOGIN_URL } from "../../../util/spotify";
import axios from "axios";

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
    CredentialsProvider({
      id: "guest",
      name: "Guest Login",
      async authorize(credentials, req) {
        const guestResponse = await axios.get(
          "http://localhost:4000/api/v1/spotify/guest"
        );

        if (!guestResponse.data.success) return null;

        const user = { ...guestResponse.data.data[0], name: credentials.name };

        return user;
      },
      credentials: {
        name: { label: "Full name", type: "text", placeholder: "John Smith" },
      },
    }),
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: { signIn: "/login" },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return Promise.resolve(url);
    },
    async jwt({ token, account, user }) {
      if (user && user.type === "guest") {
        return {
          ...token,
          accessToken: user.access_token,
          expires_at: user.expires_at,
          type: "guest",
        };
      }

      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expires_at: account.expires_at, // convert seconds to ms
        };
      }

      // return previous token if valid
      if (Date.now() < token.expires_at * 1000) {
        return { ...token };
      }

      // expired token
      return await refreshAccessToken(token);
    },
    async session({ session, user, token }) {
      session.user.type = token.type;
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.error = token.error;
      return session;
    },
  },
});
