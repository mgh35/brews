#!/bin/bash
set -e
cd "$(dirname "$0")"

TF_OUT=$(./tf_out.sh)
ENV_FILE=".env"

cd brews
if [ -e "$ENV_FILE" ]; then
    rm $ENV_FILE
fi

echo "REACT_APP_REGION=$(echo $TF_OUT | jq .region.value -r)" >> $ENV_FILE
echo "REACT_APP_USER_POOL_ID=$(echo $TF_OUT | jq .user_pool_id.value -r)" >> $ENV_FILE
echo "REACT_APP_USER_POOL_CLIENT_ID=$(echo $TF_OUT | jq .user_pool_client_id.value -r)" >> $ENV_FILE
echo "REACT_APP_USER_POOL_DOMAIN=$(echo $TF_OUT | jq .user_pool_domain.value -r)" >> $ENV_FILE

cat $ENV_FILE
