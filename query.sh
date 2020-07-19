#!/bin/bash
set -e
cd "$(dirname "$0")"

TF_OUT=$(./tf_out.sh)
DOMAIN=$(echo $TF_OUT | jq .cloudfront_domain.value -r)

curl https://${DOMAIN}
