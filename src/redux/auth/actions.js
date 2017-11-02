import { createActions } from 'reduxsauce'

const {Types, Creators} = createActions({
  show: ['url'],
  hide: null,
  loadUser: ['token'],
  updateUser: ['userData']
})

export const AuthTypes = Types
export default Creators
