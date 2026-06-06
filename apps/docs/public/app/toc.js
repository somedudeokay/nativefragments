// "On this page" behavior: smooth-scroll to a section on click and highlight
// the current section while scrolling. The table of contents is server-rendered
// per page (inside the content slot), so this is re-initialized after each
// fragment navigation.

export const initToc = () => {
  const toc = document.querySelector(".toc");
  if (!toc) return null;

  const links = [...toc.querySelectorAll(".toc-link")];
  const byId = new Map(links.map((link) => [link.dataset.toc, link]));
  const headings = links
    .map((link) => document.getElementById(link.dataset.toc))
    .filter(Boolean);

  toc.addEventListener("click", (event) => {
    const link = event.target.closest(".toc-link");
    if (!link) return;
    const target = document.getElementById(link.dataset.toc);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${link.dataset.toc}`);
  });

  let current;
  const setActive = (id) => {
    if (id === current) return;
    current = id;
    for (const link of links) link.removeAttribute("aria-current");
    byId.get(id)?.setAttribute("aria-current", "true");
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    },
    // Activate a heading once it reaches just under the sticky header.
    { rootMargin: "-72px 0px -72% 0px", threshold: 0 },
  );

  headings.forEach((heading) => observer.observe(heading));
  if (headings[0]) setActive(headings[0].id);

  return observer;
};
