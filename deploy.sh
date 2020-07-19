#!/bin/bash
set -e
cd "$(dirname "$0")"

TF_OUT=$(./tf_out.sh)
FRONTEND_BUCKET=$(echo $TF_OUT | jq .frontend_bucket.value -r)
CLOUDFRONT_DISTRIBUTION_ID=$(echo $TF_OUT | jq .cloudfront_distribution_id.value -r)

SOURCE_DIR="brews"
BUILD_SUBDIR="build"

export CI=true

cd $SOURCE_DIR
# npm ci
npm i
npm test
npm run build

cd $BUILD_SUBDIR
aws s3 cp . s3://${FRONTEND_BUCKET} --recursive

aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --paths "/*"
