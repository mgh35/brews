import User from "models/User";
import Brew from "models/Brew";
import { BrewsApi } from "apis";

type AddBrewForUserResolver = (success: boolean) => void;
type AddBrewForUserRejecter = (err: Error) => void;

export class MockBrewsApi implements BrewsApi {
    brews: Record<string, Array<Brew>>;
    private isCapturingPromises: boolean;
    private addBrewForUserHandlers: Array<
        [AddBrewForUserResolver, AddBrewForUserRejecter]
    >;

    constructor() {
        this.brews = {};
        this.isCapturingPromises = false;
        this.addBrewForUserHandlers = [];
    }

    setCapturePromises(isCapturingPromises: boolean): MockBrewsApi {
        this.isCapturingPromises = isCapturingPromises;
        return this;
    }

    addBrewForUserHandleNext(
        handler: (
            resolve: AddBrewForUserResolver,
            reject: AddBrewForUserRejecter
        ) => void
    ) {
        const [resolve, reject] = this.addBrewForUserHandlers.shift()!;
        handler(resolve, reject);
    }

    fetchBrewsForUser = jest.fn((user: User) => {
        return new Promise<Brew[]>((resolve, reject) => {
            if (!this.brews[user.id]) {
                return resolve([]);
            }
            return resolve([...this.brews[user.id]]);
        });
    });

    addBrewForUser = jest.fn((user: User, brew: Brew) => {
        return new Promise<boolean>((resolve, reject) => {
            if (!this.brews[user.id]) {
                this.brews[user.id] = [];
            }
            this.brews[user.id].push(brew);
            if (this.isCapturingPromises) {
                this.addBrewForUserHandlers.push([resolve, reject]);
                return;
            }
            return resolve(true);
        });
    });
}
