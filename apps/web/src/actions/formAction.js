import { SAVE_FORM, UPLOAD_FORM } from "./types";

export const setUser = (data) => (dispatch) => {
    dispatch({ type: SAVE_FORM, payload: data });
};
