export const SAVE_FORM = "save_form";
export const UPLOAD_FORM = "upload_form";

export const setUser = (data) => (dispatch) => {
  dispatch({ type: SAVE_FORM, payload: data });
};
