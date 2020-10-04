import { BrewBuilder } from "models/Brew";
import { StateBuilder } from "testing/state";
import reducer from "./reducer";
import {
    BrewsState,
    FETCH_BREWS_SUCCEEDED,
    DELETE_BREW_FAILED,
    DELETE_BREW_REQUESTED,
    DELETE_BREW_SUCCEEDED,
} from "./types";

describe("FETCH_BREWS_SUCCEEDED", () => {
    let state: BrewsState;
    beforeAll(() => {
        state = reducer(
            new StateBuilder()
                .withBrewsState((state) => ({
                    ...state,
                    isFetching: true,
                    idToBrew: {
                        "1": new BrewBuilder("1").withComment("old").build(),
                        "2": new BrewBuilder("2").withComment("old").build(),
                    },
                    all: ["1", "2"],
                }))
                .buildBrewsState(),
            {
                type: FETCH_BREWS_SUCCEEDED,
                brews: [
                    new BrewBuilder("1")
                        .withComment("new")
                        .withTimestamp("2020-01-01T01:00:00+0000")
                        .build(),
                    new BrewBuilder("3")
                        .withComment("new")
                        .withTimestamp("2020-01-01T02:00:00+0000")
                        .build(),
                ],
            }
        );
    });

    it("resets isFetching", () => {
        expect(state.isFetching).toBeFalsy();
    });

    it("resets errorFetching", () => {
        expect(state.errorFetching).toBeNull();
    });

    it("overlays the new brews in the idToBrew map", () => {
        expect(Object.keys(state.idToBrew).length).toEqual(3);
        expect(state.idToBrew["1"].comment).toEqual("new");
        expect(state.idToBrew["2"].comment).toEqual("old");
        expect(state.idToBrew["3"].comment).toEqual("new");
    });

    it("set the incomming Brews in list_by_most_recent, ordered by descending create_time", () => {
        expect(state.list_by_most_recent).toEqual(["3", "1"]);
    });
});

describe("DELETE_BREWS_REQUEST", () => {
    let state: BrewsState;
    beforeAll(() => {
        state = reducer(
            new StateBuilder()
                .withBrewsState((state) => ({
                    ...state,
                    isDeleting: false,
                    errorDeleting: "Some error",
                }))
                .buildBrewsState(),
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
    let state: BrewsState;
    const brewToDelete = new BrewBuilder("2").build();
    beforeAll(() => {
        state = reducer(
            new StateBuilder()
                .withBrewsState((state) => ({
                    ...state,
                    idToBrew: {
                        "1": new BrewBuilder("1").build(),
                        "2": brewToDelete,
                    },
                    list_by_most_recent: ["1", "2"],
                }))
                .buildBrewsState(),
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

    it("removes the Brew from list_by_most_recent", () => {
        expect(state.list_by_most_recent).toEqual(["1"]);
    });
});

describe("DELETE_BREWS_FAILED", () => {
    let state: BrewsState;
    beforeAll(() => {
        state = reducer(
            new StateBuilder()
                .withBrewsState((state) => ({
                    ...state,
                    isDeleting: true,
                    errorDeleting: null,
                }))
                .buildBrewsState(),
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
