import { useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import apiService from "../services/apiService";
import { POST, AUTH_TOKEN_NAME } from "../config/URLs";

const useAuth = () => {
  const [authState, setAuthed] = useState({
    tokenLoading: true,
    authToken: null,
    loading: false,
    error: "",
  });

  const authUser = ({ email, password }) => {
    const doAuth = async () => {
      let data = null;
      try {
        data = await apiService("login", {
          params: { email, password },
          method: POST,
        });
      } catch (err) {
        setAuthed((prevState) => ({
          ...prevState,
          tokenLoading: false,
          authToken: null,
          loading: false,
          error: err,
        }));
      }

      if (data && "access_token" in data) {
        await AsyncStorage.setItem(AUTH_TOKEN_NAME, data.access_token);
        await AsyncStorage.setItem("@dme.login.token_type", data.token_type);
        await AsyncStorage.setItem("@dme.login.expires_at", data.expires_at);
        // update state
        setAuthed((prevState) => ({
          ...prevState,
          tokenLoading: false,
          authToken: data.access_token,
          loading: false,
          error: "",
        }));
      } else {
        setAuthed((prevState) => ({
          ...prevState,
          tokenLoading: false,
          authToken: null,
          loading: false,
        }));
      }
    };
    doAuth().then();
  };

  const doLogout = async () => {
    // const logoutProcess = async () => {
    await AsyncStorage.removeItem(AUTH_TOKEN_NAME);
    await AsyncStorage.removeItem("@dme.login.token_type");
    await AsyncStorage.removeItem("@dme.login.expires_at");

    setAuthed((prevState) => ({
      ...prevState,
      tokenLoading: false,
      authToken: null,
      loading: false,
    }));
    // };
    // logoutProcess().then();
  };

  const loadAuth = () => {
    const load = async () => {
      let result = null;
      try {
        result = await AsyncStorage.getItem(AUTH_TOKEN_NAME);
      } catch (error) {
        // @todo can add error to state if it is needed
        result = null;
      }
      setAuthed((prevState) => ({
        ...prevState,
        tokenLoading: false,
        authToken: result || null,
      }));
    };

    load().then();
  };

  return [authState, { loadAuth, authUser, doLogout }];
};

export default useAuth;
