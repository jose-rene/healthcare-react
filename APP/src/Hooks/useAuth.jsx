import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export default () => {
  const [authState, setAuthed] = useState({
    authed: false,
    isLoading: true,
    token: null,
  });

  const doLogout = () => {
    const logoutProcess = async () => {
      await AsyncStorage.removeItem('@dme.login.access_token');
      await AsyncStorage.removeItem('@dme.login.token_type');
      await AsyncStorage.removeItem('@dme.login.expires_at');

      setAuthed((prevState) => ({
        ...prevState,
        authed: false,
        isLoading: false,
        token: null,
      }));
    };

    logoutProcess().then();
  };

  const setAuth = (access_token, token_type, expires_at) => {
    const setAuthProcess = async () => {
      await AsyncStorage.setItem('@dme.login.access_token', access_token);
      await AsyncStorage.setItem('@dme.login.token_type', token_type);
      await AsyncStorage.setItem('@dme.login.expires_at', expires_at);

      setAuthed((prevState) => ({
        ...prevState,
        authed: true,
        isLoading: false,
        token: access_token,
      }));
    };

    setAuthProcess().then();
  };

  const loadAuth = () => {
    const load = async () => {
      let result = null;
      try {
        result = await AsyncStorage.getItem('@dme.login.access_token');
      } catch (error) {
        result = null;
      }
      setAuthed((prevState) => ({
        ...prevState,
        authed: !!result,
        isLoading: false,
        token: result ? result : null,
      }));
    };

    load().then();
  };

  return [authState, { loadAuth, setAuth, doLogout }];
};
