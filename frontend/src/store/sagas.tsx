import { all } from 'redux-saga/effects';
import brewListSaga from './brewList/sagas';

export default function* rootSaga() {
    yield all([
        brewListSaga(),
    ]);
};
