import User from "models/User";
import Brew from "models/Brew";
import { BrewsApi } from "apis";

type AddBrewForUserResolver = (success: boolean) => void;
type AddBrewForUserRejecter = (err: Error) => void;
type DeleteBrewForUserResolver = (Brew: Brew) => void;
type DeleteBrewForUserRejecter = (err: Error) => void;

export class MockBrewsApi implements BrewsApi {
    brews: Record<string, Array<Brew>>;
    private isCapturingPromises: boolean;
    private addBrewForUserHandlers: Array<
        [AddBrewForUserResolver, AddBrewForUserRejecter]
    >;
    private deleteBrewForUserHandlers: Array<
        [DeleteBrewForUserResolver, DeleteBrewForUserRejecter]
    >;

    constructor() {
        this.brews = {};
        this.isCapturingPromises = false;
        this.addBrewForUserHandlers = [];
        this.deleteBrewForUserHandlers = [];
    }

    setUserBrews(user: User, brews: Brew[]): MockBrewsApi {
        this.brews[user.id] = [...brews];
        return this;
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

    deleteBrewForUserHandleNext(
        handler: (
            resolve: DeleteBrewForUserResolver,
            reject: DeleteBrewForUserRejecter
        ) => void
    ) {
        const [resolve, reject] = this.deleteBrewForUserHandlers.shift()!;
        handler(resolve, reject);
    }

    hasBeenCalled(): boolean {
        return (
            this.fetchBrewsForUser.mock.calls.length > 0 ||
            this.addBrewForUser.mock.calls.length > 0 ||
            this.deleteBrewForUser.mock.calls.length > 0
        );
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

    deleteBrewForUser = jest.fn((user: User, brew: Brew) => {
        return new Promise<Brew>((resolve, reject) => {
            if (this.isCapturingPromises) {
                this.deleteBrewForUserHandlers.push([resolve, reject]);
                return;
            }
            const userBrews = this.brews[user.id];
            if (!userBrews) {
                return reject(`User ${user.id} has no Brews`);
            }
            for (let i = 0; i < userBrews.length; ++i) {
                if (userBrews[i].id === brew.id) {
                    this.brews[user.id] = [
                        ...userBrews.slice(0, i),
                        ...userBrews.slice(i + 1),
                    ];
                    return resolve(brew);
                }
            }
            return reject(`User ${user.id} has no Brew ${brew.id}`);
        });
    });
}
