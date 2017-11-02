import Config from '../config';

import {
  put,
  call,
  takeLatest,
  select
} from 'redux-saga/effects';

import makeRequest from '../util/requests';
import { default as AuthActions, AuthTypes } from '../redux/auth/actions';
import { USER_FOUND } from 'redux-oidc';

const fetchUserData = function* (args) {
  try {
    const url = Config.PROFILE_URL;
    const headers = new Headers({
      "Authorization": `Bearer ${args.token}`
    });

    const response = yield call(makeRequest, url, 'GET', headers);
  } catch(err) {
    console.log("Unable to fetch user details", err.message)
  }

}

const sendUserData = function* (args) {
  try {
    const url = Config.PROFILE_URL;
    const headers = new Headers({
      "Authorization": `Bearer ${args.token}`
    });

    const body = args.userData
    const response = yield call(makeRequest, url, 'PUT', headers, body)
  } catch(err) {
    console.log("Unable to save user details", err.message)
  }
}

const watchLoadUser = function* () {
  yield takeLatest(USER_FOUND, fetchUserData)
}

const watchUpdateUser = function* () {
  yield takeLatest(AuthActions.UPDATE_USER, sendUserData)
}

export {
  watchLoadUser
}
