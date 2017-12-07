import {
  put,
  call,
  takeLatest
}                                               from 'redux-saga/effects';
import translations                             from '../translations/general';
import Moment                                   from 'moment';
import Twix                                     from 'twix'
import 'moment/locale/fi'
import 'moment/locale/sv'

import Config                                   from '../config';
import makeRequest                              from '../util/requests';
import { default as EventActions, EventTypes }  from '../redux/events/actions';

const LOCALE = translations.getLanguage()

const getEventDuration = (start, end) => {
  Moment.locale(LOCALE)
  return Moment(start).twix(end, {allDay:true}).format({
    hourFormat: "H"
  })
}

const fetchHero = function*() {
  try {
    let heroLink = yield call(fetchHeroLink)
    const heroContent = yield call(makeRequest, heroLink + "?include=location", 'GET', null)

    yield put(EventActions.getHeroSuccess(parseEventData(heroContent)))
  } catch (err) {
    yield put(EventActions.getHeroFailure(err.message))
  }
}

const getEvents = function*() {
  try {
    const url = Config.LINKED_EVENTS_API_BASE_URL + "?start=today&include=location"
    const response = yield call(makeRequest, url, 'GET', null)
    yield put(EventActions.getListSuccess([]))
  } catch (err) {
    yield put(EventActions.getListFailure(error.message))
  }
}

const getEvent = function*(args) {
  try {
    const event = yield call(makeRequest, args.eventUrl + "?include=location", 'GET', null)
    yield put(EventActions.getEventSuccess(parseEventData(event)))
  } catch(err) {
    yield put(EventActions.getEventFailure(err.message))
  }
}

const parseEventData = (event) => {
  console.log("event", event)
  return {
    imageUrl: event.images[0].url,
    date: getEventDuration(event.start_time, event.end_time),
    place: event.location.name[LOCALE],
    headline: event.name[LOCALE],
    description: event.description[LOCALE],
    eventUrl: event["@id"],
    region: {
      latitude: event.location.position.coordinates[1],
      longitude: event.location.position.coordinates[0],
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    }
  }
}
const fetchHeroLink = function() {
  return makeRequest(Config.FEATURED_EVENT_API_BASE_URL, 'GET', null)
    .then((response) => {
      const heroLink = response.field_hero_carousel[1].field_promotion_link[0].field__id
      return heroLink
    })
}

const watchGetHeroContent = function*() {
  yield takeLatest(EventTypes.GET_HERO, fetchHero)
}

const watchGetEvents = function*() {
  yield takeLatest(EventTypes.GET_LIST, getEvents)
}

const watchGetEvent = function*() {
  yield takeLatest(EventTypes.GET_EVENT, getEvent)
}

export {
  watchGetHeroContent,
  watchGetEvents,
  watchGetEvent
}
