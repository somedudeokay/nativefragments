# Native Fragments

Native Fragments serves useful HTML, then enhances native links and forms with
fragment navigation. Core has no runtime dependencies. Lit is an optional adapter.

- A **route** renders a document body and metadata and may own a POST action.
- A **fragment** is a named server renderer and a matching non-interactive target.
- A **deferred fragment** starts with a loading boundary and resolves on the same response.
- A **navigation transaction** owns permission to commit a target, history and focus.
- A **request scope** carries request, env, execution context, locals and cancellation.

Source is standard ESM. Applications use esbuild through the create-app package;
there is no framework compiler. See [the architecture decision](docs/adr/0001-runtime-and-tooling.md),
[the 0.8 migration](packages/core/docs/migration-0.8.md), and
[the D1 example](apps/task-board/README.md).

Run `npm run verify` before release. It includes Node/runtime tests, strict public
types, Chromium/Firefox/WebKit contracts, and a clean packed scaffold install.
