import "@testing-library/jest-dom";
import React from "react";
import { generate as generateRandomString } from "randomstring";
import AsyncStorage from "@react-native-community/async-storage";
import {
    renderWithRouter,
    screen,
    axiosMock,
    profileResponse,
} from "../testUtils";
import Dash from "../pages/Home";
import { AUTH_TOKEN_NAME } from "../config/URLs";

describe("Dashboard Page", () => {
    it("can render and links to account page", async () => {
        axiosMock()
            .onGet(/profile/)
            .reply("200", profileResponse)
            .onGet(/inspire/)
            .reply("200", {
                message: "Fly a kite in a thunderstorm. - Benjamin Franklin",
            })
            .onGet(/summary/)
            .reply("200", {
                new: 33,
                in_progress: 12,
                scheduled: 20,
                submitted: 22,
            });

        const authToken = generateRandomString({
            length: 24,
            charset: "alphanumeric",
        });
        await AsyncStorage.setItem(AUTH_TOKEN_NAME, authToken);
        // render with redux
        renderWithRouter(<Dash />, {
            userToken: generateRandomString({
                length: 24,
                charset: "alphanumeric",
            }),
            isLoading: false,
        });
        // wait for the state changes
        const link = await screen.findByRole("link", { name: /account/i });
        expect(link).toBeTruthy();
        // expect link attribute
        expect(link).toHaveAttribute("href", "/account");
    });
});
