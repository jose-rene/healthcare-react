import { combineReducers } from 'redux';
import restoreTokenReducer from './restoreTokenReducer';

export const rootReducer = combineReducers({
  auth: restoreTokenReducer,
});
