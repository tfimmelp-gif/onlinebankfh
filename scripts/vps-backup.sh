#!/usr/bin/env sh
set -eu

PROJECT_DIR="${NORTHSTAR_PROJECT_DIR:-/opt/northstar}"
BACKUP_ROOT="${NORTHSTAR_BACKUP_DIR:-/var/backups/northstar}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
TARGET="$BACKUP_ROOT/$STAMP"

cd "$PROJECT_DIR"
mkdir -p "$TARGET"
chmod 700 "$BACKUP_ROOT" "$TARGET"

docker compose --env-file .env exec -T postgres pg_dump \
  --username northstar --dbname northstar --format=custom --no-owner --no-acl > "$TARGET/postgres.dump"
docker compose --env-file .env exec -T minio tar -C /data -czf - . > "$TARGET/object-storage.tar.gz"
cp .env.example "$TARGET/environment-template.txt"

sha256sum "$TARGET/postgres.dump" "$TARGET/object-storage.tar.gz" > "$TARGET/SHA256SUMS"
chmod 600 "$TARGET"/*
echo "Backup created at $TARGET. Encrypt and copy it off the VPS."

