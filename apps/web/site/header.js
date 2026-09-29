import { html as lit } from "lit";
import { renderLit } from "@nativefragments/lit/server";
import "../client/components/site-header.js";

export const siteHeader = ({ activePath = "/" } = {}) =>
  renderLit(lit`<nf-site-header active-path=${activePath}></nf-site-header>`);
