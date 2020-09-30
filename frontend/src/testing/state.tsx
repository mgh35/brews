import { rootReducer, RootState } from "store";
import { SWITCH_USER } from "store/auth/types";
import { BrewsState } from "store/brews/types";
import User from "models/User";
import { createTestUser } from "./models";

export const InitialState = Object.freeze(
    rootReducer(undefined, { type: SWITCH_USER, user: null })
);

type BrewListStateTransformer = (state: BrewsState) => BrewsState;

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

    withBrewListState(brewListState: BrewsState | BrewListStateTransformer) {
        const isTransformer = (
            v: BrewsState | BrewListStateTransformer
        ): v is BrewListStateTransformer => {
            return typeof brewListState === "function";
        };

        const newBrewListState = isTransformer(brewListState)
            ? brewListState(this.state.brewList)
            : brewListState;
        this.state = Object.assign({}, this.state, {
            brewList: newBrewListState,
        });
        return this;
    }

    build(): RootState {
        return this.state;
    }

    buildBrewListState(): BrewsState {
        return this.state.brewList;
    }
}
