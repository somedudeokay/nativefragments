import "@nativefragments/lit/client";
import "./navigation.js";
import "./components/site-header.js";
import "./components/docs-search.js";
import { initNavIndicator } from "./nav-indicator.js";
import { initToc } from "./toc.js";
import { initMobileMenu } from "./mobile-menu.js";

// The sidebar lives in the shell, so its active indicator persists and slides
// between links as fragments navigate.
const updateNavIndicator = initNavIndicator();

// Sticky bottom bar + drawer for mobile navigation.
initMobileMenu();

// The "On this page" TOC swaps with the content slot, so re-init it per page.
let tocObserver = initToc();

document.addEventListener("nativefragments:navigation-complete", () => {
  updateNavIndicator();
  tocObserver?.disconnect();
  tocObserver = initToc();
});
