import { createReducer } from 'reduxsauce';
import { EventTypes } from './actions';

const INITIAL_STATE = { heroEvent: {}, eventList: [], loading: false, error: null }

const setLoading = (state = INITIAL_STATE) => {
  return { ...state, loading: true }
}

const getHeroSuccess = (state = INITIAL_STATE, action) => {
  return { ...state, heroEvent: action.heroData, loading: false }
}

const getHeroFailure = (state = INITIAL_STATE, action) => {
  return { ...state, error: action.error, loading: false }
}

const HANDLERS = {
  [EventTypes.GET_HERO]: setLoading,
  [EventTypes.GET_HERO_SUCCESS]: getHeroSuccess,
  [EventTypes.GET_HERO_FAILURE]: getHeroFailure
}

export default createReducer(INITIAL_STATE, HANDLERS)
