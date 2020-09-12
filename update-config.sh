#!/bin/bash
set -e
cd "$(dirname "$0")"

ENV=$1
if ! [[ "$ENV" =~ development|production ]]; then
    echo "Must specify an environment [development|production]"
    exit 1
fi


TF_OUT=$(./tf-out.sh $ENV)
ENV_FILE=".env.${ENV}"

AWS_SDK_CONFIG=$(cat <<EOF
{
    "region": $(echo $TF_OUT | jq .region.value)
}
EOF
)

AWS_AMPLIFY_CONFIG=$(cat <<EOF
{
    "Auth": {
        "region": $(echo $TF_OUT | jq .region.value),
        "userPoolId": $(echo $TF_OUT | jq .user_pool_id.value),
        "userPoolWebClientId": $(echo $TF_OUT | jq .user_pool_client_id.value),
        "identityPoolId": $(echo $TF_OUT | jq .identity_pool_id.value)
    }
}
EOF
)

if [ "$ENV" == "production" ]; then
    DYNAMODB_CONFIG="{}"
else
    DYNAMODB_CONFIG=$(cat <<EOF
{
    "endpoint": "http://localhost:8000",
    "accessKeyId": "$(aws configure get aws_access_key_id --profile $ENV)",
    "secretAccessKey": "$(aws configure get aws_secret_access_key --profile $ENV)"
}
EOF
)
fi

cd frontend
true > $ENV_FILE
echo "REACT_APP_AWS_SDK_CONFIG='$(echo $AWS_SDK_CONFIG | jq -c)'" >> $ENV_FILE
echo "REACT_APP_AWS_AMPLIFY_CONFIG='$(echo $AWS_AMPLIFY_CONFIG | jq -c)'" >> $ENV_FILE
echo "REACT_APP_DYNAMODB_CONFIG='$(echo $DYNAMODB_CONFIG | jq -c)'" >> $ENV_FILE

cat $ENV_FILE
