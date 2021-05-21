export const FETCH_USER = "fetch_user";
export const CLEAR_USER = "clear_user";
export const INITIALIZE_USER = "initialize_user";
export const UPDATE_AVATAR_URL = "update_avatar_url";

export const DOCTOR = "doctor";
export const ADMIN = "admin";

export const initializeUser = (user = {}) => async (dispatch) => {
    await dispatch({ type: INITIALIZE_USER, payload: { user } });
};

export const setUser = (email, full_name, roles = []) => (dispatch) => {
    dispatch({ type: FETCH_USER, email, full_name, roles });
};

export const updateAvartarUrl = (avatar_url) => (dispatch) => {
    dispatch({ type: UPDATE_AVATAR_URL, avatar_url });
};
