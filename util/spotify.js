import SpotifyWebApi from "spotify-web-api-node";

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

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export const LOGIN_URL = spotifyApi.createAuthorizeURL(scopes, state);

export default spotifyApi;
