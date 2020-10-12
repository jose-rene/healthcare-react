export const FETCH_USER = "fetch_user";
export const CLEAR_USER = "clear_user";

export const setUser = (email, full_name) => (dispatch) => {
  dispatch({ type: FETCH_USER, email, full_name });
};
