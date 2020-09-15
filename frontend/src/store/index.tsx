import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "./auth/reducer";
import brewListReducer from "./brewList/reducer";
import { SWITCH_USER } from "./auth/types";

const appReducer = combineReducers({
  form: formReducer,
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
