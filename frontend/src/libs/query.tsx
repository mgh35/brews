import Brew from 'models/Brew';
import User from 'models/User';

import { Auth } from 'aws-amplify';
import DynamoDB from 'aws-sdk/clients/dynamodb';

import config from 'config';


function db(credentials: object): DynamoDB.DocumentClient {
    const params = config.DYNAMODB_CONFIG;
    if (!params.accessKeyId) {
        params.credentials = Auth.essentialCredentials(credentials)
    }
    return new DynamoDB.DocumentClient(params);
};

function itemFromBrew(user: User, brew: Brew): any {
    return {
        client_id: user.id,
        ...brew
    }
};

function brewFromItem(item: any): Brew {
    return {
        timestamp: item.timestamp,
        comment: item.comment
    }
};

export function fetchUserBrews(user: User): Promise<Brew[]> {
    return db(user.credentials)
        .query({
            TableName: 'Brews',
            KeyConditionExpression: 'client_id = :client_id',
            ExpressionAttributeValues: {
                ':client_id': user.id
            }
        })
        .promise()
        .then(response => {
            return response.Items ? response.Items.map(brewFromItem) : []
        });
};

export function addUserBrew(user: User, brew: Brew) {
    return db(user.credentials)
        .put({
            TableName: "Brews",
            Item: itemFromBrew(user, brew)
        })
        .promise()
}
