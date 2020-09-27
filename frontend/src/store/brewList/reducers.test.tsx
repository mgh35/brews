import { BrewBuilder } from "models/Brew";
import { StateBuilder } from "testing/state";
import reducer from "./reducer";
import {
    BrewListState,
    DELETE_BREW_FAILED,
    DELETE_BREW_REQUESTED,
    DELETE_BREW_SUCCEEDED,
} from "./types";

describe("DELETE_BREWS_REQUEST", () => {
    let state: BrewListState;
    beforeAll(() => {
        state = reducer(
            new StateBuilder()
                .withBrewListState((state) => ({
                    ...state,
                    isDeleting: false,
                    errorDeleting: "Some error",
                }))
                .buildBrewListState(),
            {
                type: DELETE_BREW_REQUESTED,
                brew: new BrewBuilder().build(),
            }
        );
    });

    it("sets isDeleting", () => {
        expect(state.isDeleting).toBeTruthy();
    });

    it("resets errorDeleting", () => {
        expect(state.errorDeleting).toBeNull();
    });
});

describe("DELETE_BREW_SUCCEEDED", () => {
    let state: BrewListState;
    const brewToDelete = new BrewBuilder("2020-01-01 00:01:00").build();
    beforeAll(() => {
        state = reducer(
            new StateBuilder()
                .withBrewListState((state) => ({
                    ...state,
                    all: [
                        new BrewBuilder("2020-01-01 00:00:00").build(),
                        brewToDelete,
                    ],
                }))
                .buildBrewListState(),
            {
                type: DELETE_BREW_SUCCEEDED,
                brew: brewToDelete,
            }
        );
    });

    it("resets isDeleting", () => {
        expect(state.isDeleting).toBeFalsy();
    });

    it("resets errorDeleting", () => {
        expect(state.errorDeleting).toBeNull();
    });

    it("removes the Brew from `all`", () => {
        expect(state.all.length).toEqual(1);
        expect(state.all[0].timestamp).not.toEqual(brewToDelete.timestamp);
    });
});

describe("DELETE_BREWS_FAILED", () => {
    let state: BrewListState;
    beforeAll(() => {
        state = reducer(
            new StateBuilder()
                .withBrewListState((state) => ({
                    ...state,
                    isDeleting: true,
                    errorDeleting: null,
                }))
                .buildBrewListState(),
            {
                type: DELETE_BREW_FAILED,
                error: "Some error",
            }
        );
    });

    it("resets isDeleting", () => {
        expect(state.isDeleting).toBeFalsy();
    });

    it("sets errorDeleting", () => {
        expect(state.errorDeleting).toEqual("Some error");
    });
});
