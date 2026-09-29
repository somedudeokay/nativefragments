# Fieldwork: private tasks on Cloudflare D1

Live: https://task-board.nativefragments.org

A persistent example of request-scoped authentication, native POST actions,
enhanced mutations, cache invalidation, named target filters and deferred HTML.

Create a workspace to receive a 256-bit recovery key. Keep it private: it is the
credential for reopening that workspace. Only SHA-256 hashes of recovery keys and
session tokens are stored. Sessions expire after seven days; signing out revokes
the current session. Cookies are HttpOnly, SameSite=Lax and Secure on HTTPS.

All task reads/writes include the workspace ID. POSTs require a same-origin
Origin header, URL-encoded bodies (maximum 4 KiB), and validated fields. Each
workspace holds up to 100 tasks. Signup/login use a Workers rate limiter. This
example intentionally uses recovery keys instead of email delivery, passwords,
OAuth or a shared demo account. Losing the key means losing access.

## Develop

From the repository root:

```sh
npm install
npm run db:local -w apps/task-board
npm run dev -w apps/task-board
```

`npm test -w apps/task-board` creates an ephemeral workerd/D1 database and verifies
isolation, CSRF, mutations, session revocation and recovery. `npm run test:browser`
also exercises the complete flow with and without JavaScript in all three engines.
Test databases are separate from local Wrangler state and production.

## Deploy and operate

```sh
npm run db:remote -w apps/task-board
npm run deploy -w apps/task-board
```

The configured D1 database is `nativefragments-task-board` in Western Europe.
Migration 0001 creates workspaces, sessions and tasks with indexes and foreign keys.
Apply migrations before deploying. No external credentials or Hetzner services
are needed. Use normal D1 backup/Time Travel procedures before future schema changes.

Authentication HTML and JSON use private, no-store. The client invalidates cached
fragments after every successful mutation. Do not log recovery keys, session
tokens, cookies or request bodies. Expired sessions are pruned during new sign-in.
Workspaces persist until explicitly removed by their operator; there is no automated
retention policy, recovery-email service or account administration UI in this example.
