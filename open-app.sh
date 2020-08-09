#!/bin/bash
set -e
cd "$(dirname "$0")"

TF_OUT=$(./tf-out.sh)
DOMAIN=$(echo $TF_OUT | jq .cloudfront_domain.value -r)

open -a "Google Chrome" https://${DOMAIN}
