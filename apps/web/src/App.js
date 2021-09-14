import React from "react";
import { UserProvider } from "Context/UserContext";
import AppNavigation from "./navigation/AppNavigation";
import Flash from "./components/flash/Flash";

function App() {
    return (
        <UserProvider>
            <AppNavigation />
            <Flash />
        </UserProvider>
    );
}

export default App;
