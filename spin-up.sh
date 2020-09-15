#!/bin/bash
set -e
cd "$(dirname "$0")"

ENV=$1
if ! [[ "$ENV" =~ development|production ]]; then
    echo "Must specify an environment [development|production]"
    exit 1
fi

pushd terraform/$ENV
terraform apply
popd

if [ "$ENV" = "production" ]; then
    ./deploy-production.sh
elif [ "$ENV" = "development" ]; then
    docker run -d -p 8000:8000 amazon/dynamodb-local

    printf "Waiting for dynamodb to start "
    while [ -z "$(aws dynamodb list-tables --endpoint-url http://localhost:8000 --output json)" ]; do
        printf "."
        sleep 1
    done

    CREATED_TABLE=$(aws dynamodb create-table \
        --profile $ENV \
        --table-name Brews \
        --attribute-definitions \
            AttributeName=client_id,AttributeType=S \
            AttributeName=timestamp,AttributeType=S \
        --key-schema \
            AttributeName=client_id,KeyType=HASH \
            AttributeName=timestamp,KeyType=RANGE \
        --billing-mode PAY_PER_REQUEST \
        --endpoint-url http://localhost:8000
    )
    echo "Created table:\n$CREATED_TABLE"
fi
