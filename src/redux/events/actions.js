import { createActions } from 'reduxsauce'

const {Types, Creators} = createActions({
  getHero: null,
  getHeroSuccess: ['heroData'],
  getHeroFailure: ['error'],
  getList: null,
  getListSuccess: ['eventList', 'nextUrl'],
  getListFailure: ['error'],
  getEvent: ['eventUrl'],
  getEventSuccess: ['eventData'],
  getEventFailure: ['error'],
  loadMore: null,
  getMoreSuccess: ['eventList', 'nextUrl']
})

export const EventTypes = Types
export default Creators
