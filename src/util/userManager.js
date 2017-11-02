import Config from '../config';
import { createUserManager } from 'redux-oidc';
import { AsyncStorage, Linking } from 'react-native';
import AsyncStorageAdapter from '../util/asyncStorage';
import PopupNavigator from '../util/popupNavigator';
import { open, close } from '../sagas/auth';
import { addOnLoadStartListener } from '../views/AuthView';

const stateStore = new AsyncStorageAdapter({ prefix: 'oidc.stateStore.', asyncStorage: AsyncStorage });
const userStore = new AsyncStorageAdapter({ prefix: 'oidc.userStore.', asyncStorage: AsyncStorage });

class CustomNavigator {
  constructor({ onNavigate } = {}) {
    this.onNavigate = onNavigate
  }
  prepare(params) {
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
    return Promise.resolve({
      navigate: ({ url }) => {
        this.onNavigate(url);
        return this._promise;
      },
    });
  }
  callback(url, keepOpen, delimiter) {
    this._resolve && this._resolve({ url });
    return Promise.resolve();
  }
}

const popupNavigator = new PopupNavigator({
  open,
  addOnLoadStartListener,
  close
})

const userManagerConfig = {
  client_id: Config.OPENID_CLIENT_ID,
  redirect_uri: Config.OPENID_REDIRECT,
  response_type: 'id_token token',
  scope: Config.OPENID_SCOPE,
  authority: Config.OPENID_AUTHORITY,
  filterProtocolClaims: true,
  loadUserInfo: true,
  monitorSession: false,
  stateStore,
  userStore,
  popupNavigator
};

const userManager = createUserManager(userManagerConfig);

export default userManager;
