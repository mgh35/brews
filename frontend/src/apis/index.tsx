import User from 'models/User';
import Brew from 'models/Brew';


export interface BrewsApi {
    fetchBrewsForUser(user: User): Promise<Brew[]>;
    addBrewForUser(user: User, brew: Brew): Promise<boolean>;
};
