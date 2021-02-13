import "@testing-library/jest-dom";
import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { generate as generateRandomString } from "randomstring";
import { render, screen, axiosMock, fireEvent, wait } from "../testUtils";
import { AUTH_TOKEN_NAME } from "../config/URLs";
import AppNavigation from "../navigation/AppNavigation";

// mock the window location
const initialLocation = window.location;
delete window.location;

beforeEach(() => {
    window.location = {
        ...initialLocation,
        reload: jest.fn(),
        assign: jest.fn(),
    };
});
afterEach(() => {
    window.location = initialLocation;
    axiosMock().reset();
});

describe("App Navigation", () => {
    const profileResponse = {
        full_name: "Skyla Bowsta",
        first_name: "Skyla",
        middle_name: null,
        last_name: "Bowsta",
        email: "sb@tatooine.io",
        dob: "2001-02-10T00:00:00.000000Z",
        roles: [{ name: "admin", level: null, title: "Admin" }],
        primary_role: "admin",
    };

    it("renders login with redux state defaults", async () => {
        // render with redux
        render(<AppNavigation />, {
            userToken: generateRandomString({
                length: 24,
                charset: "alphanumeric",
            }),
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
    it("displays access denied when authenticated without role", async () => {
        // with feature added this will make an api request, mock axios here
        const profileResponseNoRole = {
            ...profileResponse,
            roles: [],
            primary_role: "",
        };
        axiosMock()
            .onGet(/profile/)
            .reply("200", profileResponseNoRole);
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
        await wait(() =>
            expect(window.location.assign).toHaveBeenCalledWith(
                "/access-denied"
            )
        );
    });
    it("displays dashboard when authenticated with role", async () => {
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
        // Let all your things have their places; let each part of your business have its time
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
        const dash = await screen.findByRole("button", { name: /search/i });
        // expect to see the dash page
        expect(dash).toBeTruthy();
        const userInfo = await screen.getByTestId("userinfo");
        expect(userInfo).toBeTruthy();
        // wait for the state changes
        // const welcome = await screen.getByRole("heading", {
        //    level: 1,
        //    name: "Welcome to your Portal",
        // });
        // expect to see the dash page
        // await wait(() => expect(welcome).toBeTruthy());
    });
    it("logs the user out", async () => {
        // render with redux
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
        render(<AppNavigation />, {
            isLoading: false,
            route: "/dashboard",
        });

        // wait for the state changes
        const dash = await screen.findByRole("button", { name: /search/i });
        // expect to see the dash page
        expect(dash).toBeTruthy();
        const link = await screen.findByRole("link", { name: /logout/i });
        expect(link).toBeTruthy();
        // click on logout
        fireEvent.click(link);
        await wait(async () =>
            expect(window.location.reload).toHaveBeenCalled()
        );
    });
});
