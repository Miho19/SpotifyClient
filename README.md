# Spotify-Party

A Spotify clone which uses rooms to host a party playlist users can join and add music to.

### Users

**Currently Spotify-Party does not have an [extended quota](https://developer.spotify.com/documentation/web-api/guides/development-extended-quota-modes/) from Spotify and therefore users have to be manually added.**

#### types of users

- Premium
- free
- **guest** _no authentication required_

### Features

#### All

- Join and leave a room
- View the songs in the party playlist
- Send messages to the room
- Add songs to the party playlist using playlists on the sidebar

#### Premium

- Host the party playlist allowing playback through the web broswer
- Skip to previous or next song within the party playlist
- Add songs from your personal playlists

#### guests

- Add songs from Spotify's 10 most recent playlists to the party playlist

### Upcoming Changes

#### Features

- Vote system for songs
- User profile

#### Tests

- Party component
- Hooks
- Sockets
- Login page
- Songs displayed in playlists and party playlist
- [Travis](https://travis-ci.org/) for CI/CD
- [Cypress](https://www.cypress.io/) for integration tests with backend

### Installation

```bash
cd SpotifyClient
npm install
```

### Usage

```bash
npm run dev
```

### Tests

```bash
npm test
```

### Tech Stack

- [Nextjs](https://nextjs.org/)
- [Tailwindcss](https://tailwindcss.com/)
- [NextAuth](https://next-auth.js.org/)
- [Socket.IO](https://socket.io/)

#### Testing

- [Jest](https://jestjs.io/)
- [Testing Libray](https://testing-library.com/)
