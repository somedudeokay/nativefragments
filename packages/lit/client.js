// This side-effect module must evaluate before LitElement definitions. It
// teaches LitElement to reuse declarative Shadow DOM emitted by Lit SSR.
import "@lit-labs/ssr-client/lit-element-hydrate-support.js";
