import "@testing-library/jest-dom";
import React from "react";
import { generate as generateRandomString } from "randomstring";
import { renderWithRouter, screen, fireEvent } from "../testUtils";
import Account from "../pages/Account";

describe("My Account Page", () => {
  it("can render with redux state defaults", async () => {
    // render with redux
    renderWithRouter(<Account />, {
      userToken: generateRandomString({ length: 24, charset: "alphanumeric" }),
      isLoading: false,
    });
    // wait for the state changes
    const account = await screen.getByText(/my account/i);
    // expect to see the page
    expect(account).toBeTruthy();
  });
  it("links to main dashboard", async () => {
    // render with redux
    renderWithRouter(<Account />, {
      userToken: generateRandomString({ length: 24, charset: "alphanumeric" }),
      isLoading: false,
    });
    // wait for the state changes
    const link = await screen.findByRole("link", { name: /dashboard/i });
    expect(link).toBeTruthy();
    // expect link attribute
    expect(link).toHaveAttribute("href", "/dashboard");
  });
});
