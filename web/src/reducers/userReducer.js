import { FETCH_USER, CLEAR_USER } from "../actions/userAction";

const initialState = {
  email: "",
  full_name: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_USER:
      return { ...state, email: action.email, full_name: action.full_name };

    case CLEAR_USER:
      return { ...state, ...initialState };

    default:
      return { ...state };
  }
}
