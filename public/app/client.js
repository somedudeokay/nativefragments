import { installFragmentNavigation } from "/nativefragments/router.js";
import "/app/components/site-header.js";
import "/app/components/docs-search.js";
import { initNavIndicator } from "/app/nav-indicator.js";

// The sidebar lives in the shell, so its active indicator persists and slides
// between links as fragments navigate.
const updateNavIndicator = initNavIndicator();

// Expose the fragment navigate function so <docs-search> can deep-link to a
// heading without a full page reload.
window.__nfNavigate = installFragmentNavigation({
  afterNavigate() {
    updateNavIndicator();
    document.querySelector("nf-site-header")?.sync?.();
  },
});
