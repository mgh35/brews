import React from "react";
import render, { MockStoreType } from "testing/render";
import App from "components/App";
import { StateBuilder } from "testing/state";
import { screen } from "@testing-library/dom";
import { FETCH_BREWS_REQUESTED } from "store/brews/types";

describe("App", () => {
    describe("with a User defined", () => {
        let store: MockStoreType;

        beforeEach(() => {
            ({ store } = render(
                <App />,
                new StateBuilder().withTestUser().build()
            ));
        });

        it("has Header element", () => {
            expect(screen.queryByRole("navigation")).toBeInTheDocument();
        });

        it("triggers a FetchBrew action", () => {
            expect(store.getActions().length).toEqual(1);
            const action = store.getActions()[0];
            expect(action.type).toEqual(FETCH_BREWS_REQUESTED);
        });
    });

    describe("with no User defined", () => {
        let store: MockStoreType;

        beforeEach(() => {
            ({ store } = render(<App />, new StateBuilder().build()));
        });

        it("does not trigger a FetchBrew action", () => {
            expect(store.getActions().length).toEqual(0);
        });
    });
});
