import {
    all,
    call,
    getContext,
    put,
    select,
    takeLatest,
} from "redux-saga/effects";

import { BREWS_API } from "store/sagas";
import {
    FetchBrewsRequestedAction,
    FETCH_BREWS_REQUESTED,
} from "store/brewList/types";
import { fetchBrewsSucceeded, fetchBrewsFailed } from "./actions";
import { BrewsApi } from "apis";

function* fetchBrews(action: FetchBrewsRequestedAction) {
    try {
        const user = yield select((state) => state.auth.user);
        const brewsApi: BrewsApi = yield getContext(BREWS_API);
        const brews = yield call(
            brewsApi.fetchBrewsForUser.bind(brewsApi),
            user
        );
        yield put(fetchBrewsSucceeded(brews));
    } catch (e) {
        yield put(fetchBrewsFailed(e));
    }
}

export function* fetchBrewsSaga() {
    yield takeLatest(FETCH_BREWS_REQUESTED, fetchBrews);
}

export default function* brewListSagas() {
    yield all([fetchBrewsSaga()]);
}
