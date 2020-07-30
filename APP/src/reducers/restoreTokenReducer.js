import {RESET_TOKEN, SET_TOKEN} from '../actions/types';

const initialState = {
    userToken: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_TOKEN:
            return {
                userToken: action.token,
            };
        case RESET_TOKEN:
            return initialState;
        default:
            return state;
    }
}
