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

const FEATURED_EVENT_BASE_URL = Config.FEATURED_EVENT_API_BASE_URL
const LOCALE = translations.getLanguage()

const getEventDuration = (start, end) => {
  Moment.locale(LOCALE)
  return Moment(start).twix(end, {allDay:true}).format({
    hourFormat: "H"
  })
}

const fetchHero = function*() {
  try {
    const heroLink = yield call(fetchHeroLink)
    const heroContent = yield call(makeRequest, heroLink + "?include=location", 'GET', null)

    yield put(EventActions.getHeroSuccess({
      imageUrl: heroContent.images[0].url,
      date: getEventDuration(heroContent.start_time, heroContent.end_time),
      place: heroContent.location.name[LOCALE],
      headline: heroContent.name[LOCALE]
    }))
  } catch (err) {
    yield put(EventActions.getHeroFailure(error.message))
  }
}

function fetchHeroLink() {
  return makeRequest(FEATURED_EVENT_BASE_URL, 'GET', null)
    .then((response) => {
      const heroLink = response.field_hero_carousel["0"].field_promotion_link[0].field__id
      return heroLink
    })
}

const watchGetHeroContent = function*() {
  yield takeLatest(EventTypes.GET_HERO, fetchHero)
}

export {
  watchGetHeroContent
}
