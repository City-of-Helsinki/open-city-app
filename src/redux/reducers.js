import { combineReducers } from 'redux';
import { reducer as oidcReducer } from 'redux-oidc';
import authReducer from './auth/reducer';
import eventsReducer from './events/reducer';

export default combineReducers({
  OIDC: oidcReducer,
  auth: authReducer,
  events: eventsReducer
});
