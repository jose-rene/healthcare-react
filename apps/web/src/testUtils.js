// test-utils.js
import React from "react";
import { Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render as rtlRender } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { UserProvider } from "./Context/UserContext";

/**
 * render
 *
 * custom render with redux function
 * */
function render(
    ui,
    {
        // initialState,
        // store = createStore(rootReducer, initialState, applyMiddleware(thunk)),
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        // return <Provider store={store}>{children}</Provider>;
        return <UserProvider>{children}</UserProvider>;
    }
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

function renderWithRouter(
    ui,
    {
        route = "/",
        history = createMemoryHistory({ initialEntries: [route] }),
        // initialState,
        // store = createStore(rootReducer, initialState, applyMiddleware(thunk)),
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return (
            <UserProvider>
                <Router history={history}>
                    <Route path="/">{children}</Route>
                    <Route
                        path="/access-denied"
                        render={() => <div>Denied Stub</div>}
                        exact
                    />
                    <Route
                        path="/dashboard"
                        render={() => <div>Dashboard Stub</div>}
                    />
                </Router>
            </UserProvider>
        );
    }
    return {
        ...rtlRender(ui, { wrapper: Wrapper, history, ...renderOptions }),
        history,
    };
}

const axiosMock = () => {
    return new MockAdapter(axios);
};

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

// re-export everything
export * from "@testing-library/react";
// override render method, pass function to mock axios
export { render, renderWithRouter, axiosMock, profileResponse };
