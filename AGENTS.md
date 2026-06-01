# nativefragments.org

This repo contains the Native Fragments docsite Worker.

## Structure

- `worker.js`: Cloudflare Worker entrypoint.
- `site`: route manifest, shell, page renderers, and server-side code helpers.
- `public/app`: docsite browser modules and styles.
- `public/nativefragments`: browser helper assets served by the app.

The framework core lives in the separate `nativefragments` repo and is consumed
as `@nativefragments/core`.
