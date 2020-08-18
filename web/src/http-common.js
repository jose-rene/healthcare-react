import axios from 'axios';
import { API_URL, GET } from 'config/URLs';
import AsyncStorage from "@react-native-community/async-storage";

export const my_axios = async ( url, { headers = {}, params = {}, method = GET } = {} ) => {
    const config = {
        url,
        baseURL: API_URL,

        // TODO ::  this should be config
        timeout: 10000,

        headers: {
            "content-type": 'application/json',
            // TODO ::  this should be config
            ClientId: '3',
            ClientSecret: 'mMDlVuukFXAQsOXgXhV6z1PyqmG2M0XA9BONLIWg',
            ...headers,
        },

        method,

        [method == GET ? 'params' : 'data']: params,
    };

    const auth_token = await AsyncStorage.getItem('@whosat.login.access_token');
    // if auth then set the token
    if (auth_token) {
        config.headers['Authorization'] = `Bearer ${auth_token}`;
    }

    return axios(config)
        .then(( { data = {} } ) => data);
}
