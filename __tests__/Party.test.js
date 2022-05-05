import { render, screen } from "@testing-library/react";
import Party from "../components/Party/Party";
import { useSession } from "next-auth/react";
import React from "react";
import { DrawerContext } from "../context/drawers.context";
import msToMinutesAndSeconds from "../util/time";

jest.mock("next-auth/react");

describe("Party suite", () => {
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

  test("Party component should load home page when not in a room", () => {
    render(<Party />);

    expect(
      screen.getByRole("heading", { name: "Join a room" })
    ).toBeInTheDocument();
  });

  test("Party component should have a UserDisplay within it", () => {
    render(<Party />);

    expect(
      screen.getByRole("heading", { name: "user name" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("img", {
        name: "profile picture of user name",
      })
    );
  });

  test("Party component should display songs", () => {
    const roomPlaylistObjectMock = {
      tracks: {
        items: [
          {
            track: {
              id: "2Vi8BQIM9vCQkkrvf3VPjI",
              name: "Money",
              duration_ms: 238180,
              uri: "spotify:track:2Vi8BQIM9vCQkkrvf3VPjI",
              artists: [
                {
                  id: "6yrtCy4XJHXM6tczo4RlTs",
                  name: "Lime Cordiale",
                },
              ],
              album: {
                images: [
                  {
                    url: "https://i.scdn.co/image/ab67616d0000b2732ad905ceb12f622bbc5bdafa",
                  },
                ],
                name: "14 Steps To A Better You",
              },
            },
          },
        ],
      },
    };

    const roomMock = { roomID: "1", roomName: "Mock Room" };

    render(
      <RoomContext.Provider
        value={{ room: roomMock, roomPlaylistObject: roomPlaylistObjectMock }}
      >
        <Party />
      </RoomContext.Provider>
    );

    expect(screen.queryByText("Join a room")).not.toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByRole("listitem")).toBeInTheDocument();
    expect(
      screen.getByText(roomPlaylistObjectMock.tracks.items[0].track.name)
    ).toBeInTheDocument();
  });

  test("Display of duration should not be shown at lower widths", async () => {
    const durationShowBreakpoint = 870;

    global.innerWidth = durationShowBreakpoint - 1;

    const roomPlaylistObjectMock = {
      tracks: {
        items: [
          {
            track: {
              id: "2Vi8BQIM9vCQkkrvf3VPjI",
              name: "Money",
              duration_ms: 238180,
              uri: "spotify:track:2Vi8BQIM9vCQkkrvf3VPjI",
              artists: [
                {
                  id: "6yrtCy4XJHXM6tczo4RlTs",
                  name: "Lime Cordiale",
                },
              ],
              album: {
                images: [
                  {
                    url: "https://i.scdn.co/image/ab67616d0000b2732ad905ceb12f622bbc5bdafa",
                  },
                ],
                name: "14 Steps To A Better You",
              },
            },
          },
        ],
      },
    };

    const roomMock = { roomID: "1", roomName: "Mock Room" };

    render(
      <DrawerContext.Provider value={{ isChatOpen: true, isSidebarOpen: true }}>
        <RoomContext.Provider
          value={{ room: roomMock, roomPlaylistObject: roomPlaylistObjectMock }}
        >
          <Party />
        </RoomContext.Provider>
      </DrawerContext.Provider>
    );

    expect(
      screen.getByText(roomPlaylistObjectMock.tracks.items[0].track.name)
    ).toBeInTheDocument();

    const duration = msToMinutesAndSeconds(
      roomPlaylistObjectMock.tracks.items[0].track.duration_ms
    );

    const duration_ms = screen.getByText(duration);

    expect(duration_ms.classList.contains("hidden")).toBe(true);
  });

  test("Display of duration should be shown at higher widths", async () => {
    const durationShowBreakpoint = 870;

    global.innerWidth = durationShowBreakpoint + 1;

    const roomPlaylistObjectMock = {
      tracks: {
        items: [
          {
            track: {
              id: "2Vi8BQIM9vCQkkrvf3VPjI",
              name: "Money",
              duration_ms: 238180,
              uri: "spotify:track:2Vi8BQIM9vCQkkrvf3VPjI",
              artists: [
                {
                  id: "6yrtCy4XJHXM6tczo4RlTs",
                  name: "Lime Cordiale",
                },
              ],
              album: {
                images: [
                  {
                    url: "https://i.scdn.co/image/ab67616d0000b2732ad905ceb12f622bbc5bdafa",
                  },
                ],
                name: "14 Steps To A Better You",
              },
            },
          },
        ],
      },
    };

    const roomMock = { roomID: "1", roomName: "Mock Room" };

    render(
      <DrawerContext.Provider value={{ isChatOpen: true, isSidebarOpen: true }}>
        <RoomContext.Provider
          value={{ room: roomMock, roomPlaylistObject: roomPlaylistObjectMock }}
        >
          <Party />
        </RoomContext.Provider>
      </DrawerContext.Provider>
    );

    expect(
      screen.getByText(roomPlaylistObjectMock.tracks.items[0].track.name)
    ).toBeInTheDocument();

    const duration = msToMinutesAndSeconds(
      roomPlaylistObjectMock.tracks.items[0].track.duration_ms
    );

    const duration_ms = screen.getByText(duration);

    expect(duration_ms.classList.contains("hidden")).toBe(false);
  });

  test("Song name of the first song within the party playlist should be green", () => {
    const durationShowBreakpoint = 870;

    global.innerWidth = durationShowBreakpoint + 1;

    const roomPlaylistObjectMock = {
      tracks: {
        items: [
          {
            track: {
              id: "2Vi8BQIM9vCQkkrvf3VPjI",
              name: "Money",
              duration_ms: 238180,
              uri: "spotify:track:2Vi8BQIM9vCQkkrvf3VPjI",
              artists: [
                {
                  id: "6yrtCy4XJHXM6tczo4RlTs",
                  name: "Lime Cordiale",
                },
              ],
              album: {
                images: [
                  {
                    url: "https://i.scdn.co/image/ab67616d0000b2732ad905ceb12f622bbc5bdafa",
                  },
                ],
                name: "14 Steps To A Better You",
              },
            },
          },
        ],
      },
    };

    const roomMock = { roomID: "1", roomName: "Mock Room" };

    render(
      <DrawerContext.Provider value={{ isChatOpen: true, isSidebarOpen: true }}>
        <RoomContext.Provider
          value={{ room: roomMock, roomPlaylistObject: roomPlaylistObjectMock }}
        >
          <Party />
        </RoomContext.Provider>
      </DrawerContext.Provider>
    );

    expect(
      screen.getByText(roomPlaylistObjectMock.tracks.items[0].track.name)
    ).toBeInTheDocument();

    const songName = screen.getByText(
      roomPlaylistObjectMock.tracks.items[0].track.name
    );

    expect(songName.classList.contains("text-green-400")).toBe(true);
  });
});
