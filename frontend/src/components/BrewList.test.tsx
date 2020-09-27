import React from "react";
import render, { MockStoreType } from "testing/render";
import user from "@testing-library/user-event";
import { RenderResult } from "@testing-library/react";
import BrewList from "./BrewList";
import { BrewBuilder } from "models/Brew";

import { StateBuilder } from "testing/state";
import {
    DELETE_BREW_REQUESTED,
    DeleteBrewRequestedAction,
} from "store/brewList/types";

describe("BrewList", () => {
    describe("with no brews", () => {
        let rendered: RenderResult;
        beforeEach(() => {
            ({ rendered } = render(<BrewList />, new StateBuilder().build()));
        });

        it("has a single table", () => {
            const tables = rendered.container.querySelectorAll("table");
            expect(tables.length).toEqual(1);
        });

        it("has no rows", () => {
            const rows = rendered.container.querySelectorAll("table tbody tr");
            expect(rows.length).toEqual(0);
        });
    });

    describe("with 2 brews", () => {
        let rendered: RenderResult;
        let store: MockStoreType;
        beforeEach(() => {
            ({ rendered, store } = render(
                <BrewList />,
                new StateBuilder()
                    .withBrewListState((state) => ({
                        ...state,
                        all: [
                            new BrewBuilder("2020-09-06T09:00:00+0000")
                                .withComment("brew 1")
                                .build(),
                            new BrewBuilder("2020-09-06T09:05:00+0000")
                                .withComment("brew 2")
                                .build(),
                        ],
                    }))
                    .build()
            ));
        });

        it("has a single table", () => {
            const tables = rendered.container.querySelectorAll("table");
            expect(tables.length).toEqual(1);
        });

        it("has 2 rows", () => {
            const rows = rendered.container.querySelectorAll("table tbody tr");
            expect(rows.length).toEqual(2);
        });

        it("has delete buttons on each row", () => {
            const rows = rendered.container.querySelectorAll("table tbody tr");
            expect(rows[0].querySelector("button")!.innerHTML).toEqual(
                "Delete"
            );
            expect(rows[0].querySelector("button")!.innerHTML).toEqual(
                "Delete"
            );
        });

        describe("on pressing Delete", () => {
            beforeEach(() => {
                const button = rendered.container
                    .querySelectorAll("table tbody tr")[1]
                    .querySelector("button")!;
                user.click(button);
            });

            it("sends a deleteBrewRequested action for the expected Brew", () => {
                expect(store.getActions().length).toEqual(1);
                const action: DeleteBrewRequestedAction = store.getActions()[0];
                expect(action.type).toEqual(DELETE_BREW_REQUESTED);
                expect(action.brew.comment).toEqual("brew 2");
            });
        });
    });
});
