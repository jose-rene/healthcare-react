import "@testing-library/jest-dom";
import React from "react";
import { generate as generateRandomString } from "randomstring";
import { renderWithRouter, screen, fireEvent, wait } from "../testUtils";
import Dash from "../pages/Dash";

describe("Dashboard Page", () => {
  it("can render with redux state defaults", async () => {
    // render with redux
    renderWithRouter(<Dash />, {
      userToken: generateRandomString({ length: 24, charset: "alphanumeric" }),
      isLoading: false,
    });
    // wait for the state changes
    const welcome = await screen.getByText(/hello dashboard/i);
    // expect to see the page
    expect(welcome).toBeTruthy();
  });
  it("links to account page", async () => {
    // render with redux
    renderWithRouter(<Dash />, {
      userToken: generateRandomString({ length: 24, charset: "alphanumeric" }),
      isLoading: false,
    });
    // wait for the state changes
    const link = await screen.findByRole("link", { name: /account/i });
    expect(link).toBeTruthy();
    // expect link attribute
    expect(link).toHaveAttribute("href", "/account");
  });
});
