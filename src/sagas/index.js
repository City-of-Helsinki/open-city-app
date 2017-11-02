import { watchLoadUser } from './user';

const sagas = function* sagas() {
  yield[
    watchLoadUser()
  ];
}

export default sagas
