#!/bin/bash
set -e
cd "$(dirname "$0")"

ENV=production
TF_OUT=$(./tf-out.sh $ENV)
FRONTEND_BUCKET=$(echo $TF_OUT | jq .frontend_bucket.value -r)
CLOUDFRONT_DISTRIBUTION_ID=$(echo $TF_OUT | jq .cloudfront_distribution_id.value -r)

SOURCE_DIR="frontend"
BUILD_SUBDIR="build"

export CI=true

./update-config.sh $ENV

cd $SOURCE_DIR
# npm ci
npm i
npm test
npm run build

cd $BUILD_SUBDIR
aws s3 cp . s3://${FRONTEND_BUCKET} --recursive

aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --paths "/*"
