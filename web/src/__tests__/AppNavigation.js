import "@testing-library/jest-dom";
import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { generate as generateRandomString } from "randomstring";
import { render, screen } from "../testUtils";
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
    const login = await screen.findByRole("button", { name: /login/i });
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
    const login = await screen.findByRole("button", { name: /login/i });
    // expect to see the page
    expect(login).toBeTruthy();
  });
  it("displays dashboard when authenticated", async () => {
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
    const login = await screen.findByRole("button", { name: /login/i });
    // expect to see the login page
    expect(login).toBeTruthy();
    // wait for the state changes
    const welcome = await screen.getByText("Welcome to the Gryphon Dashboard");
    // expect to see the dash page
    expect(welcome).toBeTruthy();
  });
});
