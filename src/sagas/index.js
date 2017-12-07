//import { watchLoadUser }          from './user';
import { watchGetHeroContent, watchGetEvents, watchGetEvent }    from './events';
import { watchGetHearings }       from './hearings';

const sagas = function* sagas() {
  yield [
    watchGetHeroContent(),
    watchGetHearings(),
    watchGetEvents(),
    watchGetEvent()
  ]
}

export default sagas
