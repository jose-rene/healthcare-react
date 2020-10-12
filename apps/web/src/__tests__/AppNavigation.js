import "@testing-library/jest-dom";
import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { generate as generateRandomString } from "randomstring";
import { render, screen, axiosMock, fireEvent, wait } from "../testUtils";
import { AUTH_TOKEN_NAME } from "../config/URLs";
import AppNavigation from "../navigation/AppNavigation";

describe("App Navigation", () => {
  it("renders login with redux state defaults", async () => {
    // render with redux
    render(<AppNavigation />, {
      userToken: generateRandomString({ length: 24, charset: "alphanumeric" }),
      isLoading: false,
    });
    // wait for the state changes
    const login = await screen.findByRole("button", { name: /sign in/i });
    // expect to see the page
    expect(login).toBeTruthy();
  });
  it("redirects from dashboard to login when not authenticated", async () => {
    // render with redux
    render(<AppNavigation />, {
      isLoading: false,
      route: "/dashboard",
    });
    // wait for the state changes
    const login = await screen.findByRole("button", { name: /sign in/i });
    // expect to see the page
    expect(login).toBeTruthy();
  });
  it("displays dashboard when authenticated", async () => {
    // with feature added this will make an api request, mock axios here
    axiosMock()
      .onGet(/user/)
      .reply("200", { full_name: "Skyla Bowsta", email: "sb@tatooine.io" });
    const authToken = generateRandomString({
      length: 24,
      charset: "alphanumeric",
    });
    await AsyncStorage.setItem(AUTH_TOKEN_NAME, authToken);
    // render with redux
    render(<AppNavigation />, {
      isLoading: false,
      route: "/dashboard",
    });
    // wait for the state changes
    const login = await screen.findByRole("button", { name: /sign in/i });
    // expect to see the login page
    expect(login).toBeTruthy();
    // wait for the state changes
    const welcome = await screen.getByText("Welcome to the Gryphon Dashboard");
    // expect to see the dash page
    expect(welcome).toBeTruthy();
  });
  it("shows user data for logged in user", async () => {
    // mock login successfuly api response
    const response = {
      full_name: "Skyla Bowsta",
      email: "sb@tatooine.io",
    };
    axiosMock().onGet(/user/).reply("200", response);

    const authToken = generateRandomString({
      length: 24,
      charset: "alphanumeric",
    });
    await AsyncStorage.setItem(AUTH_TOKEN_NAME, authToken);
    // render with redux
    render(<AppNavigation />, {
      isLoading: false,
      route: "/dashboard",
    });
    // wait for the state changes
    const login = await screen.findByRole("button", { name: /sign in/i });
    // expect to see the login page
    expect(login).toBeTruthy();
    // verify user data is present
    const userInfo = await screen.getByTestId("userinfo");
    expect(userInfo).toBeTruthy();
  });
  it("logs the user out", async () => {
    // render with redux
    render(<AppNavigation />, {
      userToken: generateRandomString({ length: 24, charset: "alphanumeric" }),
      isLoading: false,
    });
    // wait for the state changes
    const link = await screen.findByRole("link", { name: /logout/i });
    expect(link).toBeTruthy();
    // click on logout
    fireEvent.click(link);
    await wait(async () =>
      expect(
        screen.getByRole("heading", { level: 1, name: "Sign In" })
      ).toBeTruthy()
    );
  });
});
