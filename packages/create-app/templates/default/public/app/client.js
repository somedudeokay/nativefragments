import { installFragmentNavigation } from "/nativefragments/router.js";
import "./components/app-counter-panel.js";
import "./components/app-header.js";

installFragmentNavigation({
  afterNavigate({ url }) {
    window.dispatchEvent(
      new CustomEvent("nativefragments:navigate", {
        detail: { url: url.href },
      }),
    );
  },
});
