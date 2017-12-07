import { createReducer } from 'reduxsauce';
import { EventTypes } from './actions';

const INITIAL_STATE = { heroEvent: {}, eventList: [], event: {}, loading: false, error: null }

const setLoading = (state = INITIAL_STATE) => {
  return { ...state, loading: true }
}

const getHeroSuccess = (state = INITIAL_STATE, action) => {
  return { ...state, heroEvent: action.heroData, loading: false }
}

const getHeroFailure = (state = INITIAL_STATE, action) => {
  return { ...state, error: action.error, loading: false }
}

const getListSuccess = (state = INITIAL_STATE, action) => {
  return { ...state, eventList: action.eventList, loading: false }
}

const getListFailure = (state = INITIAL_STATE, action) => {
  return { ...state, error: action.error, loading: false }
}

const getEventSuccess = (state = INITIAL_STATE, action) => {
  return { ...state, event: action.eventData, loading: false }
}

const getEventFailure = (state = INITIAL_STATE, action) => {
  return { ...state, error: action.error, loading: false}
}

const HANDLERS = {
  [EventTypes.GET_HERO]: setLoading,
  [EventTypes.GET_HERO_SUCCESS]: getHeroSuccess,
  [EventTypes.GET_HERO_FAILURE]: getHeroFailure,
  [EventTypes.GET_LIST]: setLoading,
  [EventTypes.GET_LIST_SUCCESS]: getListSuccess,
  [EventTypes.GET_LIST_FAILURE]: getListFailure,
  [EventTypes.GET_EVENT]: setLoading,
  [EventTypes.GET_EVENT_SUCCESS]: getEventSuccess,
  [EventTypes.GET_EVENT_FAILURE]: getEventFailure
}

export default createReducer(INITIAL_STATE, HANDLERS)
