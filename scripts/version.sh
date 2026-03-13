#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERSION_FILE="$ROOT_DIR/VERSION"

usage() {
  cat <<'EOF'
Usage:
  scripts/version.sh current
  scripts/version.sh sync
  scripts/version.sh set <version>
  scripts/version.sh bump <major|minor|patch>

Commands:
  current              Print the canonical repo version from VERSION.
  sync                 Sync VERSION into app, package, Helm, and deploy metadata files.
  set <version>        Validate and set an explicit SemVer version, then sync files.
  bump <part>          Increment major, minor, or patch from the current stable version.
EOF
}

require_file() {
  local path="$1"
  if [[ ! -f "$path" ]]; then
    echo "Missing required file: $path" >&2
    exit 1
  fi
}

read_version() {
  require_file "$VERSION_FILE"
  tr -d '[:space:]' <"$VERSION_FILE"
}

validate_version() {
  local version="$1"
  if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+([-.][0-9A-Za-z.-]+)?$ ]]; then
    echo "Invalid SemVer version: $version" >&2
    exit 1
  fi
}

write_version() {
  local version="$1"
  printf '%s\n' "$version" >"$VERSION_FILE"
}

replace_first_match() {
  local path="$1"
  local pattern="$2"
  local replacement="$3"

  perl -0pi -e "s/$pattern/$replacement/" "$path"
}

sync_files() {
  local version
  version="$(read_version)"
  validate_version "$version"

  replace_first_match \
    "$ROOT_DIR/apps/web/package.json" \
    '"version": "[^"]+"' \
    "\"version\": \"$version\""

  replace_first_match \
    "$ROOT_DIR/apps/web/package-lock.json" \
    '"version": "[^"]+"' \
    "\"version\": \"$version\""

  replace_first_match \
    "$ROOT_DIR/apps/web/package-lock.json" \
    '"packages": \{\n    "": \{\n      "name": "bag-tag-ui",\n      "version": "[^"]+"' \
    "\"packages\": {\n    \"\": {\n      \"name\": \"bag-tag-ui\",\n      \"version\": \"$version\""

  replace_first_match \
    "$ROOT_DIR/deploy/helm/bagtag/Chart.yaml" \
    'version: [^\n]+' \
    "version: $version"

  replace_first_match \
    "$ROOT_DIR/deploy/helm/bagtag/Chart.yaml" \
    'appVersion: "[^"]+"' \
    "appVersion: \"$version\""

  replace_first_match \
    "$ROOT_DIR/deploy/helm/bagtag/values.yaml" \
    'tag: [^\n]+' \
    "tag: $version"

  replace_first_match \
    "$ROOT_DIR/apps/api/src/main/resources/application.yaml" \
    'version: \$\{BAGTAG_VERSION:[^}]+\}' \
    'version: \${BAGTAG_VERSION:'"$version"'}'

  replace_first_match \
    "$ROOT_DIR/apps/api/src/test/resources/application.yaml" \
    'version: [^\n]+' \
    "version: $version"

  echo "$version"
}

bump_version() {
  local part="$1"
  local current major minor patch
  current="$(read_version)"

  if [[ ! "$current" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
    echo "Cannot bump non-stable version: $current" >&2
    exit 1
  fi

  major="${BASH_REMATCH[1]}"
  minor="${BASH_REMATCH[2]}"
  patch="${BASH_REMATCH[3]}"

  case "$part" in
    major)
      major=$((major + 1))
      minor=0
      patch=0
      ;;
    minor)
      minor=$((minor + 1))
      patch=0
      ;;
    patch)
      patch=$((patch + 1))
      ;;
    *)
      echo "Unknown bump target: $part" >&2
      usage
      exit 1
      ;;
  esac

  write_version "$major.$minor.$patch"
  sync_files >/dev/null
  read_version
}

main() {
  local command="${1:-}"

  case "$command" in
    current)
      read_version
      ;;
    sync)
      sync_files
      ;;
    set)
      if [[ $# -ne 2 ]]; then
        usage
        exit 1
      fi
      validate_version "$2"
      write_version "$2"
      sync_files >/dev/null
      read_version
      ;;
    bump)
      if [[ $# -ne 2 ]]; then
        usage
        exit 1
      fi
      bump_version "$2"
      ;;
    *)
      usage
      exit 1
      ;;
  esac
}

main "$@"
