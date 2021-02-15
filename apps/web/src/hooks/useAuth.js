import AsyncStorage from "@react-native-community/async-storage";
import { useState } from "react";
import { AUTH_TOKEN_NAME, POST } from "../config/URLs";
import useApiCall from "./useApiCall";

const useAuth = () => {
    const [{ loading: userLoading }, fireLoadProfile] = useApiCall({
        url: "user/profile",
    });
    const [{ loading: authLoading }, fireAuth] = useApiCall({
        url: "login",
        method: POST,
    });
    const [{ loading: ssoLoading }, fireSso] = useApiCall();

    const [authState, setAuthed] = useState({
        tokenLoading: true,
        authToken: null,
        loading: false,
        error: "",
    });

    const authUser = async (
        { email, password },
        { loadProfile = false } = {}
    ) => {
        // set loading
        setAuthed((prevState) => ({
            ...prevState,
            loading: true,
        }));

        try {
            const response = await fireAuth({
                params: { email, password },
            });

            const { access_token, token_type, expires_at } = response;

            await Promise.all([
                await AsyncStorage.setItem(AUTH_TOKEN_NAME, access_token),
                await AsyncStorage.setItem("@dme.login.token_type", token_type),
                await AsyncStorage.setItem("@dme.login.expires_at", expires_at),
            ]);

            // update state
            setAuthed((prevState) => ({
                ...prevState,
                tokenLoading: false,
                authToken: access_token,
                loading: false,
                error: "",
            }));

            if (loadProfile) {
                const profile = await fireLoadProfile();
                return { ...authState, profile };
            }

            return { ...authState };
        } catch (err) {
            if (err.response.status == 401) {
                setAuthed({
                    ...authState,
                    tokenLoading: false,
                    authToken: null,
                    loading: false,
                    error: "Bad Username/ Password",
                });
            } else {
                setAuthed({
                    ...authState,
                    tokenLoading: false,
                    authToken: null,
                    loading: false,
                    error: err.message ?? "Network Error",
                });
            }
        }
    };
    // log in via signed sso url from backend
    const authSsoUser = async ({ search }, { loadProfile = false } = {}) => {
        setAuthed((prevState) => ({
            ...prevState,
            loading: true,
        }));
        const searchParams = new URLSearchParams(search ?? {});

        if (
            !searchParams.has("path") ||
            !searchParams.has("expires") ||
            !searchParams.has("signature")
        ) {
            setAuthed((prevState) => ({
                ...prevState,
                tokenLoading: false,
                authToken: null,
                loading: false,
                error: "Error: Invalid request.",
            }));
            return { ...authState, profile: {} };
        }
        try {
            const response = await fireSso({
                url: searchParams.get("path"),
                params: {
                    expires: searchParams.get("expires"),
                    signature: searchParams.get("signature"),
                },
            });
            const { access_token, token_type, expires_at } = response;
            await Promise.all([
                await AsyncStorage.setItem(AUTH_TOKEN_NAME, access_token),
                await AsyncStorage.setItem("@dme.login.token_type", token_type),
                await AsyncStorage.setItem("@dme.login.expires_at", expires_at),
            ]);

            // update state
            setAuthed((prevState) => ({
                ...prevState,
                tokenLoading: false,
                authToken: access_token,
                loading: false,
                error: "",
            }));

            if (loadProfile) {
                const profile = await fireLoadProfile();
                return { ...authState, profile };
            }

            return { ...authState, profile: {} };
        } catch (err) {
            setAuthed((prevState) => ({
                ...prevState,
                tokenLoading: false,
                authToken: null,
                loading: false,
                error: err.message ?? "Error: could not log in.",
            }));
            return { ...authState, profile: {} };
        }
    };

    return [
        { ...authState, userLoading, authLoading, ssoLoading },
        { authUser, authSsoUser },
    ];
};

export default useAuth;
