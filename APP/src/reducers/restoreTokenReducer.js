import { RESET_TOKEN, SET_TOKEN } from '../actions/types';

const initialState = {
  userToken: null,
  isLoading: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_TOKEN:
      return {
        userToken: action.token,
        isLoading: false,
      };
    case RESET_TOKEN:
      return {
        ...initialState,
        isLoading: false,
      };
    default:
      return state;
  }
}
