import { html as lit } from "lit";
import { renderLit } from "@nativefragments/lit/server";
import "../client/components/site-header.js";

export const siteHeader = () =>
  renderLit(lit`<nf-site-header></nf-site-header>`);
