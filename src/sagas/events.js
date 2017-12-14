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
import { stripTags, unescapeHTML }                             from 'underscore.string'
import Config                                   from '../config';
import makeRequest                              from '../util/requests';
import { default as EventActions, EventTypes }  from '../redux/events/actions';

const LOCALE = translations.getLanguage()

const fetchHero = function*() {
  try {
    const { heroLink, myHelsinkiEventData } = yield call(fetchHeroLink)
    const linkedEventsEventData = yield call(makeRequest, heroLink + "?include=location", 'GET', null)
    yield put(EventActions.getHeroSuccess(parseHeroData(linkedEventsEventData, myHelsinkiEventData)))
  } catch (err) {
    yield put(EventActions.getHeroFailure(err.message))
  }
}

const getEvents = function*() {
  try {
    const url = Config.LINKED_EVENTS_API_BASE_URL + "?start=today&include=location"
    const response = yield call(makeRequest, url, 'GET', null)
    const eventList = response.data.map(parseEventData)
    yield put(EventActions.getListSuccess(eventList))
  } catch (err) {
    yield put(EventActions.getListFailure(err.message))
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

const parseHeroData = (linkedEventData, myHelsinkiEventData) => {
  let parsedEvent = {
    eventUrl: linkedEventData["@id"]
  }

  parsedEvent.date = getEventDuration(linkedEventData.start_time, linkedEventData.end_time)
  parsedEvent.place = linkedEventData.location.name[LOCALE] || myHelsinkiEventData.field_promotion_link[0].field_location_name
  parsedEvent.headline = linkedEventData.name[LOCALE] || myHelsinkiEventData.field_promotion_link[0].title
  parsedEvent.description = linkedEventData.description[LOCALE] || myHelsinkiEventData.field_promotion_link[0].field_description
  parsedEvent.region = getEventRegion(linkedEventData.location, myHelsinkiEventData.field_promotion_link[0].field_geolocation[0])
  parsedEvent.imageUrl = linkedEventData.images[0].url || myHelsinkiEventData.field_image_video[0].thumbnail[0].styles.card

  return parsedEvent
}

const parseEventData = (linkedEventData) => {
  let parsedEvent = {
    key: linkedEventData["@id"],
    eventUrl: linkedEventData["@id"],
    date: getEventDuration(linkedEventData.start_time, linkedEventData.end_time),
    place: linkedEventData.location.name[LOCALE] ,
    headline: linkedEventData.name[LOCALE],
    description: getEventDescription(linkedEventData.description[LOCALE]),
    region: getEventRegion(linkedEventData.location)
  }

  parsedEvent.imageUrl = linkedEventData.images[0].url || undefined

  return parsedEvent
}

const getEventDuration = (start, end) => {
  Moment.locale(LOCALE)
  if(!start) {
    return ""
  }
  if(!end) {
    return Moment(start).format("DD.MM HH:MM")
  }
  return Moment(start).twix(end, {allDay:true}).format({
    hourFormat: "H"
  })
}

const getEventRegion = (linkedEventLocation, myHelsinkiLocation = {lat: 60.192059, lng: 24.945831} ) => {

  let parsedLocation = {
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  }

  parsedLocation.latitude = linkedEventLocation.position.coordinates[1] || myHelsinkiLocation.lat
  parsedLocation.longitude = linkedEventLocation.position.coordinates[0] || myHelsinkiLocation.lng

  return parsedLocation
}

const getEventDescription = (eventDescription) => {
  let parsedDescription = unescapeHTML(eventDescription)
  parsedDescription = stripTags(parsedDescription)

  return parsedDescription
}

const fetchHeroLink = function() {
  return makeRequest(Config.FEATURED_EVENT_API_BASE_URL, 'GET', null)
    .then((response) => {
      const heroLink = response.field_hero_carousel[0].field_promotion_link[0].field__id
      const myHelsinkiEventData = response.field_hero_carousel[0]
      return { heroLink, myHelsinkiEventData }
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
