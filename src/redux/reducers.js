import { combineReducers } from 'redux';
import { reducer as oidcReducer } from 'redux-oidc';
import authReducer from './auth/reducer';
import eventsReducer from './events/reducer';
import hearingsReducer from './hearings/reducer';

export default combineReducers({
  OIDC: oidcReducer,
  auth: authReducer,
  events: eventsReducer,
  hearings: hearingsReducer
});
