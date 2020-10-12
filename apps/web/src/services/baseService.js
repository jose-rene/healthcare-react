import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import { API_URL, GET } from "../config/URLs";

export default class {
  async submitRequestWithPromise(method, url, params = {}, headers = {}) {
    const config = {
      url,
      baseURL: API_URL,
      method,
      headers: {
        ...{
          // 'x-api-key': 'KEY_HERE',
          "content-type": "application/json",
        },
        // Merge headers passed in with the presets
        ...headers,
      },

      // cancelToken,

      [GET === method ? "params" : "data"]: params,
    };

    const { token } = (await this.accessToken()) || undefined;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return axios
      .request(config)
      .then(({ data }) => data)
      .catch(({ error }) => error);
  }

  // eslint-disable-next-line class-methods-use-this
  async accessToken() {
    return {
      token: await AsyncStorage.getItem("@dme.login.access_token"),
    };
  }
}
