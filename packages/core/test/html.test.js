import assert from "node:assert/strict";
import test from "node:test";
import {
  attrs,
  html,
  jsonScript,
  raw,
} from "../src/server/index.js";

test("plain interpolated strings are escaped", () => {
  const rendered = String(html`<p>${`<>&"'`}</p>`);

  assert.equal(rendered, "<p>&lt;&gt;&amp;&quot;&#39;</p>");
});

test("nested html composes without raw or double escaping", () => {
  const child = html`<strong>${"Ready & waiting"}</strong>`;
  const rendered = String(html`<p>${child}</p>`);

  assert.equal(rendered, "<p><strong>Ready &amp; waiting</strong></p>");
});

test("arrays of html flatten and arrays of strings escape each item", () => {
  const rendered = String(html`<ul>${[
    html`<li>${"One & done"}</li>`,
    "<li>Two</li>",
  ]}</ul>`);

  assert.equal(
    rendered,
    "<ul><li>One &amp; done</li>&lt;li&gt;Two&lt;/li&gt;</ul>",
  );
});

test("empty-ish values disappear while zero renders", () => {
  const rendered = String(html`<p>${null}${undefined}${false}${0}</p>`);

  assert.equal(rendered, "<p>0</p>");
});

test("String(html`...`) returns rendered markup", () => {
  assert.equal(String(html`<p>${"ok"}</p>`), "<p>ok</p>");
});

test("raw of a RAW value is a passthrough", () => {
  const rendered = html`<p>Trusted</p>`;

  assert.equal(raw(rendered), rendered);
});

test("jsonScript escapes script terminators", () => {
  const rendered = String(html`<script>${raw(jsonScript({ value: "</script>" }))}</script>`);

  assert.doesNotMatch(rendered, /<\/script><\/script>/);
  assert.match(rendered, /\\u003c\/script>/);
});

test("attrs rejects unsafe attribute names", () => {
  assert.throws(
    () => attrs({ "x onmouseover": "alert(1)" }),
    /Invalid HTML attribute name: x onmouseover/,
  );
});
