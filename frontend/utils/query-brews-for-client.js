AWS = require("aws-sdk");
DynamoDB = require("aws-sdk/clients/dynamodb");

if (process.argv.length !== 4) {
  console.error(`Usage: node ${process.argv[1]} {client_id} {key}`);
  process.exit(1);
}

AWS.config.update({
  region: "ca-central-1",
});

db = new DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000",
  accessKeyId: process.argv[3],
  secretAccessKey: process.argv[3],
});

(async () => {
  db.query({
    TableName: "Brews",
    KeyConditionExpression: "client_id = :client_id",
    ExpressionAttributeValues: {
      ":client_id": process.argv[2],
    },
  })
    .promise()
    .then((brews) => console.log(JSON.stringify(brews)))
    .catch((err) => console.error(err));
})();
