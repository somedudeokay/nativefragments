// Mobile navigation drawer. The toggle lives in a sticky bottom bar (always
// reachable), and opens the sidebar as a bottom sheet. The bar, scrim, and
// sidebar all live in the shell, so this binds once.

export const initMobileMenu = () => {
  const root = document.documentElement;
  const toggle = document.querySelector("[data-menu-toggle]");
  if (!toggle) return;

  const isOpen = () => root.hasAttribute("data-menu-open");

  const open = () => {
    root.setAttribute("data-menu-open", "");
    toggle.setAttribute("aria-expanded", "true");
  };

  const close = () => {
    root.removeAttribute("data-menu-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => (isOpen() ? close() : open()));

  document.addEventListener("click", (event) => {
    if (!isOpen()) return;
    // Close on scrim tap or after following a nav link inside the drawer.
    if (event.target.closest("[data-menu-close]") || event.target.closest(".sidebar a")) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) close();
  });
};
