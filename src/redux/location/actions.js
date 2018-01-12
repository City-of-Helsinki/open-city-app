import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
    positionChange: ['position']
});

export const LocationTypes = Types
export default Creators
