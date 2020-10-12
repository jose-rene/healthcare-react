import AsyncStorage from "@react-native-community/async-storage";
import { RESET_TOKEN, SET_TOKEN } from "./types";
import { CLEAR_USER } from "./userAction";
import { AUTH_TOKEN_NAME } from "../config/URLs";

const logout = async () => {
  await AsyncStorage.removeItem(AUTH_TOKEN_NAME);
  await AsyncStorage.removeItem("@dme.login.token_type");
  await AsyncStorage.removeItem("@dme.login.expires_at");
};

export const restoreToken = (userToken) => (dispatch) => {
  dispatch({ type: SET_TOKEN, token: userToken });
};

export const signOut = () => (dispatch) => {
  logout();
  dispatch({ type: RESET_TOKEN });
  dispatch({ type: CLEAR_USER });
};
