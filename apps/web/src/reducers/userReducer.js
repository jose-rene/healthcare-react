import { FETCH_USER, CLEAR_USER } from "../actions/userAction";

const initialState = {
  email: "",
  full_name: "",
    roles: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_USER:
      return { ...state, email: action.email, full_name: action.full_name, roles: action.roles || [] };

    case CLEAR_USER:
      return { ...state, ...initialState };

    default:
      return { ...state };
  }
}
