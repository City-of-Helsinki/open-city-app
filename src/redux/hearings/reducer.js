import { createReducer } from 'reduxsauce';
import { HearingTypes } from './actions';

const INITIAL_STATE = { hearingList: [], loading: false, error: null }

const setLoading = (state = INITIAL_STATE) => {
  return { ...state, loading: true }
}

const getHearingsSuccess = (state = INITIAL_STATE, action) => {
  return { ...state, hearingList: action.hearingList, loading: false }
}

const getHearingsFailure = (state = INITIAL_STATE, action) => {
  return { ...state, error: action.error, loading: false }
}

const HANDLERS = {
  [HearingTypes.GET_HEARINGS]: setLoading,
  [HearingTypes.GET_HEARINGS_SUCCESS]: getHearingsSuccess,
  [HearingTypes.GET_HEARINGS_FAILURE]: getHearingsFailure
}

export default createReducer(INITIAL_STATE, HANDLERS)
