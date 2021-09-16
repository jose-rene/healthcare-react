import dayjs from "dayjs";
import { generate as generateRandomString } from "randomstring";
import React from "react";
import routeData from "react-router";
import Federated from "../pages/Federated";
import {
    axiosMock,
    profileResponse,
    renderWithRouter,
    screen,
} from "../testUtils";

// redux
const initialReduxState = {
    user: {
        initializing: true,
        primaryRole: false,
    },
};
// mock url
const expires = dayjs().add(5, "minute");
const signature = generateRandomString(32);
// mock useLocation
const mockLocation = {
    pathname: "/sso",
    hash: "",
    search: `path=/ssologin&expires=${expires}&signature=${signature}`,
    state: "",
};
beforeEach(() => {
    jest.spyOn(routeData, "useLocation").mockReturnValue(mockLocation);
});
afterEach(() => {
    axiosMock().reset();
});

describe("SSO Login Page", () => {
    it("renders loading and logs user in", async () => {
        // mock ssologin successfull api response
        const response = {
            access_token: generateRandomString({
                length: 80,
                charset: "alphanumeric",
            }),
            token_type: "Bearer",
            expires_at: dayjs().add(7, "minute").format("YYYY-MM-DD hh:mm:ss"),
        };
        axiosMock()
            .onGet()
            .replyOnce(200, response)
            .onGet(/profile/)
            .reply(200, profileResponse);

        // render with redux and router
        renderWithRouter(<Federated />, {
            initialReduxState,
        });
        //
        expect(screen.getByTestId("ssoLoading")).toBeTruthy();
        // wait for mocked redirect
        /* await wait(() =>
            expect(screen.getByText("Dashboard Stub")).toBeTruthy()
        ); */
    });
});
