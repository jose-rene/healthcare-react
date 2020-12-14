import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { generate as generateRandomString } from "randomstring";
import moment from "moment";
import routeData from "react-router";
import {
    render,
    renderWithRouter,
    fireEvent,
    screen,
    axiosMock,
    wait,
} from "../testUtils";
import { AUTH_TOKEN_NAME } from "../config/URLs";
import Federated from "../pages/Federated";

// mock url
const expires = moment().add(5, "minutes");
const signature = generateRandomString(32);
// mock useLocation
const mockLocation = {
    pathname: "/sso",
    hash: "",
    search: `path=/ssolgin&expires=${expires}&signature=${signature}`,
    state: "",
};
beforeEach(() => {
    jest.spyOn(routeData, "useLocation").mockReturnValue(mockLocation);
});

// @note using axios-mock-adapter instead of mocking axios, see ./testUtils.js
/* 
afterEach(() => {
  jest.resetAllMocks();
  mockAxios.reset();
});
*/

describe("SSO Login Page", () => {
    it("can render with redux state defaults", async () => {
        // render with redux
        renderWithRouter(<Federated />, {
            userToken: null,
            isLoading: true,
        });

        expect(screen.getByTestId("ssoLoading")).toBeTruthy();
    });
    it("logs user in", async () => {
        // mock ssologin successfull api response
        const response = {
            access_token: generateRandomString({
                length: 80,
                charset: "alphanumeric",
            }),
            token_type: "Bearer",
            expires_at: moment()
                .add(7, "minutes")
                .format("YYYY-MM-DD hh:mm:ss"),
        };
        axiosMock().onGet().reply("200", response);
        // render with redux and router
        renderWithRouter(<Federated />, {
            userToken: null,
            isLoading: true,
        });

        // wait for mocked redirect
        await wait(() =>
            expect(screen.getByText("Dashboard Stub")).toBeTruthy()
        );
    });
});
