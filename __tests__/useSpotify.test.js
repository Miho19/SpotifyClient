import { render, screen } from "@testing-library/react";
import { signOut, useSession } from "next-auth/react";
import { act } from "react-dom/test-utils";
import SpotifyWebApi from "spotify-web-api-node";
import Player from "../components/Player/Player";

import UserPlaylistContextProvider from "../context/userplaylist.context";

jest.mock("next-auth/react");

describe("useSpotify suite", () => {
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

  test("if session is invalid, should call signOut", async () => {
    useSession.mockReturnValue({ data: {}, status: false });

    await act(async () => {
      render(
        <UserPlaylistContextProvider>
          <Player />)
        </UserPlaylistContextProvider>
      );
    });

    expect(signOut).toHaveBeenCalled();
  });

  test("if session is valid, should call setAccessToken", async () => {
    jest.spyOn(SpotifyWebApi.prototype, "setAccessToken");

    await act(async () => {
      render(
        <UserPlaylistContextProvider>
          <Player />)
        </UserPlaylistContextProvider>
      );
    });

    expect(SpotifyWebApi.prototype.setAccessToken).toHaveBeenCalled();
  });
});
