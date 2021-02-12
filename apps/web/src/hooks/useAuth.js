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
    const [{ loading: searchPathUrlLoading }, fireUrl] = useApiCall();

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

    const authSsoUser = ({ search }) => {
        const doAuth = async () => {
            let data = null;
            const searchParams = new URLSearchParams(search);
            console.log(searchParams);
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
                return;
            }
            try {
                data = await fireUrl({
                    url: searchParams.get("path"),
                    params: {
                        expires: searchParams.get("expires"),
                        signature: searchParams.get("signature"),
                    },
                });
            } catch (err) {
                setAuthed((prevState) => ({
                    ...prevState,
                    tokenLoading: false,
                    authToken: null,
                    loading: false,
                    error: err.message ?? "Error: could not log in.",
                }));
            }

            if (data && "access_token" in data) {
                await AsyncStorage.setItem(AUTH_TOKEN_NAME, data.access_token);
                await AsyncStorage.setItem(
                    "@dme.login.token_type",
                    data.token_type
                );
                await AsyncStorage.setItem(
                    "@dme.login.expires_at",
                    data.expires_at
                );
                // update state
                setAuthed((prevState) => ({
                    ...prevState,
                    tokenLoading: false,
                    authToken: data.access_token,
                    loading: false,
                    error: "",
                }));
            } else {
                setAuthed((prevState) => ({
                    ...prevState,
                    tokenLoading: false,
                    authToken: null,
                    loading: false,
                }));
            }
        };
        setAuthed((prevState) => ({
            ...prevState,
            loading: true,
        }));
        doAuth().then();
    };

    return [
        { ...authState, userLoading, authLoading, searchPathUrlLoading },
        { authUser, authSsoUser },
    ];
};

export default useAuth;
