import { all } from "redux-saga/effects";

import { BrewsApi } from "apis";

import brewListSagas from "./brewList/sagas";

export const BREWS_API = "BrewsApi";

export interface SagaContext {
  [BREWS_API]: BrewsApi;
}

export function createSagaContext(brewsApi: BrewsApi): SagaContext {
  return {
    [BREWS_API]: brewsApi,
  };
}

export default function* rootSaga() {
  yield all([brewListSagas()]);
}
