import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { AddBrewRequestedAction, ADD_BREW_REQUESTED, FetchBrewsRequestedAction, FETCH_BREWS_REQUESTED } from 'store/brewList/types';
import { addUserBrew, fetchUserBrews } from 'libs/query'
import { addBrewFailed, addBrewSucceeded, fetchBrewsSucceeded, fetchBrewsFailed, fetchBrewsRequested } from './actions';

function* addBrew(action: AddBrewRequestedAction) {
    try {
        const user = yield select(state => state.auth.user);
        yield call(addUserBrew, user, action.brew);
        yield put(addBrewSucceeded());
        yield put(fetchBrewsRequested());
    } catch(e) {
        yield put(addBrewFailed(e))
    }
};

function* addBrewSaga() {
    yield takeEvery(ADD_BREW_REQUESTED, addBrew);
};

function* fetchBrews(action: FetchBrewsRequestedAction) {
    try {
        const user = yield select(state => state.auth.user);
        const brews = yield call(fetchUserBrews, user);
        yield put(fetchBrewsSucceeded(brews));
    } catch(e) {
        yield put(fetchBrewsFailed(e));
    }
};

function* fetchBrewsSaga() {
    yield takeLatest(FETCH_BREWS_REQUESTED, fetchBrews);
};

export default function* brewListSaga() {
    yield all([
        addBrewSaga(),
        fetchBrewsSaga(),
    ])
};
