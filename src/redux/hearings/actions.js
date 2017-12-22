import { createActions } from 'reduxsauce'

const {Types, Creators} = createActions({
  getHearings: null,
  getHearingsSuccess: ['hearingList'],
  getHearingsFailure: ['error']
})

export const HearingTypes = Types
export default Creators
