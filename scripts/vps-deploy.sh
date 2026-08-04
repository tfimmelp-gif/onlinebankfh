#!/usr/bin/env sh
set -eu

PROJECT_DIR="${NORTHSTAR_PROJECT_DIR:-/opt/northstar}"
cd "$PROJECT_DIR"

if [ ! -f .env ]; then
  echo "Missing $PROJECT_DIR/.env. Copy .env.example and configure production secrets first." >&2
  exit 1
fi

chmod 600 .env
docker compose --env-file .env config --quiet
docker compose --env-file .env build --pull app migrate
docker compose --env-file .env up -d --remove-orphans

attempt=0
until docker compose --env-file .env exec -T app wget -qO- http://127.0.0.1:4007/api/health/ready >/dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 30 ]; then
    docker compose --env-file .env ps
    docker compose --env-file .env logs --tail=150 app migrate
    echo "Northstar did not become ready within five minutes." >&2
    exit 1
  fi
  sleep 10
done

docker compose --env-file .env ps
echo "Northstar release is healthy."

