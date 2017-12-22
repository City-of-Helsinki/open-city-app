import {
  put,
  call,
  takeLatest,
  select
} from 'redux-saga/effects';

import { default as AuthActions, AuthTypes } from '../redux/auth/actions';
import { store } from '../redux/store';

const open = (params) => {
  store.dispatch(AuthActions.show(params.url))
}

const close = ()  => {
  store.dispatch(AuthActions.hide());
}

export {
  open,
  close
}
