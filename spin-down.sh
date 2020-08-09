#!/bin/bash
set -e
cd "$(dirname "$0")"

ENV=$1
if ! [[ "$ENV" =~ development|production ]]; then
    echo "Must specify an environment [development|production]"
    exit 1
fi

pushd terraform/$ENV
terraform destroy
popd

if [ "$ENV" = "development" ]; then
    docker ps | grep dynamodb-local | awk '{print $1}' | xargs docker stop
fi

