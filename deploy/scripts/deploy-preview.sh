#!/usr/bin/env bash

set -euo pipefail

if [[ -z "${PR_NUMBER:-}" ]]; then
  echo "PR_NUMBER is required." >&2
  exit 1
fi

if [[ -z "${PREVIEW_BASE_DOMAIN:-}" ]]; then
  echo "PREVIEW_BASE_DOMAIN is required." >&2
  exit 1
fi

if [[ -z "${IMAGE_REGISTRY_OWNER:-}" ]]; then
  echo "IMAGE_REGISTRY_OWNER is required." >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
NAMESPACE="${PREVIEW_NAMESPACE:-bagtag-pr-${PR_NUMBER}}"
RELEASE_NAME="${PREVIEW_RELEASE_NAME:-bagtag}"
HOST="pr-${PR_NUMBER}.${PREVIEW_BASE_DOMAIN}"
IMAGE_OWNER_LOWER="$(printf '%s' "${IMAGE_REGISTRY_OWNER}" | tr '[:upper:]' '[:lower:]')"
WEB_IMAGE_REPOSITORY="ghcr.io/${IMAGE_OWNER_LOWER}/bagtag-web-preview"
API_IMAGE_REPOSITORY="ghcr.io/${IMAGE_OWNER_LOWER}/bagtag-api-preview"
IMAGE_TAG="pr-${PR_NUMBER}"

kubectl create namespace "${NAMESPACE}" --dry-run=client -o yaml | kubectl apply -f -

if [[ -n "${GHCR_PULL_USERNAME:-}" && -n "${GHCR_PULL_TOKEN:-}" ]]; then
  kubectl create secret docker-registry ghcr-pull-secret \
    --namespace "${NAMESPACE}" \
    --docker-server ghcr.io \
    --docker-username "${GHCR_PULL_USERNAME}" \
    --docker-password "${GHCR_PULL_TOKEN}" \
    --dry-run=client \
    -o yaml | kubectl apply -f -

  IMAGE_PULL_SECRET_ARGS=(
    --set-string imagePullSecrets[0].name=ghcr-pull-secret
  )
else
  IMAGE_PULL_SECRET_ARGS=()
fi

OPTIONAL_ARGS=()

if [[ -n "${PREVIEW_INGRESS_CLASS:-}" ]]; then
  OPTIONAL_ARGS+=(--set-string "ingress.className=${PREVIEW_INGRESS_CLASS}")
fi

if [[ -n "${PREVIEW_RESEND_API_KEY:-}" ]]; then
  OPTIONAL_ARGS+=(--set-string "api.resend.apiKey=${PREVIEW_RESEND_API_KEY}")
fi

if [[ -n "${PREVIEW_RESEND_FROM_EMAIL:-}" ]]; then
  OPTIONAL_ARGS+=(--set-string "api.resend.fromEmail=${PREVIEW_RESEND_FROM_EMAIL}")
fi

if [[ -n "${PREVIEW_RESEND_FROM_NAME:-}" ]]; then
  OPTIONAL_ARGS+=(--set-string "api.resend.fromName=${PREVIEW_RESEND_FROM_NAME}")
fi

if [[ -n "${PREVIEW_RESEND_REPLY_TO:-}" ]]; then
  OPTIONAL_ARGS+=(--set-string "api.resend.replyTo=${PREVIEW_RESEND_REPLY_TO}")
fi

helm upgrade --install "${RELEASE_NAME}" "${REPO_ROOT}/deploy/helm/bagtag" \
  --namespace "${NAMESPACE}" \
  --create-namespace \
  --wait \
  --timeout 10m \
  -f "${REPO_ROOT}/deploy/environments/preview.yaml" \
  --set-string "ingress.host=${HOST}" \
  --set-string "api.magicLinkBaseUrl=https://${HOST}/login" \
  --set-string "web.image.repository=${WEB_IMAGE_REPOSITORY}" \
  --set-string "web.image.tag=${IMAGE_TAG}" \
  --set-string "api.image.repository=${API_IMAGE_REPOSITORY}" \
  --set-string "api.image.tag=${IMAGE_TAG}" \
  "${IMAGE_PULL_SECRET_ARGS[@]}" \
  "${OPTIONAL_ARGS[@]}"
