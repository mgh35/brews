import {
  all,
  call,
  getContext,
  put,
  select,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";

import { BREWS_API } from "store/sagas";
import {
  AddBrewRequestedAction,
  ADD_BREW_REQUESTED,
  FetchBrewsRequestedAction,
  FETCH_BREWS_REQUESTED,
} from "store/brewList/types";
import {
  addBrewFailed,
  addBrewSucceeded,
  fetchBrewsSucceeded,
  fetchBrewsFailed,
  fetchBrewsRequested,
} from "./actions";
import { BrewsApi } from "apis";

function* addBrew(action: AddBrewRequestedAction) {
  try {
    const user = yield select((state) => state.auth.user);
    const brewsApi: BrewsApi = yield getContext(BREWS_API);
    yield call(brewsApi.addBrewForUser.bind(brewsApi), user, action.brew);
    yield put(addBrewSucceeded());
    yield put(fetchBrewsRequested());
  } catch (err) {
    const message = err instanceof Error ? err.message : err.toString();
    yield put(addBrewFailed(message));
  }
}

export function* addBrewSaga() {
  yield takeEvery(ADD_BREW_REQUESTED, addBrew);
}

function* fetchBrews(action: FetchBrewsRequestedAction) {
  try {
    const user = yield select((state) => state.auth.user);
    const brewsApi: BrewsApi = yield getContext(BREWS_API);
    const brews = yield call(brewsApi.fetchBrewsForUser.bind(brewsApi), user);
    yield put(fetchBrewsSucceeded(brews));
  } catch (e) {
    yield put(fetchBrewsFailed(e));
  }
}

export function* fetchBrewsSaga() {
  yield takeLatest(FETCH_BREWS_REQUESTED, fetchBrews);
}

export default function* brewListSagas() {
  yield all([addBrewSaga(), fetchBrewsSaga()]);
}
