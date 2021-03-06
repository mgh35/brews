#!/bin/bash
set -e

cd "$(dirname "$0")"

ENV=$1
if ! [[ "$ENV" =~ development|production ]]; then
    echo "Must specify an environment [development|production]"
    exit 1
fi

read -p "Username: " USERNAME
if [ -z "$USERNAME" ]; then
  echo "Must specify Username"
  exit 1
fi
read -p "Email:    " EMAIL
if [ -z "$EMAIL" ]; then
  echo "Must specify Email"
  exit 1
fi

TF_OUT=$(./tf-out.sh $ENV)
USER_POOL_ID=$(echo $TF_OUT | jq .user_pool_id.value -r)

aws cognito-idp admin-create-user \
  --user-pool-id ${USER_POOL_ID} \
  --username ${USERNAME} \
  --user-attributes Name=email,Value=$EMAIL Name=email_verified,Value=True \
  --output json
