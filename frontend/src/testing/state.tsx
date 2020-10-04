import { rootReducer, RootState } from "store";
import { SWITCH_USER } from "store/auth/types";
import { BrewsState } from "store/brews/types";
import User from "models/User";
import { createTestUser } from "./models";

export const InitialState = Object.freeze(
    rootReducer(undefined, { type: SWITCH_USER, user: null })
);

type BrewsStateTransformer = (state: BrewsState) => BrewsState;

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

    withBrewsState(brewsState: BrewsState | BrewsStateTransformer) {
        const isTransformer = (
            v: BrewsState | BrewsStateTransformer
        ): v is BrewsStateTransformer => {
            return typeof brewsState === "function";
        };

        const newBrewsState = isTransformer(brewsState)
            ? brewsState(this.state.brews)
            : brewsState;
        this.state = Object.assign({}, this.state, {
            brews: newBrewsState,
        });
        return this;
    }

    build(): RootState {
        return this.state;
    }

    buildBrewsState(): BrewsState {
        return this.state.brews;
    }
}
