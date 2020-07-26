#!/bin/bash
set -e
cd "$(dirname "$0")"

TF_OUT=$(./tf_out.sh)
SDK_FILE="aws-sdk-config.json"
AMPLIFY_FILE="aws-amplify-config.json"

cd brews/src/config

cat > $SDK_FILE <<EOF
{
    "region": $(echo $TF_OUT | jq .region.value)
}
EOF
cat $SDK_FILE

cat > $AMPLIFY_FILE <<EOF
{
    "Auth": {
        "region": $(echo $TF_OUT | jq .region.value),
        "userPoolId": $(echo $TF_OUT | jq .user_pool_id.value),
        "userPoolWebClientId": $(echo $TF_OUT | jq .user_pool_client_id.value),
        "identityPoolId": $(echo $TF_OUT | jq .identity_pool_id.value)
    }
}
EOF
cat $AMPLIFY_FILE
