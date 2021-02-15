import React from "react";
import { generate as generateRandomString } from "randomstring";
import moment from "moment";
import routeData from "react-router";
import {
    renderWithRouter,
    screen,
    axiosMock,
    profileResponse,
    wait,
} from "../testUtils";
import Federated from "../pages/Federated";

// redux
const initialReduxState = {
    user: {
        initializing: true,
        primaryRole: false,
    },
};
// mock url
const expires = moment().add(5, "minutes");
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
            expires_at: moment()
                .add(7, "minutes")
                .format("YYYY-MM-DD hh:mm:ss"),
        };
        axiosMock()
            .onGet()
            .replyOnce("200", response)
            .onGet(/profile/)
            .reply("200", profileResponse);

        // render with redux and router
        renderWithRouter(<Federated />, {
            initialReduxState,
        });
        //
        expect(screen.getByTestId("ssoLoading")).toBeTruthy();
        // wait for mocked redirect
        await wait(() =>
            expect(screen.getByText("Dashboard Stub")).toBeTruthy()
        );
    });
});
