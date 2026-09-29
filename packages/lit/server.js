import { renderThunked } from "@lit-labs/ssr";
import { collectResult } from "@lit-labs/ssr/lib/render-result.js";
import { raw } from "@nativefragments/core/server";

/**
 * Render a Lit template or component tree to trusted server HTML.
 *
 * Component modules must be imported by the Worker so their custom element
 * definitions are registered in Lit's server DOM shim.
 *
 * @param {unknown} value Lit template value to render.
 * @returns {Promise<import("@nativefragments/core/server").RawHtml>}
 */
export const renderLit = async (value) =>
  raw(await collectResult(renderThunked(value)));
