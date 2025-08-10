#!/usr/bin/env bash
set -eu

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

export $(grep -v '^#' "$BASE_DIR/.env" | xargs)

scripts=(
"$BASE_DIR/cron/scripts/saveNewChampions.js"
"$BASE_DIR/cron/scripts/saveNewSkins.js"
)

for s in "${scripts[@]}"; do
  DATABASE_URL="$DATABASE_URL_CRON" node "$s" || exit 1
done

cd "$BASE_DIR/"
docker-compose down --remove-orphans
docker-compose up --build -d
