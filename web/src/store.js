import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

/* eslint-disable no-underscore-dangle */
const enhancer = [
  applyMiddleware(thunk),
  ...(window.__REDUX_DEVTOOLS_EXTENSION__
    ? [window.__REDUX_DEVTOOLS_EXTENSION__()]
    : []),
];
/* eslint-enable no-underscore-dangle */

export default createStore(rootReducer, compose(...enhancer));
