const {REACT_APP_API_HOST = "0.0.0.0", REACT_APP_API_PORT = "8000"} = process.env;

const BASE_URL = `http://${REACT_APP_API_HOST}:${REACT_APP_API_PORT}`;
export const API_URL = `${BASE_URL}/api`;
export const LOGIN_URL = `${BASE_URL}/oauth/token`;
export const USER_URL = `${API_URL}/user`;

export const POST = "post";
export const PUT = "put";
export const GET = "get";
export const DELETE = "delete";
