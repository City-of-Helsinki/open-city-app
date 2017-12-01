//import { watchLoadUser }          from './user';
import { watchGetHeroContent }    from './events';
import { watchGetHearings }       from './hearings';

const sagas = function* sagas() {
  yield [
    watchGetHeroContent(),
    watchGetHearings()
  ]
}

export default sagas
