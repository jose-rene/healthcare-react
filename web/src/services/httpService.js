import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { API_URL, GET, AUTH_TOKEN_NAME, HTTP_TIMEOUT } from "../config/URLs";

const httpService = async (
  url,
  { headers = {}, params = {}, method = GET } = {}
) => {
  const config = {
    url,
    baseURL: API_URL,
    timeout: HTTP_TIMEOUT,
    headers: {
      "Content-type": "application/json",
      // TODO ::  this should be config, not needed for now
      /* ClientId: "3",
      ClientSecret: "mMDlVuukFXAQsOXgXhV6z1PyqmG2M0XA9BONLIWg", */
      ...headers,
    },
    method,
    [method === GET ? "params" : "data"]: params,
  };

  const authToken = await AsyncStorage.getItem(AUTH_TOKEN_NAME);
  // if auth then set the token
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  const onSuccess = (data) => {
    // console.log(data);
    return data;
  };

  const onError = (error) => {
    // console.log(error.response ? error.response : "", error.message);
    return Promise.reject(error.message);
  };

  return axios(config).then(onSuccess).catch(onError);
};

export default httpService;
