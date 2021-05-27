import AsyncStorage from "@react-native-community/async-storage";
import { RESET_TOKEN, SET_TOKEN, CLEAR_USER } from "./types";

const logout = async () => {
    await AsyncStorage.clear();
};

export const restoreToken = (userToken) => (dispatch) => {
    dispatch({ type: SET_TOKEN, token: userToken });
};

export const signOut = () => async (dispatch) => {
    await logout();
    await dispatch({ type: RESET_TOKEN });
    await dispatch({ type: CLEAR_USER });
};
