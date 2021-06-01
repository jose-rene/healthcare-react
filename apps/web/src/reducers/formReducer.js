import { SAVE_FORM, UPLOAD_FORM } from "../actions/types";

const initialState = {
    data: {},
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SAVE_FORM:
            return { ...state, data: action.payload };

        case UPLOAD_FORM:
            return { ...state, ...initialState };

        default:
            return { ...state };
    }
}
