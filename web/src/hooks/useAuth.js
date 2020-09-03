import { useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import httpService from "../services/httpService";
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
      let response = null;
      try {
        response = await httpService("login", {
          params: { email, password },
          method: POST,
        });
      } catch (err) {
        setAuthed((prevState) => ({
          ...prevState,
          tokenLoading: false,
          authToken: null,
          error: err,
        }));
      }

      if (response) {
        await AsyncStorage.setItem(AUTH_TOKEN_NAME, response.data.access_token);
        await AsyncStorage.setItem(
          "@dme.login.token_type",
          response.data.token_type
        );
        await AsyncStorage.setItem(
          "@dme.login.expires_at",
          response.data.expires_at
        );
        // update state
        setAuthed((prevState) => ({
          ...prevState,
          tokenLoading: false,
          authToken: response.data.access_token,
          loading: false,
          error: "",
        }));
      }
    };
    doAuth().then();
  };

  const doLogout = async () => {
    // const logoutProcess = async () => {
    await AsyncStorage.removeItem("@dme.login.access_token");
    await AsyncStorage.removeItem("@dme.login.token_type");
    await AsyncStorage.removeItem("@dme.login.expires_at");

    setAuthed((prevState) => ({
      ...prevState,
      tokenLoading: false,
      authToken: null,
    }));
    // };
    // logoutProcess().then();
  };

  const loadAuth = () => {
    const load = async () => {
      let result = null;
      try {
        result = await AsyncStorage.getItem("@dme.login.access_token");
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
