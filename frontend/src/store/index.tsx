import { combineReducers } from "redux";
import authReducer from "./auth/reducer";
import brewListReducer from "./brews/reducer";
import { SWITCH_USER } from "./auth/types";

const appReducer = combineReducers({
    auth: authReducer,
    brewList: brewListReducer,
});

type StateParam = Parameters<typeof appReducer>[0];
type ActionParam = Parameters<typeof appReducer>[1];

export const rootReducer = (state: StateParam, action: ActionParam) => {
    if (action.type === SWITCH_USER) {
        return appReducer(undefined, action);
    } else {
        return appReducer(state, action);
    }
};

export type RootState = ReturnType<typeof appReducer>;
