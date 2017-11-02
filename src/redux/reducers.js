import { combineReducers } from 'redux';
import { reducer as oidcReducer } from 'redux-oidc';
import authReducer from './auth/reducer';

export default combineReducers({
  OIDC: oidcReducer,
  auth: authReducer
});
