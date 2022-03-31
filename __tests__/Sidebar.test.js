import { render, screen, waitFor } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { signOut, useSession } from "next-auth/react";
import spotifyWebApi from "spotify-web-api-node";
import React from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import DrawersContextProvider, {
  DrawerContext,
} from "../context/drawers.context";

import UserPlaylistContextProvider, {
  UserPlaylistContext,
} from "../context/userplaylist.context";

import { act } from "react-dom/test-utils";

jest.mock("next-auth/react");
jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("Sidebar suite", () => {
  beforeAll(() => {
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

  test("render sidebar closed", () => {
    global.innerWidth = 500;

    render(
      <DrawersContextProvider>
        <Sidebar />
      </DrawersContextProvider>
    );

    expect(
      screen.getByRole("button", { name: "open sidebar" })
    ).toBeInTheDocument();
  });

  test("render sidebar open", () => {
    global.innerWidth = 1500;

    render(
      <DrawersContextProvider>
        <Sidebar />
      </DrawersContextProvider>
    );

    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
  });

  test("Sidebar should not display playlists when AccessToken is missing", () => {
    global.innerWidth = 1500;

    render(
      <DrawersContextProvider>
        <Sidebar />
      </DrawersContextProvider>
    );

    const list = screen.getByRole("list", {
      name: "List of playlists available to the user to click on",
    });
    expect(list).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  test("Sidebar should not display playlists when it does not hit the API", async () => {
    jest
      .spyOn(spotifyWebApi.prototype, "getAccessToken")
      .mockReturnValue("fakeAccessToken");

    jest
      .spyOn(spotifyWebApi.prototype, "getUserPlaylists")
      .mockReturnValue({ body: { items: [] } });

    await act(async () => {
      render(
        <DrawersContextProvider>
          <Sidebar />
        </DrawersContextProvider>
      );
    });

    expect(
      screen.getByRole("button", { name: "close sidebar" })
    ).toBeInTheDocument();

    const playlist = screen.queryByRole("listitem", {
      name: "name: Link to the playlist Today's Top Hits",
    });

    expect(playlist).not.toBeInTheDocument();
  });

  test("Sidebar will display a playlist within its userplaylists", async () => {
    const fakePlaylists = [
      {
        id: "37i9dQZF1DXcBWIGoYBM5M",
        images: [
          {
            url: "https://i.scdn.co/image/ab67706f000000034534650d2b3552c0b8ad531a",
          },
        ],
        name: "Today's Top Hits",
        snapshot_id:
          "MTY0ODQ5NjA0NywwMDAwMDUyZjAwMDAwMTdmZDIwNTc2ZDIwMDAwMDE3ZmJlNmY5ODZh",
        tracks: {
          href: "https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M/tracks",
        },
        type: "playlist",
        uri: "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M",
      },
    ];

    jest
      .spyOn(spotifyWebApi.prototype, "getAccessToken")
      .mockReturnValue("fakeAccessToken");

    jest
      .spyOn(spotifyWebApi.prototype, "getUserPlaylists")
      .mockReturnValue({ body: { items: fakePlaylists } });

    await act(async () => {
      render(
        <DrawersContextProvider>
          <Sidebar />
        </DrawersContextProvider>
      );
    });

    expect(
      screen.getByRole("listitem", {
        name: "Link to the playlist Today's Top Hits",
      })
    ).toBeInTheDocument();
  });

  test("Should be able to click on a playlist within the sidebar", async () => {
    const fakePlaylists = [
      {
        id: "37i9dQZF1DXcBWIGoYBM5M",
        images: [
          {
            url: "https://i.scdn.co/image/ab67706f000000034534650d2b3552c0b8ad531a",
          },
        ],
        name: "Today's Top Hits",
        snapshot_id:
          "MTY0ODQ5NjA0NywwMDAwMDUyZjAwMDAwMTdmZDIwNTc2ZDIwMDAwMDE3ZmJlNmY5ODZh",
        tracks: {
          href: "https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M/tracks",
        },
        type: "playlist",
        uri: "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M",
      },
    ];

    jest
      .spyOn(spotifyWebApi.prototype, "getAccessToken")
      .mockReturnValue("fakeAccessToken");

    jest
      .spyOn(spotifyWebApi.prototype, "getUserPlaylists")
      .mockReturnValue({ body: { items: fakePlaylists } });

    jest.spyOn(spotifyWebApi.prototype, "getPlaylist").mockReturnValue({});

    const setPlaylistMock = jest.fn();

    await act(async () => {
      render(
        <DrawersContextProvider>
          <UserPlaylistContext.Provider
            value={{ setCurrentPlaylistId: setPlaylistMock }}
          >
            <Sidebar />
          </UserPlaylistContext.Provider>
        </DrawersContextProvider>
      );
    });

    const playlistItem = screen.getByRole("listitem", {
      name: "Link to the playlist Today's Top Hits",
    });

    expect(playlistItem).toBeInTheDocument();

    await userEvent.click(playlistItem);

    expect(setPlaylistMock).toHaveBeenCalledTimes(1);
  });

  test("Clicking the signout button triggers a signOut", async () => {
    const fakePlaylists = [
      {
        id: "37i9dQZF1DXcBWIGoYBM5M",
        images: [
          {
            url: "https://i.scdn.co/image/ab67706f000000034534650d2b3552c0b8ad531a",
          },
        ],
        name: "Today's Top Hits",
        snapshot_id:
          "MTY0ODQ5NjA0NywwMDAwMDUyZjAwMDAwMTdmZDIwNTc2ZDIwMDAwMDE3ZmJlNmY5ODZh",
        tracks: {
          href: "https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M/tracks",
        },
        type: "playlist",
        uri: "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M",
      },
    ];

    jest
      .spyOn(spotifyWebApi.prototype, "getAccessToken")
      .mockReturnValue("fakeAccessToken");

    jest
      .spyOn(spotifyWebApi.prototype, "getUserPlaylists")
      .mockReturnValue({ body: { items: fakePlaylists } });

    jest.spyOn(spotifyWebApi.prototype, "getPlaylist").mockReturnValue({});

    await act(async () => {
      render(
        <DrawersContextProvider>
          <Sidebar />
        </DrawersContextProvider>
      );
    });

    const signOutButton = screen.getByRole("button", { name: "sign out" });

    expect(signOutButton).toBeInTheDocument();

    await userEvent.click(signOutButton);

    expect(signOut).toHaveBeenCalled();
  });

  test("Clicking the left arrow should close the sidebar", async () => {
    const fakePlaylists = [
      {
        id: "37i9dQZF1DXcBWIGoYBM5M",
        images: [
          {
            url: "https://i.scdn.co/image/ab67706f000000034534650d2b3552c0b8ad531a",
          },
        ],
        name: "Today's Top Hits",
        snapshot_id:
          "MTY0ODQ5NjA0NywwMDAwMDUyZjAwMDAwMTdmZDIwNTc2ZDIwMDAwMDE3ZmJlNmY5ODZh",
        tracks: {
          href: "https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M/tracks",
        },
        type: "playlist",
        uri: "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M",
      },
    ];

    jest
      .spyOn(spotifyWebApi.prototype, "getAccessToken")
      .mockReturnValue("fakeAccessToken");

    jest
      .spyOn(spotifyWebApi.prototype, "getUserPlaylists")
      .mockReturnValue({ body: { items: fakePlaylists } });

    jest.spyOn(spotifyWebApi.prototype, "getPlaylist").mockReturnValue({});

    const closeSidebar = jest.fn();

    await act(async () => {
      render(
        <DrawerContext.Provider
          value={{ setDrawerStatus: closeSidebar, isSidebarOpen: true }}
        >
          <Sidebar />
        </DrawerContext.Provider>
      );
    });

    const closeSiderbarButton = screen.getByRole("button", {
      name: "close sidebar",
    });

    expect(closeSiderbarButton).toBeInTheDocument();

    await userEvent.click(closeSiderbarButton);
    expect(closeSidebar).toHaveBeenCalled();
  });

  test("clicking close siderbar button should trigger the close function", async () => {
    const fakePlaylists = [
      {
        id: "37i9dQZF1DXcBWIGoYBM5M",
        images: [
          {
            url: "https://i.scdn.co/image/ab67706f000000034534650d2b3552c0b8ad531a",
          },
        ],
        name: "Today's Top Hits",
        snapshot_id:
          "MTY0ODQ5NjA0NywwMDAwMDUyZjAwMDAwMTdmZDIwNTc2ZDIwMDAwMDE3ZmJlNmY5ODZh",
        tracks: {
          href: "https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M/tracks",
        },
        type: "playlist",
        uri: "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M",
      },
    ];

    jest
      .spyOn(spotifyWebApi.prototype, "getAccessToken")
      .mockReturnValue("fakeAccessToken");

    jest
      .spyOn(spotifyWebApi.prototype, "getUserPlaylists")
      .mockReturnValue({ body: { items: fakePlaylists } });

    jest.spyOn(spotifyWebApi.prototype, "getPlaylist").mockReturnValue({});

    await act(async () => {
      render(
        <DrawersContextProvider>
          <Sidebar />
        </DrawersContextProvider>
      );
    });

    const closeSiderbarButton = screen.getByRole("button", {
      name: "close sidebar",
    });

    expect(closeSiderbarButton).toBeInTheDocument();

    await userEvent.click(closeSiderbarButton);

    const openSidebarButton = screen.getByRole("button", {
      name: "open sidebar",
    });
    expect(openSidebarButton).toBeInTheDocument();
  });

  test("Closing and then opening the sidebar should render it open", async () => {
    const fakePlaylists = [
      {
        id: "37i9dQZF1DXcBWIGoYBM5M",
        images: [
          {
            url: "https://i.scdn.co/image/ab67706f000000034534650d2b3552c0b8ad531a",
          },
        ],
        name: "Today's Top Hits",
        snapshot_id:
          "MTY0ODQ5NjA0NywwMDAwMDUyZjAwMDAwMTdmZDIwNTc2ZDIwMDAwMDE3ZmJlNmY5ODZh",
        tracks: {
          href: "https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M/tracks",
        },
        type: "playlist",
        uri: "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M",
      },
    ];

    jest
      .spyOn(spotifyWebApi.prototype, "getAccessToken")
      .mockReturnValue("fakeAccessToken");

    jest
      .spyOn(spotifyWebApi.prototype, "getUserPlaylists")
      .mockReturnValue({ body: { items: fakePlaylists } });

    jest.spyOn(spotifyWebApi.prototype, "getPlaylist").mockReturnValue({});

    await act(async () => {
      render(
        <DrawersContextProvider>
          <Sidebar />
        </DrawersContextProvider>
      );
    });

    const closeSiderbarButton = screen.getByRole("button", {
      name: "close sidebar",
    });

    expect(closeSiderbarButton).toBeInTheDocument();

    await userEvent.click(closeSiderbarButton);

    const openSidebarButton = screen.getByRole("button", {
      name: "open sidebar",
    });

    await userEvent.click(openSidebarButton);

    const signOutButton = screen.getByRole("button", { name: "sign out" });

    expect(signOutButton).toBeInTheDocument();
  });
});

/**
 * https://github.com/nextauthjs/next-auth/discussions/4185
 * https://polvara.me/posts/mocking-context-with-react-testing-library
 *
 */
