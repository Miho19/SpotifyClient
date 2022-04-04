import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getProviders, signIn } from "next-auth/react";
import Login from "../pages/login";

jest.mock("next-auth/react");

describe("Login suite", () => {
  test("Login page renders", () => {
    const providers = { spotify: {}, guest: {} };

    render(<Login providers={providers} />);

    expect(
      screen.getByRole("img", { name: "spotify icon" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Guest" }));
  });

  test("Login page renders with no guest input showing", () => {
    const providers = { spotify: {}, guest: {} };

    render(<Login providers={providers} />);

    expect(
      screen.queryByRole("form", { name: "choose your guest name" })
    ).not.toBeInTheDocument();
  });

  test("Clicking the guest button should bring up the guest input", async () => {
    const providers = { spotify: {}, guest: {} };

    render(<Login providers={providers} />);

    const guestButton = screen.getByRole("button", { name: "Guest" });

    fireEvent.click(guestButton);

    await screen.findByRole("textbox");

    const guestInput = screen.getByRole("textbox");

    expect(guestInput).toBeInTheDocument();
  });

  test("Should be able to type into the guest input", async () => {
    const providers = { spotify: {}, guest: {} };

    render(<Login providers={providers} />);

    const guestButton = screen.getByRole("button", { name: "Guest" });

    fireEvent.click(guestButton);

    await screen.findByRole("textbox");

    const guestInput = screen.getByRole("textbox");

    expect(guestInput).toBeInTheDocument();

    fireEvent.change(guestInput, { target: { value: "Guest Name" } });

    expect(guestInput.value).toBe("Guest Name");
  });

  test("Submitting the guest input should fire off signIn", async () => {
    const providers = { spotify: {}, guest: {} };

    render(<Login providers={providers} />);

    const guestButton = screen.getByRole("button", { name: "Guest" });

    fireEvent.click(guestButton);

    await screen.findByRole("textbox");

    const guestInput = screen.getByRole("textbox");

    expect(guestInput).toBeInTheDocument();

    fireEvent.change(guestInput, { target: { value: "Guest Name" } });

    fireEvent.click(screen.getByRole("button", { name: "Enter" }));

    expect(signIn).toHaveBeenCalled();
  });

  test("Clearing the guest input using the x button", async () => {
    const providers = { spotify: {}, guest: {} };

    render(<Login providers={providers} />);

    const guestButton = screen.getByRole("button", { name: "Guest" });

    fireEvent.click(guestButton);

    await screen.findByRole("textbox");

    const guestInput = screen.getByRole("textbox");

    expect(guestInput).toBeInTheDocument();

    fireEvent.change(guestInput, { target: { value: "Guest Name" } });

    const xButton = screen.getByRole("button", { name: "X" });

    fireEvent.click(xButton);

    expect(guestInput.value).toBe("");
  });

  test("Clicking the close button should remove the input from the display", async () => {
    const providers = { spotify: {}, guest: {} };

    render(<Login providers={providers} />);

    const guestButton = screen.getByRole("button", { name: "Guest" });

    fireEvent.click(guestButton);

    await screen.findByRole("textbox");

    const guestInput = screen.getByRole("textbox");

    expect(guestInput).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: "Close" });

    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);

    expect(guestInput).not.toBeInTheDocument();
  });

  test("Clicking the Login button should call signIn", () => {
    const providers = { spotify: {}, guest: {} };

    render(<Login providers={providers} />);

    const loginButton = screen.getByRole("button", { name: "Login" });

    expect(loginButton).toBeInTheDocument();

    fireEvent.click(loginButton);

    expect(signIn).toHaveBeenCalled();
  });
});
