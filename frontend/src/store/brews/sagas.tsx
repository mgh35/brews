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
    FetchBrewsRequestedAction,
    FETCH_BREWS_REQUESTED,
    DeleteBrewRequestedAction,
    DELETE_BREW_REQUESTED,
} from "store/brews/types";
import {
    fetchBrewsSucceeded,
    fetchBrewsFailed,
    deleteBrewSucceeded,
    deleteBrewFailed,
} from "./actions";
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

function* deleteBrew(action: DeleteBrewRequestedAction) {
    try {
        const user = yield select((state) => state.auth.user);
        const brewsApi: BrewsApi = yield getContext(BREWS_API);
        yield call(
            brewsApi.deleteBrewForUser.bind(brewsApi),
            user,
            action.brew
        );
        yield put(deleteBrewSucceeded(action.brew));
    } catch (e) {
        yield put(deleteBrewFailed(e));
    }
}

export default function* brewsSagas() {
    yield all([
        takeLatest(FETCH_BREWS_REQUESTED, fetchBrews),
        takeEvery(DELETE_BREW_REQUESTED, deleteBrew),
    ]);
}
