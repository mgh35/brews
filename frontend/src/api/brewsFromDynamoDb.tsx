import { Auth } from "aws-amplify";
import DynamoDB from "aws-sdk/clients/dynamodb";

import config from "config";

import { Brew } from "models/brew";
import { User } from "models/user";

export class BrewsFromDynamoDb {
    fetchBrewsForUser(user: User) {
        return this._authed_db().then((db) =>
            db
                .query({
                    TableName: "Brews",
                    KeyConditionExpression: "pk = :pk",
                    ExpressionAttributeValues: {
                        ":pk": user.id,
                    },
                })
                .promise()
                .then((response) => {
                    return response.Items
                        ? response.Items.map(this._makeBrewFromItem)
                        : [];
                })
        );
    }

    addBrewForUser(user: User, brew: Brew) {
        return this._authed_db().then((db) =>
            db
                .put({
                    TableName: "Brews",
                    Item: this._makeItemFromBrew(user, brew),
                })
                .promise()
                .then(() => true)
        );
    }

    deleteBrewForUser(user: User, brew: Brew) {
        return this._authed_db().then((db) =>
            db
                .delete({
                    TableName: "Brews",
                    Key: {
                        pk: user.id,
                        sk: this._makeBrewKey(brew),
                    },
                })
                .promise()
                .then(() => brew)
        );
    }

    _authed_db(): Promise<DynamoDB.DocumentClient> {
        const params = config.DYNAMODB_CONFIG;
        if (params.is_local) {
            return Promise.resolve(new DynamoDB.DocumentClient(params));
        }
        return Auth.currentUserCredentials().then(
            (credentials) => new DynamoDB.DocumentClient(credentials)
        );
    }

    _makeItemFromBrew(user: User, brew: Brew): any {
        return {
            pk: user.id,
            sk: this._makeBrewKey(brew),
            ...brew,
        };
    }

    _makeBrewKey(brew: Brew): string {
        return `Brew#${brew.id}`;
    }

    _makeBrewFromItem(item: any): Brew {
        return item;
    }
}
