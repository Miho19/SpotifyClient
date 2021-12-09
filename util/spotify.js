import SpotifyWebApi from "spotify-web-api-node";

/** permissions */
const scopes = [
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-read-private",
  "user-library-read",
  "user-top-read",
  "streaming",
  "user-read-playback-state",
  "user-read-currently-playing",
  "user-modify-playback-state",
  "user-read-recently-played",
  "user-follow-read",
];

const state = "";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export const LOGIN_URL = spotifyApi.createAuthorizeURL(scopes, state);

export default spotifyApi;
