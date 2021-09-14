import React, { useContext, useReducer } from "react";
import AsyncStorage from "@react-native-community/async-storage";

const UserContext = React.createContext();

function userReducer(state, action) {
    switch (action.type) {
        case "initialize": {
            const primaryRole = action.payload.primary_role ?? "peon";
            return {
                ...state,
                ...action.payload,
                ...{
                    primaryRole,
                    authed: !!action.payload.email,
                    initializing: false,
                },
            };
        }

        case "setuser": {
            return { ...action.payload };
        }

        case "update": {
            return { ...state, ...action.payload };
        }

        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

const initialSearch = {
    request_status_id: 0,
    from_date: null,
    to_date: null,
    date_range: null,
    member_id: "",
    auth_number: "",
};

const initialState = {
    initializing: true,
    authed: false,
    email: "",
    full_name: "",
    roles: [],
    abilities: [],
    primaryRole: undefined,
    search: initialSearch,
};

function UserProvider({ children }) {
    const [state, dispatch] = useReducer(userReducer, initialState);

    // const value = React.useMemo(() => [state, dispatch], [state]);

    // wrap the dispatches, don't make the code monkies have to think in terms of reducers
    const initUser = (userData) => {
        dispatch({ type: "initialize", payload: userData });
    };

    const getUser = () => {
        return state;
    };

    const isAuthed = () => {
        return state.authed;
    };

    const updateAvatarUrl = (avatar_url) => {
        dispatch({
            type: "update",
            payload: { avatar_url },
        });
    };

    const setSearch = (search) => {
        dispatch({
            type: "update",
            payload: { search },
        });
    };

    const logout = async () => {
        await AsyncStorage.clear();
        dispatch({
            type: "setuser",
            payload: { ...initialState, ...{ initializing: false } },
        });
    };

    return (
        <UserContext.Provider
            value={{
                initUser,
                getUser,
                isAuthed,
                logout,
                updateAvatarUrl,
                setSearch,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

function useUser() {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }

    return context;
}

export { UserProvider, useUser };
