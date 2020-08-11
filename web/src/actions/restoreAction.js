import { RESET_TOKEN, SET_TOKEN } from "./types";

export const restoreToken = (userToken) => (dispatch) => {
  dispatch({ type: SET_TOKEN, token: userToken });
};

export const signOut = () => (dispatch) => {
  dispatch({ type: RESET_TOKEN });
};
