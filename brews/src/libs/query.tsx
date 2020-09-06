import Brew from 'models/brew';
import {User} from 'models/user';

import { Auth } from 'aws-amplify';
import DynamoDB from 'aws-sdk/clients/dynamodb';

import config from 'config';


function db(credentials: object): DynamoDB.DocumentClient {
    const params = config.DYNAMODB_CONFIG;
    if (!params.accessKeyId) {
        params.credentials = Auth.essentialCredentials(credentials)
    }
    return new DynamoDB.DocumentClient(params);
}

export function userBrews(user: User): Promise<Brew[]> {
    return new Promise((resolve, reject) => {
        resolve([
            {
                timestamp: new Date().toISOString(),
                comment: 'Yummy'
            }
        ]);
    })
    // return db(user.credentials)
    //     .query({
    //         TableName: 'Brews',
    //         KeyConditionExpression: 'client_id = :client_id',
    //         ExpressionAttributeValues: {
    //             ':client_id': user.id
    //         }
    //     })
    //     .promise()
    //     .then(response => response.Items)
}

export function addBrew(user: User, brew: Brew) {
    return new Promise((resolve, reject) => {
        resolve(true);
    });
    // return db(user.credentials)
    //     .put({
    //         TableName: "Brews",
    //         Item: {
    //             client_id: user.id,
    //             timestamp: new Date().toISOString(),
    //             ...brew
    //         }
    //     })
    //     .promise()
}
