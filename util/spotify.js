import SpotifyWebApi from "spotify-web-api-node";

let spotifyApi = null;
let LOGINURL = "";

const redirect =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/auth/callback/spotify"
    : `https://spotify-client-blue.vercel.app/api/auth/callback/spotify`;

/** permissions */
const scopes = [
  "user-read-email",
  "user-read-playback-state",
  "user-read-currently-playing",
  "user-modify-playback-state",
  "user-read-recently-played",
  "user-follow-read",
  "user-read-private",
  "user-library-read",
  "user-top-read",
  "user-read-playback-position",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "streaming",
];

const state = "";

export const getSpotify = () => {
  if (spotifyApi) return spotifyApi;

  spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
    redirectUri: redirect,
  });

  return spotifyApi;
};

export const getLoginUrl = () => {
  if (spotifyApi) {
    LOGINURL = spotifyApi.createAuthorizeURL(scopes, state);

    return LOGINURL;
  }

  spotifyApi = getSpotify();

  return getLoginUrl();
};
