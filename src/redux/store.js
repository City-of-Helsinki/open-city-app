// @flow
import { applyMiddleware, createStore, compose } from 'redux';
import { loadUser } from 'redux-oidc';
import createSagaMiddleware from 'redux-saga';
import createOidcMiddleware from 'redux-oidc';
import { createLogger } from 'redux-logger';
import reducers from './reducers';
import sagas from '../sagas';

import userManager from '../util/userManager';

const logger = createLogger({
  collapsed:false
})

function configureStore() {
  const sagaMiddleware = createSagaMiddleware();
  const oidcMiddleware = createOidcMiddleware(userManager);

  const store = createStore(reducers, applyMiddleware(oidcMiddleware, sagaMiddleware, logger));
  //loadUser(store, userManager);

  sagaMiddleware.run(sagas);

  return store;
}
const store = configureStore();
loadUser(store, userManager);
console.log("USER MANAGER", userManager)

export default store
