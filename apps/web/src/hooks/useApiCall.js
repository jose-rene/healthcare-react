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
} = {}) => {
    const {
        REACT_APP_API_ID: ClientId = undefined,
        REACT_APP_API_SECRET: ClientSecret = undefined,
    } = process.env;

    const [cancelToken, setCancelToken] = useState(null);
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const formatParams = (params, _method = method) => ({
        [_method === GET ? "params" : "data"]: { ...params, XDEBUG_SESSION_START: "PHPSTORM" },
    });

    const [config, setConfig] = useState({
        url,
        baseURL,
        method,
        headers: {
            ...{
                ClientId,
                ClientSecret,
                "content-type": "application/json",
            },
            // Merge headers passed in with the presets
            ...headers,
        },

        cancelToken,

        ...formatParams(params),
    });

    /*  axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (
                error.request.url != "login" &&
                error?.response &&
                error.response.status === 401
            ) {
                // console.log("signout");
                signOut();
            }
            return Promise.reject(error);
        }
    ); */

    const fire = async ({
        params: request_params = false,
        persist_changes = true,
        hasAuthedUrl: _hasAuthedUrl = hasAuthedUrl,
        loadingTimeoutMS = 100, // resolves the call but keeps loading for a few MS makes page interactions look cleaner
        showLoading = true,
        ...config_override
    } = {}) => {
        let _configs = config;

        if (config_override) {
            _configs = { ...config, ...config_override };
            persist_changes && setConfig(_configs);
        }

        if (request_params) {
            _configs = {
                ...config,
                ...formatParams(request_params, _configs.method),
            };
            persist_changes && setConfig(_configs);
        }

        try {
            const jwtToken = await AsyncStorage.getItem(
                "@dme.login.access_token",
            );

            if (jwtToken) {
                _configs.headers.Authorization = `Bearer ${jwtToken}`;
            }
        } catch (e) {}

        setError(false);

        if (showLoading) {
            setLoading(true);
        }

        debug && console.info("useService.fire", { _configs });

        try {
            const { data = "missing" } = await axios(_configs);
            debug && console.info("useService.fired.resolve", { data });
            setData(data);
            return data;
        } catch (err) {
            debug && console.info("useService.fired.reject", { err });

            // return validation errors if present
            let validationError = "";
            if (
                err?.response &&
                err.response.status === 422 &&
                err.response.data?.errors
            ) {
                // pull the first error
                // eslint-disable-next-line no-restricted-syntax
                for (const field in err.response.data.errors) {
                    if (err.response.data.errors.hasOwnProperty(field)) {
                        [validationError] = err.response.data.errors[field];
                        break;
                    }
                }
            }
            // return a readable error for application errors
            if (err?.response && err.response.status === 500) {
                validationError =
                    "Unknown Application Error, please try again.";
            }

            setError(validationError || err.message);
            setLoading(false);
            throw err;
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, loadingTimeoutMS);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const jwtToken = await AsyncStorage.getItem(
                    "@dme.login.access_token"
                );

                if (jwtToken) {
                    const new_config = config;
                    new_config.headers.Authorization = `Bearer ${jwtToken}`;

                    setConfig(new_config);
                }
            } catch (e) {}

            if (enableCancelToken) {
                const tmp_cancel_token = axios.CancelToken.source();

                setCancelToken(tmp_cancel_token.token);
            }
        })();

        debug && console.info("useService.fired.construct", { config });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setConfig({ ...config, url });
        debug && console.info("useService.useMemo.url", { config });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    useEffect(() => {
        setConfig({ ...config, ...formatParams(params) });
        debug && console.info("useService.useMemo.params", { config });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    return [{ loading, data, error, cancelToken, setLoading }, fire];
};
