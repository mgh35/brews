import { AuthState, AuthAction, SWITCH_USER } from "./types";

const initialState: AuthState = {
  user: null,
};

export default function (
  state: AuthState = initialState,
  action: AuthAction
): AuthState {
  switch (action.type) {
    case SWITCH_USER:
      return {
        user: action.user,
      };
    default:
      return state;
  }
}
