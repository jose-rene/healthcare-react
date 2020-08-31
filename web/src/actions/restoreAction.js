import { RESET_TOKEN, SET_TOKEN } from "./types";
import { CLEAR_USER } from "./userAction";

export const restoreToken = (userToken) => (dispatch) => {
  dispatch({ type: SET_TOKEN, token: userToken });
};

export const signOut = () => (dispatch) => {
  dispatch({ type: RESET_TOKEN });
  dispatch({ type: CLEAR_USER });
};
