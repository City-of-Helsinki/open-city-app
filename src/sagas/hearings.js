import {
  put,
  call,
  takeLatest
}                                                   from 'redux-saga/effects';
import translations                                 from '../translations/general';

import Config                                       from '../config';
import makeRequest                                  from '../util/requests';
import { default as HearingActions, HearingTypes }  from '../redux/hearings/actions';

const HEARINGS_API_URL = Config.HEARINGS_API_BASE_URL
const LOCALE = translations.getLanguage()

const getHeadlineForHearing = function(hearing) {
  return hearing.title[LOCALE] || hearing.title.fi
}

const fetchHearings = function*() {
  try {
    const response = yield call(makeRequest, HEARINGS_API_URL + "?open=true&ordering=-n_comments", 'GET', null)
    const hearings = response.results.map((hearing) => {
      return {
        key: hearing.id,
        imageUrl: hearing.main_image.url,
        headline: getHeadlineForHearing(hearing),
        urlSlug: hearing.slug
      }
    })

    yield put(HearingActions.getHearingsSuccess(hearings))
  } catch(err) {
    console.log("error fetching hearings", err.message)
    yield put(HearingActions.getHearingsFailure(err.message))
  }
}


const watchGetHearings = function*() {
  yield takeLatest(HearingTypes.GET_HEARINGS, fetchHearings)
}

export {
  watchGetHearings
}
