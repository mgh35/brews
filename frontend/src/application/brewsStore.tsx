import { Brew } from "models/brew";
import { User } from "models/user";
import { BrewsFromDynamoDb } from "api/DynamoDb";

export class BrewsStore {
    private user: User;
    private brewsApi: BrewsFromDynamoDb;
    private brewsById: { [key: string]: Brew };

    constructor(user: User) {
        this.user = user;
        this.brewsApi = new BrewsFromDynamoDb();
        this.brewsById = {};
    }

    async refresh() {
        const brews = await this.brewsApi.fetchForUser(this.user);
        for (const brew of brews) {
            this.brewsById[brew.id] = brew;
        }
    }

    async addBrew(brew: Brew) {
        await this.brewsApi.saveForUser(this.user, brew);
        this.brewsById[brew.id] = this._cloneBrew(brew);
    }

    getLatestBrew(): Brew | null {
        let latestBrew: Brew | null = null;
        for (const brew of Object.values(this.brewsById)) {
            if (
                !latestBrew ||
                !latestBrew.timestamp ||
                (brew.timestamp && brew.timestamp > latestBrew.timestamp)
            ) {
                latestBrew = brew;
            }
        }
        return latestBrew;
    }

    private _cloneBrew(brew: Brew): Brew {
        return Object.assign({}, brew);
    }
}
