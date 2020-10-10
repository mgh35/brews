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
    try {
        const brews = await db
            .scan({
                TableName: "Brews",
            })
            .promise();

        for (const brew of brews.Items) {
            await db
                .delete({
                    TableName: "Brews",
                    Key: {
                        pk: brew.pk,
                        sk: brew.sk,
                    },
                })
                .promise();
            console.log(`Delete: ${JSON.stringify(brew)}`);
        }
    } catch (e) {
        console.error(`Error: ${String(e)}`);
    }
})();
