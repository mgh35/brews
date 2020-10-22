AWS = require("aws-sdk");
DynamoDB = require("aws-sdk/clients/dynamodb");

if (
    process.argv.length !== 3 ||
    !["development", "production"].includes(process.argv[2])
) {
    console.error(`Usage: node ${process.argv[1]} {development|production}`);
    process.exit(1);
}
const env = process.argv[2];

config = require("dotenv").config({ path: `.env.${env}` }).parsed;

AWS.config.update(JSON.parse(config.REACT_APP_AWS_SDK_CONFIG));
db = new DynamoDB.DocumentClient(JSON.parse(config.REACT_APP_DYNAMODB_CONFIG));

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
