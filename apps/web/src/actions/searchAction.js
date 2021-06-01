import { SET_SEARCH } from "./types";

export const setSearch = (data) => (dispatch) => {
    dispatch({ type: SET_SEARCH, payload: data });
};
