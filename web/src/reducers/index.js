import { combineReducers } from "redux";
import formReducer from "./formReducer";
import authReducer from "./restoreTokenReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  form: formReducer,
});

export default rootReducer;
