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
  console.log("fetching data", args)
  try {
    const url = Config.PROFILE_URL;
    const headers = new Headers({
      "Authorization": `Bearer ${args.token}`
    });

    const response = yield call(makeRequest, url, 'GET', headers);
    console.log("Got response", response)
  } catch(err) {
    console.log("Unable to fetch user details", err.message)
  }

}

const watchLoadUser = function* () {
  yield takeLatest(USER_FOUND, fetchUserData)
}

export {
  watchLoadUser
}
