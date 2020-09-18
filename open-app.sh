#!/bin/bash
set -e
cd "$(dirname "$0")"

ENV=production
TF_OUT=$(./tf-out.sh $ENV)
DOMAIN=$(echo $TF_OUT | jq .cloudfront_domain.value -r)

open -a "Google Chrome" https://${DOMAIN}
