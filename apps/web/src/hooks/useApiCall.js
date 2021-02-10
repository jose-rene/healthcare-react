import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL, GET } from "../config/URLs";

export default ({
    url,
    method = GET,
    params = undefined,
    enableCancelToken = false,
    debug = false,
    headers = {},
    baseURL = API_URL,
    hasAuthedUrl = false,
    defaultData = {},
}) => {
    const {
        REACT_APP_API_ID: ClientId = undefined,
        REACT_APP_API_SECRET: ClientSecret = undefined,
    } = process.env;

    const [cancelToken, setCancelToken] = useState(null);
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const formatParams = (params, _method = method) => ({
        [_method === GET
            ? "params"
            : "data"]: params,
    });

    const [config, setConfig] = useState({
        url,
        baseURL,
        method,
        headers: {
            ...{
                ClientId,
                ClientSecret,
                "content-type": 'application/json',
            },
            // Merge headers passed in with the presets
            ...headers
        },

        cancelToken,

        ...formatParams(params),
    });

    const fire = async ({
                            params: request_params = false,
                            persist_changes = true,
                            hasAuthedUrl: _hasAuthedUrl = hasAuthedUrl,
                            ...config_override
                        } = {}) => {
        let _configs = config;

        if (config_override) {
            _configs = { ...config, ...config_override };
            persist_changes && setConfig(_configs);
        }

        if (request_params) {
            _configs = { ...config, ...formatParams(request_params, _configs.method) };
            persist_changes && setConfig(_configs);
        }

        try {
            const jwtToken = await AsyncStorage.getItem('@dme.login.access_token');

            if (jwtToken) {
                _configs.headers['Authorization'] = `Bearer ${jwtToken}`;
            }
        } catch (e) {
        }

        setError(false);
        setLoading(true);

        debug && console.info('useService.fire', { _configs });

        try {
            const { data = 'missing' } = await axios(_configs);
            debug && console.info('useService.fired.resolve', { data });
            setData(data);
            return data;
        } catch (err) {
            debug && console.info('useService.fired.reject', {err})
            setError(err);
            throw(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const jwtToken = await AsyncStorage.getItem("@dme.login.access_token");

                if (jwtToken) {
                    const new_config = config;
                    new_config.headers['Authorization'] = `Bearer ${jwtToken}`;

                    setConfig(new_config);
                }
            } catch (e) {
            }

            if (enableCancelToken) {
                const tmp_cancel_token = axios.CancelToken.source();

                setCancelToken(tmp_cancel_token.token);
            }
        })();

        debug && console.info('useService.fired.construct', {config})
    }, []);

    useEffect(() => {
        setConfig({ ...config, url });
        debug && console.info("useService.useMemo.url", { config });
    }, [url]);

    useEffect(() => {
        setConfig({ ...config, ...formatParams(params) });
        debug && console.info("useService.useMemo.params", { config });
    }, [params]);

    return [{loading, data, error, cancelToken}, fire];
}
