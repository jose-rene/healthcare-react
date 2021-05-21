import AsyncStorage from "@react-native-community/async-storage";
import "@testing-library/jest-dom";
import { generate as generateRandomString } from "randomstring";
import React from "react";
import { AUTH_TOKEN_NAME } from "../config/URLs";
import Account from "../pages/Account/Account";
import {
    axiosMock,
    profileResponse,
    renderWithRouter,
    screen,
} from "../testUtils";
import { notificationResponse } from "./AlertList";

describe("My Account Page", () => {
    const authToken = generateRandomString({
        length: 24,
        charset: "alphanumeric",
    });
    it("can render with redux state defaults", async () => {
        await AsyncStorage.setItem(AUTH_TOKEN_NAME, authToken);
        axiosMock()
            .onGet(/profile/)
            .reply(200, profileResponse)
            .onGet(/inspire/)
            .reply(200, {
                message: "Fly a kite in a thunderstorm. - Benjamin Franklin",
            })
            .onGet(/notifications/)
            .reply(200, notificationResponse);
        // render with redux
        renderWithRouter(<Account />, {
            user: {
                initializing: true,
                primaryRole: false,
            },
        });
        // wait for the state changes
        const account = await screen.getByRole("heading", {
            level: 1,
            name: "Your Account",
        });
        // expect to see the page
        expect(account).toBeTruthy();
    });
    it("links to main dashboard", async () => {
        await AsyncStorage.setItem(AUTH_TOKEN_NAME, authToken);
        axiosMock()
            .onGet(/profile/)
            .reply(200, profileResponse)
            .onGet(/inspire/)
            .reply(200, {
                message: "Fly a kite in a thunderstorm. - Benjamin Franklin",
            });
        // render with redux
        renderWithRouter(<Account />, {
            user: {
                initializing: true,
                primaryRole: false,
            },
        });
        // wait for the state changes
        const link = await screen.findByRole("link", { name: /home/i });
        expect(link).toBeTruthy();
        // expect link attribute
        expect(link).toHaveAttribute("href", "/dashboard");
    });
});
