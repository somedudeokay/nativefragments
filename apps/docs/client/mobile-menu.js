// Mobile navigation drawer. The toggle lives in a sticky bottom bar (always
// reachable), and opens the sidebar as a bottom sheet. The bar, scrim, and
// sidebar all live in the shell, so this binds once.
//
// Below the drawer breakpoint the closed sidebar is `inert` (out of the tab
// order and the accessibility tree), and while it is open everything behind it
// is inert instead. On wide screens the sidebar is a normal static column.

const drawerQuery = "(max-width: 860px)";

export const initMobileMenu = () => {
  const root = document.documentElement;
  const toggle = document.querySelector("[data-menu-toggle]");
  const sidebar = document.getElementById("docs-sidebar");
  if (!toggle || !sidebar) return;

  const media = window.matchMedia(drawerQuery);
  const background = () =>
    document.querySelectorAll(
      "#content-slot, nf-site-header, .skip-link, .agent-index",
    );

  const isOpen = () => root.hasAttribute("data-menu-open");

  const sync = () => {
    const drawer = media.matches;
    const open = drawer && isOpen();
    if (!drawer) root.removeAttribute("data-menu-open");
    sidebar.inert = drawer && !open;
    for (const element of background()) element.inert = open;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  const open = () => {
    root.setAttribute("data-menu-open", "");
    sync();
    const first =
      sidebar.querySelector('a[aria-current="page"]') ?? sidebar.querySelector("li a");
    first?.focus();
  };

  const close = ({ restoreFocus = true } = {}) => {
    if (!isOpen()) return;
    const hadFocus = sidebar.contains(document.activeElement);
    root.removeAttribute("data-menu-open");
    sync();
    if (restoreFocus && (hadFocus || document.activeElement === document.body)) {
      toggle.focus();
    }
  };

  toggle.addEventListener("click", () => (isOpen() ? close() : open()));

  document.addEventListener("click", (event) => {
    if (!isOpen()) return;
    if (event.target.closest("[data-menu-close]")) {
      close();
    } else if (event.target.closest(".sidebar li a")) {
      // Following a link: the router (or the search dialog) owns focus next.
      close({ restoreFocus: false });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) close();
  });

  media.addEventListener("change", sync);
  sync();
};
