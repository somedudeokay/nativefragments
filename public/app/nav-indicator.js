// Sliding active indicator for the docs sidebar. The sidebar is part of the
// shell and is never re-rendered on fragment navigation, so a single absolutely
// positioned pill persists and slides between links as the route changes.

const normalize = (pathname) => pathname.replace(/\/+$/, "") || "/";

export const initNavIndicator = () => {
  const sidebar = document.querySelector(".sidebar");
  const links = sidebar ? [...sidebar.querySelectorAll("a")] : [];
  if (!sidebar || !links.length) return () => {};

  const indicator = document.createElement("span");
  indicator.className = "nav-indicator";
  indicator.setAttribute("aria-hidden", "true");
  sidebar.prepend(indicator);
  sidebar.dataset.sliding = "true";

  const activeLink = () => {
    const here = normalize(window.location.pathname);
    return links.find((link) => normalize(new URL(link.href).pathname) === here);
  };

  const update = () => {
    const link = activeLink();
    for (const a of links) a.removeAttribute("aria-current");

    if (!link) {
      indicator.style.opacity = "0";
      return;
    }

    link.setAttribute("aria-current", "page");
    indicator.style.opacity = "1";
    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.height = `${link.offsetHeight}px`;
    indicator.style.transform = `translate(${link.offsetLeft}px, ${link.offsetTop}px)`;
  };

  update();
  // Enable the slide transition only after the first position is painted, so it
  // does not animate in from the top-left corner on load.
  requestAnimationFrame(() => {
    indicator.dataset.ready = "";
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(update, 100);
  });

  return update;
};
