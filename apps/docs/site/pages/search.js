import { html } from "@nativefragments/core/server";
import { searchPages } from "../search-score.js";

// Server-rendered search: the no-JavaScript fallback for the ⌘K palette. It
// scores the same static index the palette fetches.

const loadIndex = async ({ env, url, signal }) => {
  try {
    const response = await env?.ASSETS?.fetch(
      new URL("/app/search-index.json", url),
      { signal },
    );
    return response?.ok ? await response.json() : [];
  } catch {
    return [];
  }
};

export const searchPage = async (context) => {
  const query = (context.query?.get("q") ?? "").trim();
  const results = query ? searchPages(await loadIndex(context), query) : [];

  return html`<div class="doc-shell">
    <article class="doc">
      <p class="eyebrow">Search</p>
      <h1>Search the docs.</h1>
      <search>
        <form class="search-form" action="/search" method="get">
          <label for="search-q">Search documentation</label>
          <div class="search-form-row">
            <input id="search-q" type="search" name="q" value="${query}" autocomplete="off" spellcheck="false" />
            <button type="submit">Search</button>
          </div>
        </form>
      </search>
      ${query
        ? html`<p class="search-count" role="status">
              ${results.length
                ? `${results.length} ${results.length === 1 ? "page matches" : "pages match"} “${query}”.`
                : `No results for “${query}”.`}
            </p>
            ${results.length
              ? html`<ul class="search-results" role="list">
                  ${results.map(
                    ({ page, headings }) => html`<li>
                      <a class="search-result" href="${page.path}">${page.title}</a>
                      ${page.intro ? html`<p>${page.intro}</p>` : ""}
                      ${headings.length
                        ? html`<ul class="search-sections" role="list">
                            ${headings.map(
                              (heading) =>
                                html`<li><a href="${page.path}#${heading.id}">${heading.text}</a></li>`,
                            )}
                          </ul>`
                        : ""}
                    </li>`,
                  )}
                </ul>`
              : ""}`
        : ""}
    </article>
  </div>`;
};
