// @flow
import { applyMiddleware, createStore, compose } from 'redux';
import { loadUser } from 'redux-oidc';
import createSagaMiddleware from 'redux-saga';
import createOidcMiddleware from 'redux-oidc';
import { persistStore } from 'redux-persist';
import { createLogger } from 'redux-logger';
import reducers from './reducers';
import sagas from '../sagas';

import userManager from '../util/userManager';

// add logger to applyMiddleware params to enable redux logging
// const logger = createLogger({
//   collapsed:false
// })

function configureStore() {
  const sagaMiddleware = createSagaMiddleware();
  const oidcMiddleware = createOidcMiddleware(userManager);

  const store = createStore(reducers, applyMiddleware(oidcMiddleware, sagaMiddleware));
  const persistor = persistStore(store);
  //loadUser(store, userManager);

  sagaMiddleware.run(sagas);

  return { persistor, store };
}

const { persistor, store } = configureStore();
loadUser(store, userManager);

export {
  store,
  persistor
}
