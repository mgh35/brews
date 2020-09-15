AWS = require("aws-sdk");
DynamoDB = require("aws-sdk/clients/dynamodb");

if (process.argv.length !== 3) {
  console.error(`Usage: node ${process.argv[1]} {key}`);
  process.exit(1);
}

AWS.config.update({
  region: "ca-central-1",
});

db = new DynamoDB({
  endpoint: "http://localhost:8000",
  accessKeyId: process.argv[2],
  secretAccessKey: process.argv[2],
});

function createBrewsTable(defn) {
  return db
    .createTable({
      TableName: "Brews",
      AttributeDefinitions: [
        {
          AttributeName: "client_id",
          AttributeType: "S",
        },
        {
          AttributeName: "timestamp",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "client_id",
          KeyType: "HASH",
        },
        {
          AttributeName: "timestamp",
          KeyType: "RANGE",
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    })
    .promise()
    .catch((err) => {
      if (err.code === "ResourceInUseException") {
        return;
      } else {
        throw err;
      }
    });
}

(async () => {
  await createBrewsTable();
})();
