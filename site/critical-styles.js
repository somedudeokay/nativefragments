export const criticalStyles = `
  :root {
    color-scheme: light;
    --paper: #f7f3e8;
    --ink: #111111;
    --muted: #5f5a50;
    --green: #1ed760;
  }

  * {
    box-sizing: border-box;
  }

  html {
    background: var(--paper);
    color: var(--ink);
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    touch-action: manipulation;
  }

  body {
    margin: 0;
  }

  a {
    color: inherit;
  }

  .skip-link {
    background: var(--green);
    color: var(--ink);
    left: 1rem;
    padding: 0.5rem 0.75rem;
    position: fixed;
    top: -4rem;
    z-index: 20;
  }

  .skip-link:focus {
    top: 1rem;
  }

  #content-slot {
    min-height: calc(100vh - 64px);
  }

  .hero {
    display: grid;
    gap: clamp(2rem, 5vw, 4rem);
    grid-template-columns: minmax(0, 1fr) minmax(320px, 0.88fr);
    padding: clamp(1.5rem, 3vw, 2.75rem) clamp(1rem, 5vw, 4rem);
  }

  .hero-copy {
    align-self: end;
    max-width: 850px;
  }

  .eyebrow {
    align-self: start;
    border: 1px solid var(--ink);
    display: inline-block;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.75rem;
    font-weight: 800;
    justify-self: start;
    margin: 0 0 1rem;
    padding: 0.35rem 0.5rem;
    text-transform: uppercase;
  }

  h1,
  h2 {
    font-family: Georgia, "Times New Roman", serif;
    line-height: 0.96;
    margin: 0;
  }

  h1 {
    font-size: clamp(3.6rem, 6.5vw, 5.8rem);
    max-width: 11ch;
  }

  .lede {
    color: var(--muted);
    font-size: clamp(1.1rem, 2vw, 1.45rem);
    line-height: 1.45;
    max-width: 720px;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 2rem;
  }

  .primary-action,
  .secondary-action {
    border: 1px solid var(--ink);
    font-weight: 900;
    padding: 0.85rem 1rem;
    text-decoration: none;
    text-transform: uppercase;
  }

  .primary-action {
    background: var(--green);
  }

  @media (max-width: 900px) {
    .hero {
      grid-template-columns: 1fr;
    }

    h1 {
      font-size: clamp(3.25rem, 15vw, 5.75rem);
    }
  }
`;
