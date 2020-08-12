import { combineReducers } from "redux";
import restoreTokenReducer from "./restoreTokenReducer";

const rootReducer = combineReducers({
  auth: restoreTokenReducer,
});

export default rootReducer;
