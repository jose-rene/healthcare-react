import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export default () => {
    const [authed, setAuthed] = useState(false);

    const doLogout = () => {
        const logoutProcess = async () => {
            await AsyncStorage.removeItem('@dme.login.access_token');
            await AsyncStorage.removeItem('@dme.login.token_type');
            await AsyncStorage.removeItem('@dme.login.expires_at');

            setAuthed(false);
        }

        logoutProcess().then();
    };

    const setAuth = (access_token, token_type, expires_at) => {
        const setAuthProcess = async () => {
            await AsyncStorage.setItem('@dme.login.access_token', access_token);
            await AsyncStorage.setItem('@dme.login.token_type', token_type);
            await AsyncStorage.setItem('@dme.login.expires_at', expires_at);

            setAuthed(true);
        }

        setAuthProcess().then();
    }

    useEffect(() => {
        const load = async () => {
            const result = await AsyncStorage.getItem('@dme.login.access_token');

            setAuthed(!!result);
        };

        load().then();
    });

    return [{authed}, {setAuth, doLogout}];
}
