import { get } from "lodash";
import {
    CLEAR_USER,
    FETCH_USER,
    INITIALIZE_USER,
    UPDATE_AVATAR_URL,
} from "../actions/types";

const initialState = {
    initializing: true,
    authed: false,
    email: "",
    full_name: "",
    roles: [],
    abilities: [],
    primaryRole: undefined,
};

export default function (state = initialState, action) {
    const { user = {} } = action.payload || {};

    switch (action.type) {
        case INITIALIZE_USER:
            const { primary_role = false, ...userProps } = user;
            const primaryRole = primary_role || get(user, "roles.0", false);

            return {
                ...state,
                initializing: false,
                ...userProps,
                authed: !!user.email,
                primaryRole,
            };
        case FETCH_USER:
            return {
                ...state,
                email: action.email,
                full_name: action.full_name,
                roles: action.roles || [],
                abilities: action.abilities || [],
            };

        case UPDATE_AVATAR_URL:
            return {
                ...state,
                avatar_url: action.avatar_url,
            };

        case CLEAR_USER:
            return { ...initialState };

        default:
            return { ...state };
    }
}
