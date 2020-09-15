import { getSagaTester, RootSagaTester } from "testing/sagas";
import { ADD_BREW_SUCCEEDED, ADD_BREW_FAILED } from "./types";
import { addBrewRequested } from "./actions";
import { addBrewSaga } from "./sagas";
import Brew, { createBrew } from "models/Brew";
import { BrewsFromMemory } from "testing/apis";
import { StateBuilder } from "testing/state";
import User from "models/User";
import { createTestUser } from "testing/models";

describe("addBrewSaga", () => {
  describe("green path", () => {
    let brew: Brew;
    let user: User;
    let brewsApi: BrewsFromMemory;
    let tester: RootSagaTester;

    beforeAll(async () => {
      brew = createBrew("blah");
      user = createTestUser();

      brewsApi = new BrewsFromMemory();
      tester = getSagaTester(
        new StateBuilder().withUser(user).build(),
        brewsApi
      );
      tester.start(addBrewSaga);

      tester.dispatch(addBrewRequested(brew));
      await tester.waitFor(ADD_BREW_SUCCEEDED);
    });

    it("is not marked as running", () => {
      expect(tester.getState().brewList.addBrew.isRunning).toBeFalsy();
    });

    it("is not marked as error", () => {
      expect(tester.getState().brewList.addBrew.error).toBeNull();
    });

    it("adds the brew", () => {
      expect(brewsApi.brews[user.id]).toEqual([brew]);
    });
  });

  describe("API calling error", () => {
    let error: string;
    let brewsApi: BrewsFromMemory;
    let tester: RootSagaTester;

    beforeAll(async () => {
      error = "Something bad happened!";

      brewsApi = new BrewsFromMemory().setError(error);
      tester = getSagaTester(
        new StateBuilder().withTestUser().build(),
        brewsApi
      );
      tester.start(addBrewSaga);

      tester.dispatch(addBrewRequested(createBrew("blah")));
      await tester.waitFor(ADD_BREW_FAILED);
    });

    it("is not marked as running", () => {
      expect(tester.getState().brewList.addBrew.isRunning).toBeFalsy();
    });

    it("is has set the expected error", () => {
      expect(tester.getState().brewList.addBrew.error).toEqual(error);
    });

    it("has not added the brew", () => {
      expect(brewsApi.brews).toEqual({});
    });
  });
});
