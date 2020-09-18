import { rootReducer, RootState } from "store";
import { SWITCH_USER } from "store/auth/types";
import { BrewListState } from "store/brewList/types";
import User from "models/User";
import { createTestUser } from "./models";

export const InitialState = Object.freeze(
  rootReducer(undefined, { type: SWITCH_USER, user: null })
);

export class StateBuilder {
  state: RootState;

  constructor() {
    this.state = Object.assign({}, InitialState);
  }

  withUser(user: User): StateBuilder {
    this.state = Object.assign({}, this.state, {
      auth: {
        user: user,
      },
    });
    return this;
  }

  withTestUser(): StateBuilder {
    this.withUser(createTestUser());
    return this;
  }

  withBrewListState(brewListState: BrewListState) {
    this.state = Object.assign({}, this.state, {
      brewList: brewListState,
    });
    return this;
  }

  build(): RootState {
    return this.state;
  }
}