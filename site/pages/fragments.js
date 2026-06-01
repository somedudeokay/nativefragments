import { html } from "@nativefragments/core/server";
import { code, docPage } from "./blocks.js";

export const fragmentsPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "Fragments keep the document alive.",
    intro:
      "Normal requests return a full HTML document. Client navigations request only the route body and metadata with the x-fragment header.",
    body: html`
      <h2>Install navigation</h2>
      ${code(`import { installFragmentNavigation } from "/nativefragments/router.js";

installFragmentNavigation({
  afterNavigate({ meta, url }) {
    console.log(meta.title, url.pathname);
  }
});`)}
      <h2>Why it matters</h2>
      <p>
        The app keeps browser-native navigation semantics: real links, real
        history, real HTML. JavaScript upgrades navigation without owning the
        whole page.
      </p>
    `,
  });
