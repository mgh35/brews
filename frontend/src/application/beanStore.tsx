import { Bean } from "models/brew";
import { User } from "models/user";
import { BeansFromDynamoDb } from "api/DynamoDb";

export class BeanStore {
    private user: User;
    private beansApi: BeansFromDynamoDb;
    private beansById: { [key: string]: Bean };

    constructor(user: User) {
        this.user = user;
        this.beansApi = new BeansFromDynamoDb();
        this.beansById = {};
    }

    async refresh() {
        const beans = await this.beansApi.fetchForUser(this.user);
        for (const bean of beans) {
            this.beansById[bean.beanId!] = bean;
        }
    }

    async addBean(bean: Bean) {
        await this.beansApi.saveForUser(this.user, bean);
        this.beansById[bean.beanId!] = this._cloneBean(bean);
    }

    getAllBeans(): Array<Bean> {
        return Object.values(this.beansById);
    }

    getById(beanId: string | undefined): Bean | undefined {
        if (!beanId) {
            return undefined;
        }
        return this.beansById[beanId];
    }

    private _cloneBean(bean: Bean): Bean {
        return Object.assign({}, bean);
    }
}
