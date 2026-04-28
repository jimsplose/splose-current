# Splose Practice Management Prototype

A high-fidelity UI prototype of [Splose](https://splose.com) — practice management software for allied health professionals.

Built with Next.js 16, React 19, TypeScript, Prisma 7, Turso, AntD 5, and CSS Modules.

**Live:** [splose-current.vercel.app](https://splose-current.vercel.app) · **Production ref:** [acme.splose.com](https://acme.splose.com)

---

## Work queue

Issues are numbered in execution order. Work top-to-bottom. Issues with parallel markers (`∥`) can run simultaneously. Dependency notes explain what blocks each item.

> **Session command:** `/work` — picks up the next unblocked issue, shows context, runs the session, and documents completion.

### Roadmap (highest priority)

| # | Title | Depends on |
|---|---|---|
| [#25](https://github.com/jimsplose/splose-current/issues/25) | Monorepo alignment roadmap — make splose-current a credible POC for monorepo engineers | — |

### Active work

| # | Title | Parallel | Depends on |
|---|---|---|---|
| [#7](https://github.com/jimsplose/splose-current/issues/7) | DS removal: Replace DS Button wrapper with AntD Button | ∥ with #8, #9 | — |
| [#8](https://github.com/jimsplose/splose-current/issues/8) | DS removal: Replace DataTable/Td/Th with AntD Table columns | ∥ with #7, #9 | — |
| [#9](https://github.com/jimsplose/splose-current/issues/9) | DS removal: Finish Icon wrapper removal + remove Tag wrapper | ∥ with #7, #8 | — |
| [#10](https://github.com/jimsplose/splose-current/issues/10) | AntD Form adoption — settings pages | — | #7 |
| [#11](https://github.com/jimsplose/splose-current/issues/11) | AntD Form adoption — all remaining form pages | — | #7, #10 |
| [#12](https://github.com/jimsplose/splose-current/issues/12) | Inline style reduction — invoice pages | ∥ with #13 | #8 |
| [#13](https://github.com/jimsplose/splose-current/issues/13) | Inline style reduction — settings high-count pages | ∥ with #12 | #10 |
| [#14](https://github.com/jimsplose/splose-current/issues/14) | Inline style reduction — notes, waitlist, forms + mid-count sweep | — | #9, #11 |
| [#15](https://github.com/jimsplose/splose-current/issues/15) | Delete deprecated DS components + final verification | — | #7–#14 all done |

### Storybook documentation

| # | Title | Depends on |
|---|---|---|
| [#17](https://github.com/jimsplose/splose-current/issues/17) | Storybook: Component inventory — stories for every AntD, extended, and custom component | #15 |
| [#18](https://github.com/jimsplose/splose-current/issues/18) | Storybook: Chrome MCP live screenshots — all component usage contexts | #17 |
| [#19](https://github.com/jimsplose/splose-current/issues/19) | Storybook: MDX documentation — all components with screenshots, references, usage links | #18 |

### Design Review System

| # | Title | Depends on |
|---|---|---|
| [#20](https://github.com/jimsplose/splose-current/issues/20) | Design Review System — API proxy, Bugshot, Page Capture, DevNavigator Requests panel | #15–#19 |

---

## Architecture decisions

**Component strategy (as of 2026-04-23):**

| Layer | Approach |
|---|---|
| All interactive controls | AntD components directly — `Button`, `Input`, `Select`, `DatePicker`, `Table`, etc. |
| Form validation | AntD `Form.useForm()` + `Form.Item` with `rules` — no local error state |
| Styling | AntD `ConfigProvider` theme tokens in `src/components/ds/theme.ts` |
| Page layout | CSS Modules per file — `Page.module.css` |
| Type scale / typography | `<Text>` DS component — 20+ variants AntD Typography doesn't cover |
| User-config hex colors | `pickTextColor()` from `src/lib/color.ts` |
| AU phone formatting | `formatAustralianPhone()` from `src/lib/format.ts` |

**Deprecated DS wrappers** (being removed in #7–#15):
`Button` · `Icon` · `Tag` · `FormLabel` · `PhoneInput` · `DataTable/Td/Th/Tr`

**Kept DS components** (genuine added value):
`Text` · `Badge` · `PatientAvatar` · `AppointmentCard` · `PaymentStatusBadge` · `Sparkline` · `ColorDot` · `Stat` · `EmptyState` · `Skeleton` · `List` · `HintIcon` · `Avatar` · `ProgressBar` · page templates (`ListPage`, `DetailPage`, `FormPage`, `SettingsListPage`) · overlays · navigation

---

## Development

```bash
npm run dev         # localhost:3000
npm run storybook   # localhost:6006
npx tsc --noEmit    # type check
npx next build      # production build check
```

**See [CLAUDE.md](./CLAUDE.md) for full development documentation.**

---

## Key docs

| Doc | Purpose |
|---|---|
| `docs/reference/ds-component-catalog.md` | Every DS + AntD component, props, when to use |
| `docs/quality-gate.md` | Chrome MCP verification protocol |
| `docs/reference/measurement-protocol.md` | Measurement snippets + thresholds |
| `docs/agent-block.md` | Subagent prompt template |
| `docs/route-mapping.md` | localhost ↔ production URL pairs |
| `docs/git-workflow.md` | Session start/end git protocol |
