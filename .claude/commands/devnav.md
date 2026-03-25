Update the Dev Navigator registry. Read these files first:

1. Read `docs/dev-navigator-spec.md` (registry audit workflow + maintenance rules)

Then execute the Registry Audit Workflow:
1. Cross-check routes (`src/app/**/page.tsx`) against `src/lib/state-registry.ts`
2. Cross-check interactive states in page code against registered variants
3. Cross-check against `screenshots/screenshot-catalog.md`
4. Fix gaps: add missing entries, wire `?state=` support
5. Verify TypeScript compiles (`npx tsc --noEmit`)
6. Report summary
