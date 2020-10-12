import {useEffect, useState} from "react";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import {API_URL, GET} from "../config/URLs";

export default ({
  initialMethod = GET,
  initialParams = {},
  initialData = {},
  headers = {},
} = {}) => {
  const [data, setData] = useState(initialData);
  const [requestUrl, setUrl] = useState(null);
  const [requestMethod, setMethod] = useState(initialMethod);
  const [params, setParams] = useState(initialParams);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const {
        REACT_APP_API_ID: ClientId = undefined,
        REACT_APP_API_SECRET: ClientSecret = undefined,
      } = process.env;


      setError(null);
      setLoading(true);

      try {
        const config = {
          url: requestUrl,
          baseURL: API_URL,
          // @todo this should be config
          timeout: 10000,

          headers: {
            "content-type": "application/json",
            ClientId,
            ClientSecret,
            ...headers,
          },

          method: requestMethod,

          [GET === requestMethod ? "params" : "data"]: params,
        };

        const token = await AsyncStorage.getItem("@dme.login.access_token");
        // if access token is set, then set the Authorization token header
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const result = await axios(config);

        setData(result.data);
      } catch (e) {
        // set to user readable error
        setError(e.message ? `Error: ${e.message}` : "Unknown Network Error");
      }

      setLoading(false);
    };

    if (requestUrl) {
      // TODO :: when done dev re-enable this
      fetchData().then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]); // headers, method, params, url

  const doCall = (url, { params: new_params = {}, method = GET }) => {
    setMethod(method);
    setUrl(url);
    setParams(new_params);
  };

  return [{ response: data, data, loading, error }, doCall];
};
