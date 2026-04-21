# Toast build plan

**Phase:** 1
**Status:** Planned
**Estimated size:** M
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A short, auto-dismissing notification pinned to a screen corner, confirming an action succeeded or warning that one failed. Used for "Invoice saved", "Client archived", "Couldn't connect to Stripe" — non-blocking confirmations and errors. Not for blocking questions (use `AlertDialog`) or for inline field errors (use `FormField` error prop).

## API

Imperative, not JSX. That's the only API shape that survives contact with our server actions and route handlers.

```ts
import { toast } from "@/components/ds";

toast.success("Invoice saved");
toast.error("Couldn't reach Stripe", { description: "Retrying in 5s." });
toast.info("Preview generated");
toast.promise(createInvoice(), {
  loading: "Saving invoice...",
  success: "Invoice saved",
  error: (err) => `Couldn't save: ${err.message}`,
});
```

Options passed per call:

```ts
interface ToastOptions {
  description?: string;
  duration?: number;           // ms, default 4000; pass Infinity to pin
  action?: { label: string; onClick: () => void };
  id?: string;                 // dedupe / update by ID
}
```

A single `<Toaster />` gets mounted once, high in the tree (probably in `src/app/layout.tsx`), configured with position and the default icon/colour set.

## What it extends

`sonner` (https://sonner.emilkowal.ski). AntD has `message` and `notification`, but both suffer from stale AntD v4 styling, poor TypeScript ergonomics, and no first-class `promise` helper. Sonner is purpose-built, tiny (~3KB gz), Radix-adjacent in quality, and is what the ecosystem has converged on. Wrap sonner so the DS owns the look and API shape — call sites never import from `sonner` directly.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — no toasts were on-screen during the walk; they appear only briefly after user actions. Manually triggered toasts could be observed by performing an action (e.g. save a setting) during the build session.

- `https://acme.splose.com/settings/details` — saving a setting renders a brief confirmation toast (AntD default style, bottom-left on current production).
- `https://acme.splose.com/invoices` — toggling invoice status renders an inline toast.

## Measurement targets

TBC from production — trigger a toast on both tabs during the build session. Expected defaults for the Splose wrapper (lean on sonner's design tokens rather than AntD's message styling — AntD's is dated):

- Card: `8px` border-radius, `1px solid var(--color-border)`, white bg, `0 4px 16px rgba(0,0,0,0.08)` shadow.
- Padding: `12px 16px`.
- Typography: title `body/md-strong` (14px/600), description `caption/md` (12px/400, secondary colour).
- Icon: 16px, positioned 12px from left edge, vertically centred with title.
- Tone colours: success `var(--color-success)` (≈ `rgb(0, 200, 135)`), danger `var(--color-danger)`, warning `var(--color-warning)`, info `var(--color-primary)`.
- Default position: `bottom-right`. Configurable per `<Toaster />` mount.
- Default duration: `4000ms`. Error toasts default to `6000ms`.

## Accessibility

- Sonner uses `role="status"` for info/success and `role="alert"` for error toasts. Verify this behaviour survives our wrapper.
- Keep descriptions under ~120 chars so screen readers finish speaking before the toast auto-dismisses.
- Action buttons must be keyboard reachable — Tab into them while the toast is visible.
- Respect `prefers-reduced-motion` for enter/exit animations.
- Pause auto-dismiss on keyboard focus of the toast card. Sonner does this out of the box.

## Visual states

- Success (green icon, auto-dismiss 4s)
- Error (red icon, auto-dismiss 6s)
- Warning (yellow icon)
- Info (neutral/brand icon)
- Loading (spinner icon, no auto-dismiss)
- With action button
- With description (two-line)
- Hover-paused (auto-dismiss timer frozen)

## Stories to build

- **Playground:** args-driven button that fires a toast with selected tone, description, action, duration.
- **Feature stories:**
  - `Success`, `Error`, `Warning`, `Info`, `Loading` — one story each, each with a "Trigger" button.
  - `WithAction` — "Undo" link in a toast.
  - `Promise` — button that fires a fake promise; toast goes loading → success.
  - `Dedupe` — firing the same `id` twice only shows one toast.
- **Recipe stories:**
  - `SaveConfirmation` — `// Source: acme.splose.com/settings/details — save toast on change`
  - `FailedActionWithRetry` — `// Source: planned — error toast with "Retry" action button, matching the Stripe retry flow`

## MDX docs outline

- H1: Toast
- When to use — non-blocking action confirmations, transient errors.
- When not to use — blocking questions (use `AlertDialog`), validation errors (use `FormField`), anything that needs to be acknowledged before the user can continue.
- Variants — tones, with action, promise.
- Composition — how to mount `<Toaster />` in layout, how to call `toast.*` from server actions (via `revalidate + useActionState` redirect, or from a client component effect).
- Accessibility — roles, durations, focus behaviour.
- Sizing — max-width cap around `400px` so toasts don't monopolise wide viewports.

## Acceptance criteria

- [ ] `<Toaster />` mounted in `src/app/layout.tsx` with `position="bottom-right"`, `richColors`, and DS tokens applied.
- [ ] `toast.success / error / warning / info / loading / promise / dismiss` exported from `@/components/ds`.
- [ ] One real consumer migrated end-to-end to prove the API works (suggest: the save handler on `src/app/settings/ai/page.tsx`).
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.

## Open questions

1. Does the repo already add `sonner` as a dep, or is this the first consumer? If first, add with `npm install sonner` and commit the lockfile in the same session.
2. ~~Confirm the default corner.~~ **Resolved 2026-04-22 (D1): `bottom-right`.**
3. Should `toast.error` default to a **6s** duration, or match `success` at 4s? Error toasts need more time to read, so suggest keeping the 6s split.
