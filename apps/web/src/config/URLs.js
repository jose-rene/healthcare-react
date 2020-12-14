const {
    REACT_APP_API_HOST = "127.0.0.1",
    REACT_APP_API_PORT = "8000",
} = process.env;

const API_PROTOCOL = REACT_APP_API_HOST.indexOf("http") === 0 ? "" : "http://";
export const BASE_URL = `${API_PROTOCOL}${REACT_APP_API_HOST}:${REACT_APP_API_PORT}`;
export const API_URL = `${BASE_URL}/v1`;
export const LOGIN_URL = `${BASE_URL}/oauth/token`;
export const USER_URL = `${API_URL}/user`;
export const AUTH_TOKEN_NAME = "@dme.login.access_token";
export const HTTP_TIMEOUT = 10000;

export const POST = "post";
export const PUT = "put";
export const GET = "get";
export const DELETE = "delete";
