import { Auth } from "aws-amplify";
import DynamoDB from "aws-sdk/clients/dynamodb";

import config from "config";

import { Brew, Bean } from "models/brew";
import { User } from "models/user";

type DbItem = any;

abstract class DynamoDbApi<T> {
    fetchForUser(user: User): Promise<Array<T>> {
        return this._authed_db().then((db) =>
            db
                .query({
                    TableName: "Brews",
                    KeyConditionExpression:
                        "pk = :pk and begins_with(sk, :sk_prefix)",
                    ExpressionAttributeValues: {
                        ":pk": user.id,
                        ":sk_prefix": this._getSecondaryKeyPrefix(),
                    },
                })
                .promise()
                .then((response) => {
                    return response.Items
                        ? response.Items.map(this._makeObjectFromDbItem)
                        : [];
                })
        );
    }

    saveForUser(user: User, toSave: T) {
        return this._authed_db().then((db) =>
            db
                .put({
                    TableName: "Brews",
                    Item: this._makeDbItemFromObject(user, toSave),
                })
                .promise()
                .then(() => toSave)
        );
    }

    deleteForUser(user: User, toDelete: T) {
        return this._authed_db().then((db) =>
            db
                .delete({
                    TableName: "Brews",
                    Key: {
                        pk: user.id,
                        sk: this._makeSecondaryKey(toDelete),
                    },
                })
                .promise()
                .then(() => toDelete)
        );
    }

    private _authed_db(): Promise<DynamoDB.DocumentClient> {
        const params = config.DYNAMODB_CONFIG;
        if (params.is_local) {
            return Promise.resolve(new DynamoDB.DocumentClient(params));
        }
        return Auth.currentUserCredentials().then(
            (credentials) => new DynamoDB.DocumentClient(credentials)
        );
    }

    protected abstract _makeDbItemFromObject(user: User, object: T): DbItem;

    protected abstract _makeObjectFromDbItem(item: DbItem): T;

    protected abstract _getSecondaryKeyPrefix(): string;

    protected abstract _makeSecondaryKey(object: T): string;
}

export class BrewsFromDynamoDb extends DynamoDbApi<Brew> {
    _makeDbItemFromObject(user: User, brew: Brew): any {
        return {
            pk: user.id,
            sk: this._makeSecondaryKey(brew),
            ...brew,
        };
    }

    _makeObjectFromDbItem(item: DbItem): Brew {
        return item;
    }

    _getSecondaryKeyPrefix(): string {
        return "Brew#";
    }

    _makeSecondaryKey(brew: Brew): string {
        return `${this._getSecondaryKeyPrefix()}${brew.id}`;
    }
}

export class BeansFromDynamoDb extends DynamoDbApi<Bean> {
    _makeDbItemFromObject(user: User, brew: Brew): any {
        return {
            pk: user.id,
            sk: this._makeSecondaryKey(brew),
            ...brew,
        };
    }

    _makeObjectFromDbItem(item: DbItem): Brew {
        return item;
    }

    _getSecondaryKeyPrefix(): string {
        return "Bean#";
    }

    _makeSecondaryKey(bean: Bean): string {
        return `${this._getSecondaryKeyPrefix()}${bean.beanId}`;
    }
}
