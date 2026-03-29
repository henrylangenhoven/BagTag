#!/usr/bin/env bash

set -euo pipefail

if [[ -z "${PR_NUMBER:-}" ]]; then
  echo "PR_NUMBER is required." >&2
  exit 1
fi

NAMESPACE="${PREVIEW_NAMESPACE:-bagtag-pr-${PR_NUMBER}}"

kubectl delete namespace "${NAMESPACE}" --ignore-not-found=true --wait=false
