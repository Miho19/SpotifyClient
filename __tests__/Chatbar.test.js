import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Chatbar from "../components/Chatbar/Chatbar";
import DrawersContextProvider from "../context/drawers.context";
import { useSession } from "next-auth/react";
import React from "react";
import userEvent from "@testing-library/user-event";

jest.mock("next-auth/react");

describe("Chatbar Tests", () => {
  window.HTMLElement.prototype.scrollIntoView = function () {};

  beforeAll(() => {
    const session = {
      expires: "1",
      user: { email: "email@hotmail.com", name: "user-name" },
    };

    useSession.mockReturnValue([session, false]);
  });

  test("render the Chatbar component", () => {
    render(<Chatbar />);

    expect(screen.queryByText("Party Chat")).not.toBeInTheDocument();
  });

  test("render Chatbar component with its drawer open", () => {
    render(
      <DrawersContextProvider value={{ isChatOpen: true }}>
        <Chatbar />
      </DrawersContextProvider>
    );
    expect(screen.getByText("Party Chat")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "close chatbar" })).toBeTruthy();
  });

  test("Chatbar setting drawer status should close it", async () => {
    render(
      <DrawersContextProvider>
        <Chatbar />
      </DrawersContextProvider>
    );

    const closeButton = screen.getByRole("button", { name: "close chatbar" });

    await userEvent.click(closeButton);
    expect(screen.queryByText("Party Chat")).not.toBeInTheDocument();
  });

  test("Chatbar close then open should display chatbar", async () => {
    render(
      <DrawersContextProvider>
        <Chatbar />
      </DrawersContextProvider>
    );

    const closeButton = screen.getByRole("button", { name: "close chatbar" });

    await userEvent.click(closeButton);
    expect(screen.queryByText("Party Chat")).not.toBeInTheDocument();

    const openButton = screen.getByRole("button", { name: "open chatbar" });
    expect(openButton).toBeInTheDocument();

    await userEvent.click(openButton);
    expect(screen.getByText("Party Chat")).toBeInTheDocument();
  });

  test("Chatbar should have an input", () => {
    render(
      <DrawersContextProvider value={{ isChatOpen: true }}>
        <Chatbar />
      </DrawersContextProvider>
    );

    const input = screen.getByRole("textbox", { name: "message input" });
    expect(input).toBeInTheDocument();
  });

  test("Chatbar input by default should be disabled", () => {
    render(
      <DrawersContextProvider value={{ isChatOpen: true }}>
        <Chatbar />
      </DrawersContextProvider>
    );

    const input = screen.getByRole("textbox", { name: "message input" });
    expect(input).toBeInTheDocument();
    expect(input).toBeDisabled();
  });
});
