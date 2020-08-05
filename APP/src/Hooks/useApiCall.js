import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL, GET } from '../Config/URLs';
import AsyncStorage from '@react-native-community/async-storage';

export default ({
  initial_method = GET,
  initial_params = {},
  initial_data = {},
  headers = {},
} = {}) => {
  const [data, setData] = useState(initial_data);
  const [url, setUrl] = useState(null);
  const [method, setMethod] = useState(initial_method);
  const [params, setParams] = useState(initial_params);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setError(null);
    setLoading(true);

    try {
      const config = {
        url,
        baseURL: API_URL,
        // @todo this should be config
        timeout: 10000,

        headers: {
          'content-type': 'application/json',
          ...headers,
        },

        method,

        [method == GET ? 'params' : 'data']: params,
      };

      const auth_token = await AsyncStorage.getItem('@dme.login.access_token');
      // if auth then set the token
      if (auth_token) {
        config.headers['Authorization'] = `Bearer ${auth_token}`;
      }

      const result = await axios(config);

      setData(result.data);
    } catch (error) {
      // set to user readable error
      setError(
        error.message ? 'Error: ' + error.message : 'Unknown Network Error'
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    if (url) {
      // TODO :: when done dev re-enable this
      fetchData().then();
    }
  }, [params]);

  const doCall = (url, { params: new_params = {}, method = GET }) => {
    setMethod(method);
    setUrl(url);
    setParams(new_params);
  };

  return [{ response: data, data, loading, error }, doCall];
};
