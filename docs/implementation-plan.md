# Framework hardening delivered in 0.8

All six architecture recommendations from the September 29 review are implemented:

1. Navigation transactions own DOM/history/focus commits and restore named targets.
2. Protocol 2 preserves redirect cookies; failing error observers are contained.
3. Request preparation supplies locals, bindings and execution context consistently.
4. Transport owns bounded cache policy, expiry, shared consumers and alias invalidation.
5. Release gates cover browser contracts, public types, npm tarballs and workerd.
6. The existing create-app package shares build/HTTP tooling; CONTEXT.md and ADR 0001
   record current ESM/esbuild/Lit policy and generated asset revalidation.

Worker disposal, HTML trust documentation, public type exports and runtime
cancellation checks complete the smaller follow-ups. Fieldwork adds a real D1
example with migrations, isolated authentication, mutations and recovery keys.

Streaming fixes cover partial parser payloads, response-scoped identities, stale
observers, cached reveal replay, declarative shadow-root hydration, shared HTTP
streaming and event-based gallery telemetry. Named targets exclude navigation
links. No-JavaScript fallbacks are visible, including under strict CSP. Inline reveal programs remain literal source through production bundling;
function serialization must not capture injected keepNames helpers.

See packages/core/docs/migration-0.8.md for contracts and upgrade guidance,
apps/task-board/README.md for operations, and release-0.8-validation.json for
recorded evaluations. The original HTML review remains a historical assessment;
its “unfixed” statements describe the state before this implementation.
