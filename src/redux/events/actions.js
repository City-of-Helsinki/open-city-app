import { createActions } from 'reduxsauce'

const {Types, Creators} = createActions({
  getHero: null,
  getHeroSuccess: ['heroData'],
  getHeroFailure: ['error']
})

export const EventTypes = Types
export default Creators
