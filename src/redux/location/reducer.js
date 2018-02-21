import { createReducer } from 'reduxsauce';
import { LocationTypes } from './actions';

// Default region set as Helsinki
const DEFAULT_LATITUDE           = 60.1680574;
const DEFAULT_LONGITUDE          = 24.9339746;
const DEFAULT_LATITUDE_DELTA     = 0.02208;
const DEFAULT_LONGITUDE_DELTA    = 0.01010;


const INITIAL_STATE = {
  region: {             // Coordinates for the visible area of the map
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    latitudeDelta: DEFAULT_LATITUDE_DELTA,
    longitudeDelta: DEFAULT_LONGITUDE_DELTA
  },
  userPosition: {       // The position of the user
    latitude: null,
    longitude: null
  }
}

const change = (state = INITIAL_STATE, action) => {

    const region = {
      latitude: action.position.coords.latitude,
      longitude: action.position.coords.longitude,
      latitudeDelta: DEFAULT_LATITUDE_DELTA,
      longitudeDelta: DEFAULT_LONGITUDE_DELTA,
    }
    const userPosition = {
      latitude: action.position.coords.latitude,
      longitude: action.position.coords.longitude
    }

    return { ...state, region: region, userPosition: userPosition };
};

const HANDLERS = {
    [LocationTypes.POSITION_CHANGE]: change
};

export default createReducer(INITIAL_STATE, HANDLERS);
