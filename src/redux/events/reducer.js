import { createReducer } from 'reduxsauce';
import { EventTypes } from './actions';

const INITIAL_STATE = { heroEvent: {}, eventList: [], event: {}, loading: false, heroLoading: false, error: null, nextUrl: null }

const setLoading = (state = INITIAL_STATE) => {
  return { ...state, loading: true, nextUrl: null, error: null }
}

const setHeroLoading = (state = INITIAL_STATE) => {
  return { ...state, heroLoading: true }
}

const getHeroSuccess = (state = INITIAL_STATE, action) => {
  return { ...state, heroEvent: action.heroData, heroLoading: false }
}

const getHeroFailure = (state = INITIAL_STATE, action) => {
  return { ...state, error: action.error, heroLoading: false }
}

const getListSuccess = (state = INITIAL_STATE, action) => {
  return { ...state, eventList: action.eventList, loading: false, nextUrl: action.nextUrl }
}

const getListFailure = (state = INITIAL_STATE, action) => {
  return { ...state, error: action.error, loading: false, nextUrl: null }
}

const getEventSuccess = (state = INITIAL_STATE, action) => {
  return { ...state, event: action.eventData, loading: false }
}

const getEventFailure = (state = INITIAL_STATE, action) => {
  return { ...state, error: action.error, loading: false}
}

const getMoreSuccess = (state = INITIAL_STATE, action) => {
  const updatedList = [...state.eventList, ...action.eventList]
  return { ...state, eventList: updatedList, loading: false, nextUrl: action.nextUrl }
}

const HANDLERS = {
  [EventTypes.GET_HERO]: setHeroLoading,
  [EventTypes.GET_HERO_SUCCESS]: getHeroSuccess,
  [EventTypes.GET_HERO_FAILURE]: getHeroFailure,
  [EventTypes.GET_LIST]: setLoading,
  [EventTypes.GET_LIST_SUCCESS]: getListSuccess,
  [EventTypes.GET_LIST_FAILURE]: getListFailure,
  [EventTypes.GET_EVENT]: setLoading,
  [EventTypes.GET_EVENT_SUCCESS]: getEventSuccess,
  [EventTypes.GET_EVENT_FAILURE]: getEventFailure,
  [EventTypes.GET_MORE_SUCCESS]: getMoreSuccess
}

export default createReducer(INITIAL_STATE, HANDLERS)
