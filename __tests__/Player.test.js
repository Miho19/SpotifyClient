import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { act } from "@testing-library/react";
import SpotifyWebApi from "spotify-web-api-node";
import Player from "../components/Player/Player";
import UserPlaylistContextProvider from "../context/userplaylist.context";
import userEvent from "@testing-library/user-event";
import { PlayerContext, SpotifySDKContext } from "../context/socket.context";

jest.mock("next-auth/react");

describe("Player suite", () => {
  beforeEach(() => {
    const session = {
      expires: "1",
      user: {
        email: "email@hotmail.com",
        name: "user name",
        type: "guest",
        image:
          "https://i.scdn.co/image/ab6775700000ee85a97902eae68610957a6f69bd",
        refreshToken: "",
        accessToken: "",
      },
    };

    useSession.mockReturnValue({ data: session, status: false });
  });
  test("Player component should render", async () => {
    render(
      <UserPlaylistContextProvider>
        <Player />)
      </UserPlaylistContextProvider>
    );

    const playbackSection = screen.getByRole("article", {
      name: "playback controls",
    });
    expect(playbackSection).toBeInTheDocument();

    const currentTrackSection = screen.getByRole("article", {
      name: "display no track history",
    });

    expect(currentTrackSection).toBeInTheDocument();

    const volumeControlSection = screen.getByRole("form", {
      name: "control playback volume",
    });

    expect(volumeControlSection).toBeInTheDocument();
  });

  test("Player should have no track history for guests", async () => {
    useSession.mockReturnValue({
      data: { user: { type: "guest" } },
      status: false,
    });

    render(
      <UserPlaylistContextProvider>
        <Player />)
      </UserPlaylistContextProvider>
    );

    const currentTrackArticle = screen.getByRole("article", {
      name: "display no track history",
    });

    expect(currentTrackArticle).toBeInTheDocument();
  });

  test("Player should display a track for an authenticated user", async () => {
    useSession.mockReturnValue({
      data: { user: { type: "" } },
      status: false,
    });

    const currentTrackResponse = {
      context: {
        uri: "spotify:playlist:2RTDaqyIPN1OXbLzX0EdgE",
        type: "playlist",
        href: "https://api.spotify.com/v1/playlists/2RTDaqyIPN1OXbLzX0EdgE",
      },
      currently_playing_type: "track",
      is_playing: true,
      progress_ms: 0,
      timestamp: Date.now(),
      item: {
        duration_ms: 251186,
        href: "https://api.spotify.com/v1/tracks/7brQHA2CgQpcMBiOlfiXYb",
        id: "7brQHA2CgQpcMBiOlfiXYb",
        name: "Afraid",
        type: "track",
        uri: "spotify:track:7brQHA2CgQpcMBiOlfiXYb",
        artists: [
          {
            name: "The Neighbourhood",
            type: "artist",
            uri: "spotify:artist:77SW9BnxLY8rJ0RciFqkHh",
          },
        ],
        album: {
          album_type: "album",
          id: "4xkM0BwLM9H2IUcbYzpcBI",
          images: [
            {
              url: "https://i.scdn.co/image/ab67616d0000b2738265a736a1eb838ad5a0b921",
            },
          ],
        },
      },
    };

    jest
      .spyOn(SpotifyWebApi.prototype, "getAccessToken")
      .mockReturnValue("fakeAccessToken");

    jest
      .spyOn(SpotifyWebApi.prototype, "getMyCurrentPlayingTrack")
      .mockReturnValue({ body: currentTrackResponse });

    render(
      <UserPlaylistContextProvider>
        <Player />)
      </UserPlaylistContextProvider>
    );

    expect(SpotifyWebApi.prototype.getMyCurrentPlayingTrack).toHaveBeenCalled();

    await waitFor(() => {
      const displayTrackArticle = screen.getByRole("article", {
        name: "current track playing",
      });

      expect(displayTrackArticle).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("article", { name: "display no track history" })
    ).not.toBeInTheDocument();
  });

  test("Player should display authenticated last played song if no current track", async () => {
    useSession.mockReturnValue({
      data: { user: { type: "" } },
      status: false,
    });

    const pastTrackResponse = {
      context: {
        uri: "spotify:playlist:2RTDaqyIPN1OXbLzX0EdgE",
        type: "playlist",
        href: "https://api.spotify.com/v1/playlists/2RTDaqyIPN1OXbLzX0EdgE",
      },

      currently_playing_type: "track",
      is_playing: true,
      progress_ms: 0,
      timestamp: Date.now(),
      item: {
        duration_ms: 251186,
        href: "https://api.spotify.com/v1/tracks/7brQHA2CgQpcMBiOlfiXYb",
        id: "7brQHA2CgQpcMBiOlfiXYb",
        name: "Golden Light",
        type: "track",
        uri: "spotify:track:7brQHA2CgQpcMBiOlfiXYb",
        artists: [
          {
            name: "STRFKR",
            type: "artist",
            uri: "spotify:artist:77SW9BnxLY8rJ0RciFqkHh",
          },
        ],
        album: {
          album_type: "album",
          id: "4xkM0BwLM9H2IUcbYzpcBI",
          images: [
            {
              url: "https://i.scdn.co/image/ab67616d0000b2738265a736a1eb838ad5a0b921",
            },
          ],
        },
      },
    };

    jest
      .spyOn(SpotifyWebApi.prototype, "getAccessToken")
      .mockReturnValue("fakeAccessToken");

    jest
      .spyOn(SpotifyWebApi.prototype, "getMyCurrentPlayingTrack")
      .mockReturnValue({ body: {} });

    jest
      .spyOn(SpotifyWebApi.prototype, "getMyRecentlyPlayedTracks")
      .mockReturnValue({
        body: { items: [{ track: { ...pastTrackResponse.item } }] },
      });

    render(
      <UserPlaylistContextProvider>
        <Player />)
      </UserPlaylistContextProvider>
    );

    await waitFor(() => {
      expect(
        SpotifyWebApi.prototype.getMyRecentlyPlayedTracks
      ).toHaveBeenCalled();
    });

    const displayTrackArticle = screen.getByRole("article", {
      name: "current track playing",
    });

    expect(displayTrackArticle).toBeInTheDocument();

    expect(
      screen.queryByRole("article", { name: "display no track history" })
    ).not.toBeInTheDocument();
  });

  test("Should be able to change volume", async () => {
    render(
      <UserPlaylistContextProvider>
        <Player />)
      </UserPlaylistContextProvider>
    );

    const volumeControlSection = screen.getByRole("form", {
      name: "control playback volume",
    });

    expect(volumeControlSection).toBeInTheDocument();

    const volumeInput = screen.getByLabelText("playback volume");

    expect(volumeInput).toBeInTheDocument();

    fireEvent.change(volumeInput, { target: { value: "20" } });

    expect(volumeInput.value).toBe("20");
  });

  test("Player should display authenticated last played song if no current track", async () => {
    useSession.mockReturnValue({
      data: { user: { type: "" } },
      status: false,
    });

    const pastTrackResponse = {
      context: {
        uri: "spotify:playlist:2RTDaqyIPN1OXbLzX0EdgE",
        type: "playlist",
        href: "https://api.spotify.com/v1/playlists/2RTDaqyIPN1OXbLzX0EdgE",
      },

      currently_playing_type: "track",
      is_playing: true,
      progress_ms: 0,
      timestamp: Date.now(),
      item: {
        duration_ms: 251186,
        href: "https://api.spotify.com/v1/tracks/7brQHA2CgQpcMBiOlfiXYb",
        id: "7brQHA2CgQpcMBiOlfiXYb",
        name: "Golden Light",
        type: "track",
        uri: "spotify:track:7brQHA2CgQpcMBiOlfiXYb",
        artists: [
          {
            name: "STRFKR",
            type: "artist",
            uri: "spotify:artist:77SW9BnxLY8rJ0RciFqkHh",
          },
        ],
        album: {
          album_type: "album",
          id: "4xkM0BwLM9H2IUcbYzpcBI",
          images: [
            {
              url: "https://i.scdn.co/image/ab67616d0000b2738265a736a1eb838ad5a0b921",
            },
          ],
        },
      },
    };

    jest
      .spyOn(SpotifyWebApi.prototype, "getAccessToken")
      .mockReturnValue("fakeAccessToken");

    jest
      .spyOn(SpotifyWebApi.prototype, "getMyCurrentPlayingTrack")
      .mockReturnValue({ body: {} });

    jest
      .spyOn(SpotifyWebApi.prototype, "getMyRecentlyPlayedTracks")
      .mockReturnValue({
        body: { items: [{ track: { ...pastTrackResponse.item } }] },
      });

    render(
      <UserPlaylistContextProvider>
        <Player />)
      </UserPlaylistContextProvider>
    );

    await waitFor(() => {
      expect(
        SpotifyWebApi.prototype.getMyRecentlyPlayedTracks
      ).toHaveBeenCalled();
    });

    const displayTrackArticle = screen.getByRole("article", {
      name: "current track playing",
    });

    expect(displayTrackArticle).toBeInTheDocument();

    expect(
      screen.queryByRole("article", { name: "display no track history" })
    ).not.toBeInTheDocument();
  });

  test("Should be able to change volume", async () => {
    render(
      <UserPlaylistContextProvider>
        <Player />)
      </UserPlaylistContextProvider>
    );

    const volumeControlSection = screen.getByRole("form", {
      name: "control playback volume",
    });

    expect(volumeControlSection).toBeInTheDocument();

    const volumeInput = screen.getByLabelText("playback volume");

    expect(volumeInput).toBeInTheDocument();
  });

  test("Clicking speaker label should mute volume", async () => {
    render(
      <UserPlaylistContextProvider>
        <Player />)
      </UserPlaylistContextProvider>
    );

    const volumeButton = screen.getByRole("button", { name: "mute playback" });
    await waitFor(async () => expect(volumeButton).toBeInTheDocument());

    fireEvent.click(volumeButton);

    await waitFor(async () => {
      expect(screen.getByLabelText("playback volume").value).toBe("0");
    });
  });

  test("Clicking speaker label should mute and unmute volume", async () => {
    jest
      .spyOn(SpotifyWebApi.prototype, "getAccessToken")
      .mockReturnValue("fakeAccessToken");

    jest.spyOn(SpotifyWebApi.prototype, "setVolume").mockReturnValue("true");

    render(
      <PlayerContext.Provider value={{ isActive: true }}>
        <UserPlaylistContextProvider>
          <Player />)
        </UserPlaylistContextProvider>
      </PlayerContext.Provider>
    );

    const muteButton = screen.getByRole("button", { name: "mute playback" });
    expect(muteButton).toBeInTheDocument();

    const volumeInput = screen.getByLabelText("playback volume");
    expect(volumeInput).toBeInTheDocument();

    fireEvent.click(muteButton);

    await waitFor(() => {
      expect(volumeInput.value).toBe("0");
    });

    const unmuteButton = screen.getByRole("button", {
      name: "unmute playback",
    });

    expect(unmuteButton).toBeInTheDocument();

    fireEvent.click(unmuteButton);

    expect(volumeInput.value).toBe("50");

    expect(
      screen.getByRole("button", { name: "mute playback" })
    ).toBeInTheDocument();
  });

  test("Clicking the resume button should call toggle playback", async () => {
    const togglePlaybackMock = jest.fn();

    render(
      <UserPlaylistContextProvider>
        <PlayerContext.Provider
          value={{
            isActive: true,
            isHost: true,
          }}
        >
          <SpotifySDKContext.Provider
            value={{ isPaused: true, togglePlayback: togglePlaybackMock }}
          >
            <Player />)
          </SpotifySDKContext.Provider>
        </PlayerContext.Provider>
      </UserPlaylistContextProvider>
    );

    const pauseButton = screen.getByRole("button", { name: "resume playback" });
    expect(pauseButton).toBeInTheDocument();

    fireEvent.click(pauseButton);
    expect(togglePlaybackMock).toHaveBeenCalled();
  });

  test("When player is paused, should display play button", async () => {
    const togglePlaybackMock = jest.fn();

    render(
      <UserPlaylistContextProvider>
        <PlayerContext.Provider
          value={{
            isActive: true,
          }}
        >
          <SpotifySDKContext.Provider
            value={{ isPaused: true, togglePlayback: togglePlaybackMock }}
          >
            <Player />)
          </SpotifySDKContext.Provider>
        </PlayerContext.Provider>
      </UserPlaylistContextProvider>
    );

    const resumeButton = screen.getByRole("button", {
      name: "resume playback",
    });
    expect(resumeButton).toBeInTheDocument();

    fireEvent.click(resumeButton);
    expect(togglePlaybackMock).toHaveBeenCalled();
  });
});
