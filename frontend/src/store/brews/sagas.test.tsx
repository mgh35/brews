import { getSagaTester, RootSagaTester } from "testing/sagas";
import { DELETE_BREW_SUCCEEDED, DELETE_BREW_FAILED } from "./types";
import { deleteBrewRequested } from "./actions";
import brewsSagas from "./sagas";
import Brew, { BrewBuilder } from "models/Brew";
import { MockBrewsApi } from "testing/apis";
import { StateBuilder } from "testing/state";
import User from "models/User";
import { createTestUser } from "testing/models";

describe("deleteBrewSaga", () => {
    describe("green path", () => {
        let brews: { [Key: string]: Brew };
        let user: User;
        let brewToDelete: Brew;
        let brewsApi: MockBrewsApi;
        let tester: RootSagaTester;

        beforeAll(async () => {
            brews = {
                "1": new BrewBuilder("1").withComment("Brew 1").build(),
                "2": new BrewBuilder("2").withComment("Brew 2").build(),
            };
            user = createTestUser();
            brewToDelete = brews["2"];

            brewsApi = new MockBrewsApi().setUserBrews(
                user,
                Object.values(brews)
            );
            tester = getSagaTester(
                new StateBuilder()
                    .withUser(user)
                    .withBrewsState((state) => ({
                        ...state,
                        idToBrew: brews,
                        list_by_most_recent: Object.values(brews).map(
                            (brew) => brew.id
                        ),
                    }))
                    .build(),
                brewsApi
            );
            tester.start(brewsSagas);

            tester.dispatch(deleteBrewRequested(brewToDelete));
            await tester.waitFor(DELETE_BREW_SUCCEEDED);
        });

        it("is not marked as running", () => {
            expect(tester.getState().brews.isDeleting).toBeFalsy();
        });

        it("is not marked as error", () => {
            expect(tester.getState().brews.errorDeleting).toBeNull();
        });

        it("made API call to brewsApi", () => {
            expect(brewsApi.deleteBrewForUser.mock.calls.length).toEqual(1);
        });

        it("deletes the brew", () => {
            expect(brewsApi.brews[user.id].length).toEqual(
                Object.keys(brews).length - 1
            );
            expect(
                brewsApi.brews[user.id].map((brew) => brew.id)
            ).not.toContain(brewToDelete.id);
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
            tester.start(brewsSagas);

            tester.dispatch(deleteBrewRequested(new BrewBuilder().build()));
            await tester.waitFor(DELETE_BREW_FAILED);
        });

        it("is not marked as running", () => {
            expect(tester.getState().brews.isDeleting).toBeFalsy();
        });

        it("is has set the expected error", () => {
            expect(tester.getState().brews.errorDeleting).not.toBeNull();
        });
    });
});
