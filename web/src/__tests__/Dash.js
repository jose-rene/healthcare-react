import "@testing-library/jest-dom";
import React from "react";
import { generate as generateRandomString } from "randomstring";
import { render, screen } from "../testUtils";
import Dash from "../pages/Dash";

describe("Dashboard Page", () => {
  it("can render with redux state defaults", async () => {
    // render with redux
    render(<Dash />, {
      userToken: generateRandomString({ length: 24, charset: "alphanumeric" }),
      isLoading: false,
    });
    // wait for the state changes
    const welcome = await screen.getByText("Welcome to the Gryphon Dashboard");
    // expect to see the page
    expect(welcome).toBeTruthy();
  });
});
