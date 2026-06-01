import { html } from "@nativefragments/core/server";
import { code, docPage } from "./blocks.js";

export const gettingStartedPage = () =>
  docPage({
    eyebrow: "Start",
    title: "Create an app.",
    intro:
      "The recommended starting point is the npm create command. It creates a Cloudflare Worker app with routes, a shell, browser helpers, and one Shadow DOM component.",
    body: html`
      <h2>Create</h2>
      ${code(`npm create @nativefragments/app@latest my-app
cd my-app
npm install
npm run dev`)}
      <h2>Deploy</h2>
      ${code(`npm run deploy`)}
      <h2>Generated structure</h2>
      ${code(`worker.js
site/routes.js
site/shell.js
site/pages/home.js
public/app/client.js
public/app/components/app-counter.js
public/nativefragments/router.js
public/nativefragments/component.js`)}
    `,
  });
