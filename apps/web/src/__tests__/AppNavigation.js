import AsyncStorage from '@react-native-community/async-storage';
import '@testing-library/jest-dom';
import { generate as generateRandomString } from 'randomstring';
import React from 'react';
import { AUTH_TOKEN_NAME } from '../config/URLs';
import AppNavigation from '../navigation/AppNavigation';
import { axiosMock, fireEvent, profileResponse, render, screen, wait } from '../testUtils';
import { notificationResponse } from './AlertList';

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
        axiosMock().onGet(/profile/).reply(200, profileResponseNoRole);
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
        axiosMock().onGet(/profile/).reply(200, profileResponse).onGet(/inspire/).reply(200, {
            message: 'Fly a kite in a thunderstorm. - Benjamin Franklin',
        }).onGet(/summary/).reply(200, {
            new: 33,
            in_progress: 12,
            scheduled: 20,
            submitted: 22,
        }).onGet(/notifications/).reply(200, notificationResponse);

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
        axiosMock().onGet(/profile/).reply(200, profileResponse).onGet(/inspire/).reply(200, {
            message: 'Fly a kite in a thunderstorm. - Benjamin Franklin',
        }).onGet(/summary/).reply(200, {
            new: 33,
            in_progress: 12,
            scheduled: 20,
            submitted: 22,
        }).onGet(/notifications/).reply(200, notificationResponse);

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
