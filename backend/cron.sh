#!/usr/bin/env bash
set -eu

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

scripts=(
"$BASE_DIR/cron/scripts/saveNewChampions.js"
"$BASE_DIR/cron/scripts/saveNewSkins.js"
)

for s in "${scripts[@]}"; do
  node "$s" || exit 1
done

cd "$BASE_DIR/"
docker-compose down --remove-orphans
docker-compose up --build -d
