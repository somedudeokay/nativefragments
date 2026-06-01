import { installFragmentNavigation } from "/nativefragments/router.js";
import "./components/site-header.js";
import "./components/runtime-map.js";

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const revealAll = () => {
  document
    .querySelectorAll("#content-slot > section")
    .forEach((section) => section.classList.add("is-visible"));
};

let observer;

const setupReveal = () => {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealAll();
    return;
  }

  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
  );

  document
    .querySelectorAll("#content-slot > section:not(.hero)")
    .forEach((section) => observer.observe(section));
};

setupReveal();

installFragmentNavigation({
  afterNavigate() {
    document.querySelector("nf-site-header")?.sync?.();
    setupReveal();
  },
});
