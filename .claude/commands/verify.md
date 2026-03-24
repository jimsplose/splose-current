Run a full visual verification sweep. Read these files first:

1. Read `docs/visual-verification-sweep.md` (the procedure)
2. Read `screenshots/screenshot-catalog.md` (current match status)
3. Read `src/lib/state-registry.ts` (all pages and state variants)

Ask the user for duration: Quick (2-3 sections), Standard (5-6), Extended (autonomous), or Until done.

Then execute the workflow. Use Chrome MCP for ALL screenshot capture and comparison. Do NOT use Puppeteer, pixel-diff, or headless browser scripts.
