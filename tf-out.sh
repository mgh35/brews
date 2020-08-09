#!/bin/bash
set -e

ENV=$1
if ! [[ "$ENV" =~ development|production ]]; then
    echo "Must specify an environment [development|production]"
    exit 1
fi

cd "$(dirname "$0")/terraform/${ENV}"
terraform output -json
