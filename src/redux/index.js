/**
 * Created by developercomputer on 07.10.16.
 */
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducer from './reducers';
import saga from './saga';

export default function createShaeStore(persistentState) {
  const sagaMiddleware = createSagaMiddleware();
  let store;
  if (persistentState == null) {
    store = createStore(
      reducer,
      applyMiddleware(sagaMiddleware)
    );
  } else {
    store = createStore(
      reducer,
      persistentState,
      applyMiddleware(sagaMiddleware)
    );
  }
  sagaMiddleware.run(saga);
  return store;
}
