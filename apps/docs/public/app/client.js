import { installFragmentNavigation } from "/nativefragments/router.js";
import "/app/components/site-header.js";
import "/app/components/docs-search.js";
import { initNavIndicator } from "/app/nav-indicator.js";
import { initToc } from "/app/toc.js";

// The sidebar lives in the shell, so its active indicator persists and slides
// between links as fragments navigate.
const updateNavIndicator = initNavIndicator();

// The "On this page" TOC swaps with the content slot, so re-init it per page.
let tocObserver = initToc();

// Expose the fragment navigate function so <docs-search> can deep-link to a
// heading without a full page reload.
window.__nfNavigate = installFragmentNavigation({
  afterNavigate() {
    updateNavIndicator();
    tocObserver?.disconnect();
    tocObserver = initToc();
    document.querySelector("nf-site-header")?.sync?.();
  },
});
