import React from "react";
import ReactDOM from "react-dom";
import "./styles/bootstrap-custom.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { GlobalProvider } from "./Context/GlobalContext";
import './fontawesome';

ReactDOM.render(
    <React.StrictMode>
        <GlobalProvider>
            <App />
        </GlobalProvider>
    </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
