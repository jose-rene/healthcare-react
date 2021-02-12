// test-utils.js
import React from "react";
import { Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render as rtlRender } from "@testing-library/react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import rootReducer from "./reducers/index";

/**
 * render
 *
 * custom render with redux function
 * */
function render(
    ui,
    {
        initialState,
        store = createStore(rootReducer, initialState, applyMiddleware(thunk)),
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return <Provider store={store}>{children}</Provider>;
    }
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

function renderWithRouter(
    ui,
    {
        route = "/",
        history = createMemoryHistory({ initialEntries: [route] }),
        initialState,
        store = createStore(rootReducer, initialState, applyMiddleware(thunk)),
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return (
            <Router history={history}>
                <Route path="/">
                    <Provider store={store}>{children}</Provider>
                </Route>
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

// re-export everything
export * from "@testing-library/react";
// override render method, pass function to mock axios
export { render, renderWithRouter, axiosMock };
