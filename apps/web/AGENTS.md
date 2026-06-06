# nativefragments.org

This repo contains the Native Fragments docsite Worker.

## Structure

- `worker.js`: Cloudflare Worker entrypoint.
- `site`: route manifest, shell, page renderers, and server-side code helpers.
- `public/app`: docsite browser modules and styles.
- `public/nativefragments`: browser helper assets served by the app.

The framework core lives in the separate `nativefragments` repo and is consumed
as `@nativefragments/core`.

## Rendering Preference

For any custom element that is visible in the initial viewport or affects page
layout, server-render its Shadow DOM with `declarativeShadow()` and hydrate it
with `shadow()` in the browser. Do not send an empty custom element shell and
fill it only after the client module loads; that creates FOUC and layout shift.

When a component needs the same markup on the server and client, put its HTML
and CSS in a shared template module so the server output and hydrated component
stay identical.
