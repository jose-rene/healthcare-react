import { SET_SEARCH } from "../actions/types";

const initialState = {
    request_status_id: 0,
    from_date: null,
    to_date: null,
    date_range: null,
    member_id: "",
    auth_number: "",
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_SEARCH:
            return {
                ...state,
                ...action.payload,
            };

        default:
            return { ...state };
    }
}
