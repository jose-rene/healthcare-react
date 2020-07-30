import AsyncStorage from "@react-native-community/async-storage";
import {API_URL, GET} from '../Config/URLs'
import axios from 'axios';

export default class {
    async submitRequestWithPromise(method, url, params = {}, headers = {}) {
        const config = {
            url,
            baseURL: API_URL,
            method,
            headers: {
                ...{
                    // 'x-api-key': 'KEY_HERE',
                    "content-type": 'application/json',
                },
                // Merge headers passed in with the presets
                ...headers
            },

            // cancelToken,

            [method == GET ? 'params' : 'data']: params,
        };

        const {access_token} = await this.accessToken() || undefined;
        if (access_token) {
            config.headers['Authorization'] = `Bearer ${access_token}`;
        }

        return axios
            .request(config)
            .then(({data}) => data);
    }

    async accessToken() {
        return {
            access_token: await AsyncStorage.getItem('@dme.login.access_token'),
        }
    }
}
