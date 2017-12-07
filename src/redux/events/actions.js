import { createActions } from 'reduxsauce'

const {Types, Creators} = createActions({
  getHero: null,
  getHeroSuccess: ['heroData'],
  getHeroFailure: ['error'],
  getList: null,
  getListSuccess: ['eventList'],
  getListFailure: ['error'],
  getEvent: ['eventUrl'],
  getEventSuccess: ['eventData'],
  getEventFailure: ['error']
})

export const EventTypes = Types
export default Creators
