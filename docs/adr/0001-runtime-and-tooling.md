# Runtime, navigation and tooling boundaries

Accepted 2026-09-29.

Core owns HTML, request context, protocol negotiation, routing and Worker RPC.
The browser loader owns framing, subscriber independence, bounded cache and
redirect aliases. Navigation transactions decide whether DOM/history/focus may
commit. DOM parsing materializes declarative shadow roots before connection.
These are private modules; the public browser surface remains startRouter().

Protocol 2 uses a redirect envelope for recognized fragment GET requests. The
browser receives Set-Cookie before fetching the next same-origin URL. Native and
legacy clients retain ordinary redirects; unsupported versions receive buffered
HTML. Server and client should be deployed together.

Lit SSR/hydration is optional and lives in @nativefragments/lit. Core never imports
Lit. Shared rendering modules contain no browser-only top-level work.

Applications use standard ESM and a small esbuild wrapper exported by the existing
create-app package. Browser workers are explicit `nativefragments.workers` entries
in package.json. Source files stay portable; generated output is ignored.

Build filenames are stable (`/build/client.js`, explicit worker names). Serve them
with `Cache-Control: public, max-age=0, must-revalidate`, never immutable caching.
Wrangler deployment uploads worker and assets together. A future hashed manifest
is optional, not part of this release. Old tabs negotiate a safe buffered response.

The previous zero-build/shadow() work order is historical. Current guidance is
CONTEXT.md, this decision, package AGENTS.md and the shipped framework skill.
