# Northstar VPS deployment

This deployment runs the web application behind Caddy with PostgreSQL, private MinIO object storage, and Redis on an internal Docker network. Only ports 80 and 443 are public.

## 1. Server and DNS

Use Ubuntu 24.04 or another current Docker-capable Linux distribution with at least 4 vCPU, 8 GB RAM, and 80 GB SSD. Point an `A`/`AAAA` record such as `bank.example.com` to the server. Permit SSH, HTTP, and HTTPS through the firewall.

Install Docker Engine and the Docker Compose plugin, then place this repository at `/opt/northstar`.

## 2. Production configuration

```sh
cd /opt/northstar
cp .env.example .env
chmod 600 .env
```

Replace every placeholder. Generate session/password secrets with `openssl rand -base64 48`. Generate the authenticator seed with `head -c 20 /dev/urandom | base32 | tr -d '='`. Set `NORTHSTAR_HOST` to the real DNS name and keep `SEED_DEMO_DATA=false` for a clean institution.

Never commit `.env`. Verify the Resend sender domain before enabling email delivery.

## 3. First release

```sh
chmod +x scripts/vps-deploy.sh scripts/vps-backup.sh
sudo NORTHSTAR_PROJECT_DIR=/opt/northstar scripts/vps-deploy.sh
```

The migration container creates or upgrades the application schema and seeds only system clearing accounts, default fee rules, branding, and public-site configuration. App startup waits for PostgreSQL, the migration, Redis, and the private object-storage bucket.

Check status with:

```sh
docker compose --env-file .env ps
docker compose --env-file .env logs -f --tail=200 app caddy
curl -fsS https://bank.example.com/api/health/live
curl -fsS https://bank.example.com/api/health/ready
```

## 4. Updates

Pull only reviewed code, then run the same deployment script:

```sh
cd /opt/northstar
git pull --ff-only
sudo NORTHSTAR_PROJECT_DIR=/opt/northstar scripts/vps-deploy.sh
```

The old app container remains available until the replacement is created, but single-host Compose does not provide zero-downtime rolling updates. Schedule a short maintenance window for schema-changing releases.

## 5. Backups

```sh
sudo NORTHSTAR_PROJECT_DIR=/opt/northstar scripts/vps-backup.sh
```

Copy the resulting PostgreSQL and object-storage backup off the server using encrypted storage. Test restoration into a separate empty VPS before relying on the backup. Do not back up PostgreSQL and uploaded documents at unrelated times when statement or KYC consistency matters.

## 6. Existing local data

The local Cloudflare/D1 development database is not the VPS PostgreSQL database. Keep an untouched backup of `.wrangler/state`. Locate the non-metadata `.sqlite` file under `.wrangler/state/v3/d1`, copy it to `/opt/northstar/import/local-d1.sqlite` on the VPS, and stop the app during import.

Only run this against a new target: the importer refuses a PostgreSQL database that already has customers or transactions. If local KYC records exist, copy their corresponding private object-storage objects before confirming the import.

```sh
docker compose --env-file .env stop app
docker compose --env-file .env run --rm \
  -e CONFIRM_EMPTY_TARGET=YES \
  -e CONFIRM_OBJECTS_COPIED=YES \
  -v /opt/northstar/import:/import:ro \
  migrate ./node_modules/.bin/tsx scripts/import-d1-to-postgres.mjs /import/local-d1.sqlite
sudo NORTHSTAR_PROJECT_DIR=/opt/northstar scripts/vps-deploy.sh
```

Compare the importer’s customer, account, and transaction counts with the local portal. Reconcile every account balance and verify uploaded documents before launch. Do not delete the original D1/R2 state until the VPS has passed that review and a VPS backup has been restored successfully elsewhere.

## 7. Security checklist

- Restrict SSH to keys and disable password/root login.
- Keep the admin hostname behind a VPN or IP allowlist when possible.
- Register `ADMIN_TOTP_SECRET` in the staff authenticator before launch.
- Rotate placeholder and development credentials.
- Keep PostgreSQL, Redis, MinIO, and port 4007 unexposed.
- Apply OS and container-image security updates regularly.
- Alert on failed backups, unhealthy containers, repeated admin failures, balance-integrity errors, and privileged transaction corrections.
