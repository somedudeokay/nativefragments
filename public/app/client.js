import { installFragmentNavigation } from "/nativefragments/router.js";
import "/app/components/site-header.js";

installFragmentNavigation({
  afterNavigate() {
    document.querySelector(".sidebar")?.scrollTo({ top: 0 });
    document.querySelector("nf-site-header")?.sync?.();
  },
});
