import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "store";
import rootSaga, { createSagaContext } from "store/sagas";
import { BrewsFromDynamoDb } from "apis/brewsFromDynamoDb";

export default function () {
  const sagaMiddleware = createSagaMiddleware({
    context: createSagaContext(new BrewsFromDynamoDb()),
  });
  const devtoolsCompose =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    rootReducer,
    devtoolsCompose(applyMiddleware(sagaMiddleware))
  );
  sagaMiddleware.run(rootSaga);
  return store;
}
