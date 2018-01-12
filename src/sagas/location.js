/* eslint-disable no-console,no-unused-vars */
/* eslint no-constant-condition: ["error", { "checkLoops": false }] */

import {
  take,
  put,
  call,
  select,
  takeEvery
} from 'redux-saga/effects';

import {
  eventChannel, END
} from 'redux-saga';

import {
  default as LocationActions,
  LocationTypes
} from '../redux/location/actions';


function listenForGeolocationEvents() {
  console.log("hello world")
  return eventChannel(emit => {
    const changeHandler = (position) => {
      console.log("got position", position)
      emit(position)
    }

    const errorHandler = (error) => {
      //swallow
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
      distanceFilter: 10
    }

    navigator.geolocation.getCurrentPosition(emit, errorHandler)
    const watchHandle = navigator.geolocation.watchPosition(emit, errorHandler)

    const unsub = () => {
      navigator.geolocation.clearWatch(watchHandle)
    }

    return unsub
  })
}

const locationChange = function*(position) {
  yield put(LocationActions.positionChange(position))
}

const watchPosition = function*() {
  const channel = yield call(listenForGeolocationEvents)
  yield takeEvery(channel, locationChange)
}

export {
  watchPosition
}
