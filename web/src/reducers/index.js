import { combineReducers } from "redux";
import authReducer from "./restoreTokenReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
});

export default rootReducer;
