//import { watchLoadUser }          from './user';
import { watchGetHeroContent }    from './events';

const sagas = function* sagas() {
  yield [
    watchGetHeroContent()
  ]
}

export default sagas
