import { createReducer } from 'reduxsauce';
import { AuthTypes } from './actions';

const INITIAL_STATE = {showWebView:false, url:''}

const show = (state = INITIAL_STATE, action) => {
  return {...state, showWebView:true, url:action.url }
}

const hide = (state = INITIAL_STATE) => {
  return {...state, showWebView:false, url:''}
}

const HANDLERS = {
  [AuthTypes.SHOW]: show,
  [AuthTypes.HIDE]: hide
}

export default createReducer(INITIAL_STATE, HANDLERS)
