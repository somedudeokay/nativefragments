export const criticalStyles = `
  :root {
    color-scheme: light;
    --paper: #f7f3e8;
    --surface: #fffdf6;
    --ink: #141414;
    --muted: #5f5a50;
    --green: #1ed760;
    --orange: #ff6b35;
    --line: rgba(20, 20, 20, 0.1);
    --line-strong: rgba(20, 20, 20, 0.24);
    --code: #16181d;
    --container: 1160px;
    --pad: clamp(1.25rem, 5vw, 2.5rem);
    --radius: 14px;
    --radius-pill: 999px;
    --shadow-sm: 0 1px 2px rgba(20, 20, 20, 0.05);
    --shadow-md: 0 10px 30px -12px rgba(20, 20, 20, 0.18);
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
    --display: "Space Grotesk", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    --sans: "Geist", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    --mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
    --accent: var(--green);
  }

  * {
    box-sizing: border-box;
  }

  html {
    background: var(--paper);
    color: var(--ink);
    font-family: var(--sans);
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    touch-action: manipulation;
  }

  body {
    margin: 0;
    overflow-x: hidden;
  }

  a {
    color: inherit;
  }

  :focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 3px;
  }

  .agent-index {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  .layout {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    min-width: 0;
  }

  .layout > *,
  .doc,
  .sidebar {
    min-width: 0;
  }

  .sidebar {
    border-right: 1px solid var(--line);
    height: calc(100vh - 64px);
    overflow: auto;
    padding: 1.75rem 1.1rem;
    position: sticky;
    top: 64px;
  }

  #content-slot {
    min-height: calc(100vh - 64px);
  }

  .doc {
    max-width: 880px;
    padding: clamp(2rem, 5vw, 4.5rem);
  }

  h1 {
    font-family: var(--display);
    font-size: clamp(2.2rem, 4.2vw, 3.2rem);
    font-weight: 700;
    letter-spacing: -0.035em;
    line-height: 1.04;
    margin: 0;
    max-width: 18ch;
  }

  @media (max-width: 860px) {
    .layout {
      grid-template-columns: minmax(0, 1fr);
    }

    .sidebar {
      height: auto;
      position: static;
    }
  }
`;
