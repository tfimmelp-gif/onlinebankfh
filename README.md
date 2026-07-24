# Northstar Simulated Banking Portal

Northstar is a closed-loop banking simulation for training and workflow testing. It never connects to real payment rails and must use synthetic customer data only.

## Local preview

```bash
npm install
npm run dev
```

Customer portal: `/app`  
Staff console: `/admin`  
Staff login: `/admin/login`

## Self-hosted stack

Copy `.env.example` to `.env`, replace every development secret, then start the complete stack:

```bash
docker compose up -d --build
```

PostgreSQL initializes from `db/migrations/0001_initial.sql`. Redis and MinIO remain on the private backend network; Caddy is the public reverse proxy.

## Accounting invariants

- Money is stored in integer USD minor units.
- Posted ledger entries are immutable.
- Every posted transaction must have equal debit and credit totals.
- Corrections are performed by reversal and replacement.
- Stop-code evaluation occurs before ledger posting.
