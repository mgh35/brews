import SagaTester from 'redux-saga-tester';
import { rootReducer, RootState } from 'store';
import { createSagaContext } from 'store/sagas';
import { BrewsApi } from 'apis';

export type RootSagaTester = SagaTester<RootState>;

export function getSagaTester(initialState: RootState, brewsApi: BrewsApi): RootSagaTester {
    return new SagaTester({
        initialState: initialState,
        reducers: rootReducer,
        options: {
            context: createSagaContext(brewsApi)
        }
    });
};
