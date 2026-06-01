# @nativefragments/create-app

## 0.4.0

### Minor Changes

- 1ab7c54: Update the default app template with a persistent shell header, shared state,
  refresh-safe counter persistence, nested partial rerenders, and fragment-safe
  declarative Shadow DOM hydration. Polish the scaffold copy and header clock
  treatment around state and partial rerender demos, including correct
  server-rendered tab indicator state, path-based nested subroutes, and fade-only
  nested panel transitions. Replace the starter hero titles with a concise
  feature list covering pure HTML, isolated styles, nested routes, reactive state,
  partial rerenders, server-side rendering, and zero dependencies.

## 0.3.0

### Minor Changes

- 157ae05: Update the scaffold to `@nativefragments/core` 0.3 and include the latest fragment router with prefetch and declarative manifest support.

## 0.2.1

### Patch Changes

- Made the generated app self-contained for signal browser helpers while keeping install dependencies minimal.

## 0.2.0

### Minor Changes

- Added Hono API routing to the scaffold.
- Added nested-fragment capable router helpers.
- Added worker RPC helpers.
- Updated the starter counter to use signal-based DOM bindings.
