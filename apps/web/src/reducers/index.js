import { combineReducers } from "redux";
import formReducer from "./formReducer";
import authReducer from "./restoreTokenReducer";
import userReducer from "./userReducer";
import searchReducer from "./restoreSearchReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    form: formReducer,
    search: searchReducer,
});

export default rootReducer;
