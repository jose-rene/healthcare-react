import AsyncStorage from "@react-native-community/async-storage";
import "@testing-library/jest-dom";
import { generate as generateRandomString } from "randomstring";
import React from "react";
import { AUTH_TOKEN_NAME } from "../config/URLs";
import Dash from "../pages/Home";
import {
    axiosMock,
    profileResponse,
    renderWithRouter,
    screen,
} from "../testUtils";
import { notificationResponse } from "./AlertList";
import "../fontawesome";
import { GlobalProvider } from "../Context/GlobalContext";

describe("Dashboard Page", () => {
    it("can render and links to account page", async () => {
        const axiosMocks = axiosMock()
            .onGet(/profile/)
            .reply(200, profileResponse)
            .onGet(/inspire/)
            .reply(200, {
                message: "Fly a kite in a thunderstorm. - Benjamin Franklin",
            })
            .onGet(/summary/)
            .reply(200, {
                new: 33,
                in_progress: 12,
                scheduled: 20,
                submitted: 22,
            })
            .onGet(/notifications/)
            .reply(200, notificationResponse);

        const authToken = generateRandomString({
            length: 24,
            charset: "alphanumeric",
        });
        await AsyncStorage.setItem(AUTH_TOKEN_NAME, authToken);
        // render with redux
        renderWithRouter(
            <GlobalProvider>
                <Dash />
            </GlobalProvider>,
            {
                userToken: generateRandomString({
                    length: 24,
                    charset: "alphanumeric",
                }),
                isLoading: false,
            }
        );
    });
});
