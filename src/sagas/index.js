//import { watchLoadUser }          from './user';
import { watchGetHeroContent, watchGetEvents, watchGetEvent }    from './events';
import { watchGetHearings }       from './hearings';
import { watchPosition } from './location';

const sagas = function* sagas() {
  yield [
    watchPosition(),
    watchGetHeroContent(),
    watchGetHearings(),
    watchGetEvents(),
    watchGetEvent()
  ]
}

export default sagas
