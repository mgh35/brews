import { Auth } from "aws-amplify";
import DynamoDB from "aws-sdk/clients/dynamodb";

import config from "config";

import User, { Credentials } from "models/User";
import Brew, { BrewBuilder } from "models/Brew";
import { BrewsApi } from "apis";

export class BrewsFromDynamoDb implements BrewsApi {
  fetchBrewsForUser(user: User) {
    return this._db(user.credentials)
      .query({
        TableName: "Brews",
        KeyConditionExpression: "client_id = :client_id",
        ExpressionAttributeValues: {
          ":client_id": user.id,
        },
      })
      .promise()
      .then((response) => {
        return response.Items ? response.Items.map(this._makeBrewFromItem) : [];
      });
  }

  addBrewForUser(user: User, brew: Brew) {
    return this._db(user.credentials)
      .put({
        TableName: "Brews",
        Item: this._makeItemFromBrew(user, brew),
      })
      .promise()
      .then(() => true);
  }

  _db(credentials: Credentials): DynamoDB.DocumentClient {
    const params = config.DYNAMODB_CONFIG;
    if (!params.accessKeyId && params.region !== "local") {
      params.credentials = Auth.essentialCredentials(credentials);
    }
    return new DynamoDB.DocumentClient(params);
  }

  _makeItemFromBrew(user: User, brew: Brew): any {
    return {
      client_id: user.id,
      ...brew,
    };
  }

  _makeBrewFromItem(item: any): Brew {
    return new BrewBuilder(item.timestamp)
      .withBean(item.bean)
      .withBeanWeightInGrams(item.beanWeightInGrams)
      .withGrinder(item.grinder)
      .withGrindSetting(item.grindSetting)
      .withBloomTimeInSeconds(item.bloomTimeInSeconds)
      .withBrewTimeInSeconds(item.brewTimeInSeconds)
      .withWaterWeightInGrams(item.waterWeightInGrams)
      .withComment(item.comment)
      .create();
  }
}
