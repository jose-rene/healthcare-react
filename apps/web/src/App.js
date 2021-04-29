import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import AppNavigation from "./navigation/AppNavigation";
import Flash from "./components/flash/Flash";

function App() {
    return (
        <Provider store={store}>
            <AppNavigation />
            <Flash />
        </Provider>
    );
}

export default App;
