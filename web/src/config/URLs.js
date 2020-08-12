const { API_HOST = "192.168.0.4", API_PORT = "8000" } = process.env;

const BASE_URL = `http://${API_HOST}:${API_PORT}`;
export const API_URL = `${BASE_URL}/api`;
export const LOGIN_URL = `${BASE_URL}/oauth/token`;
export const USER_URL = `${API_URL}/user`;

export const POST = "post";
export const PUT = "put";
export const GET = "get";
export const DELETE = "delete";
