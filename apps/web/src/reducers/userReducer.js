import { CLEAR_USER, FETCH_USER, INITIALIZE_USER } from '../actions/userAction';

const initialState = {
    initializing: true,
    authed: false,
    email: '',
    full_name: '',
    roles: [],
};

export default function (state = initialState, action) {
    const { user = {} } = action.payload || {};

    switch (action.type) {
        case INITIALIZE_USER:
            return { ...state, initializing: false, ...user, authed: !!user.email };
        case FETCH_USER:
            return { ...state, email: action.email, full_name: action.full_name, roles: action.roles || [] };

        case CLEAR_USER:
            return { ...state, ...initialState };

        default:
            return { ...state };
    }
}
