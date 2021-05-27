import { FETCH_USER, INITIALIZE_USER, UPDATE_AVATAR_URL } from "./types";

export const initializeUser = (user = {}) => async (dispatch) => {
    await dispatch({ type: INITIALIZE_USER, payload: { user } });
};

export const setUser = (email, full_name, roles = []) => (dispatch) => {
    dispatch({ type: FETCH_USER, email, full_name, roles });
};

export const updateAvartarUrl = (avatar_url) => (dispatch) => {
    dispatch({ type: UPDATE_AVATAR_URL, avatar_url });
};
