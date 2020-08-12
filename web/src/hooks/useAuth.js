import { useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";

const useAuth = () => {
  const [authState, setAuthed] = useState({
    authed: false,
    isLoading: true,
    token: null,
  });

  const doLogout = () => {
    const logoutProcess = async () => {
      await AsyncStorage.removeItem("@dme.login.access_token");
      await AsyncStorage.removeItem("@dme.login.token_type");
      await AsyncStorage.removeItem("@dme.login.expires_at");

      setAuthed((prevState) => ({
        ...prevState,
        authed: false,
        isLoading: false,
        token: null,
      }));
    };

    logoutProcess().then();
  };

  const setAuth = async (access_token, token_type, expires_at) => {
    await AsyncStorage.setItem("@dme.login.access_token", access_token);
    await AsyncStorage.setItem("@dme.login.token_type", token_type);
    await AsyncStorage.setItem("@dme.login.expires_at", expires_at);

    setAuthed((prevState) => ({
      ...prevState,
      authed: true,
      isLoading: false,
      token: access_token,
    }));
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
        authed: true,
        isLoading: false,
        token: result || null,
      }));
    };

    load().then();
  };

  return [authState, { loadAuth, setAuth, doLogout }];
};

export default useAuth;
