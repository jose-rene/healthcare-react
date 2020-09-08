import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { generate as generateRandomString } from "randomstring";
import moment from "moment";
import {
  render,
  renderWithRouter,
  fireEvent,
  screen,
  axiosMock,
  wait,
} from "../testUtils";
import { AUTH_TOKEN_NAME } from "../config/URLs";
import Login from "../pages/Login";

// @note using axios-mock-adapter instead of mocking axios, see ./testUtils.js
/* 
afterEach(() => {
  jest.resetAllMocks();
  mockAxios.reset();
});
*/

describe("Login Page", () => {
  // parameters used in test
  const username = "admin@admin.com";
  const password = generateRandomString(8);

  it("can render with redux state defaults", async () => {
    // render with redux
    render(<Login />, {
      userToken: null,
      isLoading: true,
    });
    // wait for the state changes
    await screen.findByRole("button", { name: /login/i });
    // expect to see the page
    expect(screen.getByText("Web App Login")).toBeTruthy();
  });
  it("renders form elements correctly", async () => {
    // render with redux
    render(<Login />, {
      userToken: null,
      isLoading: true,
    });
    // wait for the state changes
    const button = await screen.findByRole("button", { name: /login/i });
    expect(button).toBeTruthy();
    const usernameInput = await screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    fireEvent.change(usernameInput, { target: { value: username } });
    expect(usernameInput.value).toBe(username);
    fireEvent.change(passwordInput, { target: { value: password } });
    expect(passwordInput.value).toBe(password);
  });
  it("validates email address", async () => {
    // invalid user email
    const user = generateRandomString(6);
    // render with redux
    render(<Login />, {
      userToken: null,
      isLoading: true,
    });
    // wait for the state changes
    const button = await screen.findByRole("button", { name: /login/i });
    const usernameInput = screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    fireEvent.change(usernameInput, { target: { value: user } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.click(button);
    await wait(() =>
      expect(screen.getByText(/enter a valid email address/i)).toBeTruthy()
    );
  });
  it("validates password min characters", async () => {
    // invalid password
    const pass = generateRandomString(6);
    // render with redux
    render(<Login />, {
      userToken: null,
      isLoading: true,
    });
    // wait for the state changes
    const button = await screen.findByRole("button", { name: /login/i });
    const usernameInput = screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    fireEvent.change(usernameInput, { target: { value: username } });
    fireEvent.change(passwordInput, { target: { value: pass } });
    fireEvent.click(button);
    await wait(() =>
      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeTruthy()
    );
  });
  it("shows error on login failure", async () => {
    // mock login failure api response
    axiosMock().onPost(/login/).reply("401", { message: "Unauthorized" });
    // render with redux and router
    renderWithRouter(<Login />, {
      userToken: null,
      isLoading: true,
    });
    // wait for the state changes
    const button = await screen.findByRole("button", { name: /login/i });
    const usernameInput = screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    // enter data and submit form
    fireEvent.change(usernameInput, { target: { value: username } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.click(button);
    // wait for mocked redirect
    await wait(() => expect(screen.getByText(/error/i)).toBeTruthy());
  });
  it("logs user in", async () => {
    // mock login successfuly api response
    const response = {
      access_token: generateRandomString({
        length: 80,
        charset: "alphanumeric",
      }),
      token_type: "Bearer",
      expires_at: moment().add(7, "minutes").format("YYYY-MM-DD hh:mm:ss"),
    };
    axiosMock().onPost(/login/).reply("200", response);
    // render with redux and router
    renderWithRouter(<Login />, {
      userToken: null,
      isLoading: true,
    });
    // wait for the state changes
    const button = await screen.findByRole("button", { name: /login/i });
    const usernameInput = screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    // enter data and submit form
    fireEvent.change(usernameInput, { target: { value: username } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.click(button);
    // wait for mocked redirect
    await wait(() => expect(screen.getByText("Dashboard Stub")).toBeTruthy());
  });
  it("redirects authenticated user to dashboard", async () => {
    // set auth token
    await AsyncStorage.setItem(
      AUTH_TOKEN_NAME,
      generateRandomString({
        length: 80,
        charset: "alphanumeric",
      })
    );
    // render with redux and router
    renderWithRouter(<Login />, {
      userToken: null,
      isLoading: true,
    });
    // wait for the state changes
    const button = await screen.findByRole("button", { name: /login/i });
    expect(button).toBeTruthy();
    // wait for mocked redirect
    await wait(() => expect(screen.getByText("Dashboard Stub")).toBeTruthy());
  });
});
