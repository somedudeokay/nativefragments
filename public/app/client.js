import { installFragmentNavigation } from "/nativefragments/router.js";
import "/app/components/site-header.js";

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const replayContentFade = () => {
  if (prefersReducedMotion) return;
  const slot = document.querySelector("#content-slot");
  if (!slot) return;
  slot.style.animation = "none";
  void slot.offsetWidth;
  slot.style.animation = "";
};

installFragmentNavigation({
  afterNavigate() {
    document.querySelector(".sidebar")?.scrollTo({ top: 0 });
    document.querySelector("nf-site-header")?.sync?.();
    replayContentFade();
  },
});
