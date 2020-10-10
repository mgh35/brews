AWS = require("aws-sdk");
DynamoDB = require("aws-sdk/clients/dynamodb");

if (process.argv.length !== 3) {
    console.error(`Usage: node ${process.argv[1]} {key}`);
    process.exit(1);
}

AWS.config.update({
    region: "ca-central-1",
});

db = new DynamoDB.DocumentClient({
    endpoint: "http://localhost:8000",
    accessKeyId: process.argv[2],
    secretAccessKey: process.argv[2],
});

(async () => {
    db.scan({
        TableName: "Brews",
    })
        .promise()
        .then((brews) =>
            console.log(brews.Items.map(JSON.stringify).join("\n\n"))
        )
        .catch((err) => console.error(err));
})();
