import User from "models/User";
import Brew from "models/Brew";
import { BrewsApi } from "apis";

export class BrewsFromMemory implements BrewsApi {
  brews: Record<string, Array<Brew>>;
  error: string | null;

  constructor() {
    this.brews = {};
    this.error = null;
  }

  setError(error: string | null): BrewsFromMemory {
    this.error = error;
    return this;
  }

  fetchBrewsForUser(user: User) {
    return new Promise<Brew[]>((resolve, reject) => {
      if (this.error) {
        return reject(this.error);
      }

      if (!this.brews[user.id]) {
        return resolve([]);
      }
      return resolve([...this.brews[user.id]]);
    });
  }

  addBrewForUser(user: User, brew: Brew) {
    return new Promise<boolean>((resolve, reject) => {
      if (this.error) {
        return reject(this.error);
      }

      if (!this.brews[user.id]) {
        this.brews[user.id] = [];
      }
      this.brews[user.id].push(brew);
      return resolve(true);
    });
  }
}
