//import { watchLoadUser }          from './user';
import { watchGetHeroContent, watchGetEvents, watchGetEvent, watchGetMore }    from './events';
import { watchGetHearings }       from './hearings';
import { watchPosition } from './location';

const sagas = function* sagas() {
  yield [
    watchPosition(),
    watchGetHeroContent(),
    watchGetHearings(),
    watchGetEvents(),
    watchGetEvent(),
    watchGetMore()
  ]
}

export default sagas
