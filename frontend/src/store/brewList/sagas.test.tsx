import { getSagaTester, RootSagaTester } from "testing/sagas";
import { DELETE_BREW_SUCCEEDED, DELETE_BREW_FAILED } from "./types";
import { deleteBrewRequested } from "./actions";
import brewListSagas from "./sagas";
import Brew, { BrewBuilder } from "models/Brew";
import { MockBrewsApi } from "testing/apis";
import { StateBuilder } from "testing/state";
import User from "models/User";
import { createTestUser } from "testing/models";

describe("deleteBrewSaga", () => {
    describe("green path", () => {
        let brews: Brew[];
        let user: User;
        let brewToDelete: Brew;
        let brewsApi: MockBrewsApi;
        let tester: RootSagaTester;

        beforeAll(async () => {
            brews = [
                new BrewBuilder("2020-01-01 00:00:00Z")
                    .withComment("Brew 1")
                    .build(),
                new BrewBuilder("2020-01-01 00:00:01Z")
                    .withComment("Brew 2")
                    .build(),
            ];
            user = createTestUser();
            brewToDelete = brews[1];

            brewsApi = new MockBrewsApi().setUserBrews(user, brews);
            tester = getSagaTester(
                new StateBuilder()
                    .withUser(user)
                    .withBrewListState({
                        all: [...brews],
                        fetchBrews: { isRunning: false, error: null },
                        isDeleting: false,
                        errorDeleting: null,
                    })
                    .build(),
                brewsApi
            );
            tester.start(brewListSagas);

            tester.dispatch(deleteBrewRequested(brewToDelete));
            await tester.waitFor(DELETE_BREW_SUCCEEDED);
        });

        it("is not marked as running", () => {
            expect(tester.getState().brewList.isDeleting).toBeFalsy();
        });

        it("is not marked as error", () => {
            expect(tester.getState().brewList.errorDeleting).toBeNull();
        });

        it("made API call to brewsApi", () => {
            expect(brewsApi.deleteBrewForUser.mock.calls.length).toEqual(1);
        });

        it("deletes the brew", () => {
            expect(brewsApi.brews[user.id].length).toEqual(brews.length - 1);
            expect(
                brewsApi.brews[user.id].map((brew) => brew.timestamp)
            ).not.toContain(brewToDelete.timestamp);
        });
    });

    describe("API calling error", () => {
        let error: string;
        let brewsApi: MockBrewsApi;
        let tester: RootSagaTester;

        beforeAll(async () => {
            error = "Something bad happened!";

            brewsApi = new MockBrewsApi();
            tester = getSagaTester(
                new StateBuilder().withTestUser().build(),
                brewsApi
            );
            tester.start(brewListSagas);

            tester.dispatch(deleteBrewRequested(new BrewBuilder().build()));
            await tester.waitFor(DELETE_BREW_FAILED);
        });

        it("is not marked as running", () => {
            expect(tester.getState().brewList.isDeleting).toBeFalsy();
        });

        it("is has set the expected error", () => {
            expect(tester.getState().brewList.errorDeleting).not.toBeNull();
        });
    });
});
