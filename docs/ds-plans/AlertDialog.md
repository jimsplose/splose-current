# AlertDialog build plan

**Phase:** 2
**Status:** Done
**Estimated size:** S
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A blocking confirmation overlay for destructive or consequential actions — "Delete client?", "Cancel invoice?", "Send note to patient?". Differs from `Modal` in purpose: `Modal` hosts arbitrary content; `AlertDialog` asks one question and closes with a decision. It should be imperative to call (like `Toast`), so destructive guards don't need a bag of state per call site.

## API

Imperative:

```ts
import { alertDialog } from "@/components/ds";

const confirmed = await alertDialog.confirm({
  title: "Delete Harry Nguyen?",
  description: "This client and their notes, invoices, and files will be permanently deleted. This can't be undone.",
  confirmLabel: "Delete",
  cancelLabel: "Cancel",
  tone: "danger",          // primary | danger | warning
});

if (confirmed) { /* perform delete */ }
```

Declarative escape hatch for anything that needs custom content (rare):

```tsx
<AlertDialog.Root open={open} onOpenChange={setOpen}>
  <AlertDialog.Title>...</AlertDialog.Title>
  <AlertDialog.Description>...</AlertDialog.Description>
  <AlertDialog.Footer>
    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
    <AlertDialog.Action onClick={...}>Delete</AlertDialog.Action>
  </AlertDialog.Footer>
</AlertDialog.Root>
```

Options for the imperative API:

```ts
interface ConfirmOptions {
  title: string;
  description?: ReactNode;
  confirmLabel?: string;         // default "Confirm"
  cancelLabel?: string;          // default "Cancel"
  tone?: "primary" | "danger" | "warning";   // default "primary"
  icon?: ReactNode;              // default icon per tone
}
```

## What it extends

AntD `Modal` with a `type="confirm"`-style configuration. Decision 2026-04-22: keep AntD as the single overlay foundation across the DS (A2 resolution). The Splose wrapper:

- Imperative API is implemented via AntD's `Modal.confirm()` — returns a promise-like resolver so call sites can `await`.
- Declarative API wraps `<Modal />` with opinionated defaults: `closable={false}`, `maskClosable={false}` (overlay click does NOT close), and a fixed Cancel → Action button pair in the footer.
- Tones (primary/danger/warning) set the icon and the Action button's variant.
- Mount is not needed — AntD's Modal methods portal into `document.body` without a provider.

If during the build we find the a11y behaviour of AntD's confirm modal falls short (e.g. focus starts on Action, not Cancel), we patch via a small `onVisibleChange` handler that re-focuses the Cancel button after render. Document any such patch in the plan's Open questions at the close of the build.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — confirmation dialogs don't render in the default state. They trigger on destructive actions.

- `https://acme.splose.com/patients/446604/details` — "Archive" button triggers a confirmation.
- `https://acme.splose.com/invoices` — "Cancel invoice" action confirms.
- `https://acme.splose.com/settings/services` — deleting a service confirms.
- `https://acme.splose.com/notes/{id}/edit` — "Discard changes" confirms before leaving.

## Measurement targets

TBC from production — capture during the build session by firing a delete action on both tabs. Expected defaults:

- Card: white, `12px` border-radius, `0 10px 30px rgba(0,0,0,0.12)` shadow.
- Max-width: `440px`.
- Overlay: `rgba(0, 0, 0, 0.45)`.
- Padding: `24px`.
- Title typography: `heading/md` (16px/600).
- Description typography: `body/md` (14px/400, secondary colour).
- Icon: 20px, tone-coloured (danger = red, warning = yellow, primary = brand).
- Footer: 16px gap, right-aligned, Cancel → Confirm order (Confirm is the primary destination).
- Animation: 160ms fade-in overlay, 160ms scale-up card (95% → 100%).

## Accessibility

- AntD Modal renders with `role="dialog"`, `aria-modal="true"`; for alert-style we upgrade to `role="alertdialog"` via the `modalRender` prop. Verify the role lands correctly in the DOM during build.
- `aria-labelledby={title}`, `aria-describedby={description}` — wire via the DOM IDs AntD generates.
- Focus goes to the **Cancel** button by default, not the destructive action. AntD defaults focus to the primary action; correct via `afterOpenChange` handler that queries and focuses the Cancel button.
- Override with `initialFocus="confirm"` on the declarative API if a flow genuinely wants confirm-default.
- Escape closes with the "cancel" outcome (AntD default).
- `maskClosable={false}` — overlay click does NOT close (dialog must resolve explicitly).
- Body scroll locked while open (AntD default).

## Visual states

- Closed
- Open primary (neutral icon)
- Open danger (red icon, destructive confirm button)
- Open warning (yellow icon)
- Long description (scrolls within max-height cap)

## Stories to build

- **Playground:** args-driven trigger button + alertDialog.confirm call.
- **Feature stories:**
  - `Primary`, `Danger`, `Warning` — one per tone.
  - `LongDescription` — wrapping and scrolling.
  - `CustomIcon` — passing a different icon.
  - `Imperative` — shows the `const result = await alertDialog.confirm(...)` pattern.
  - `Declarative` — shows the JSX form for a custom-content confirmation.
- **Recipe stories:**
  - `DeleteClient` — `// Source: acme.splose.com/patients/446604/details — "Archive" button → confirmation`
  - `CancelInvoice` — `// Source: acme.splose.com/invoices — row action → confirm`
  - `DiscardChanges` — `// Source: acme.splose.com/notes/{id}/edit — leaving with unsaved changes`

## MDX docs outline

- H1: AlertDialog
- When to use — destructive actions, irreversible decisions, important consents.
- When not to use — informational dialogs (use `Modal`), non-blocking confirmations (use `Toast`), form validation (use `FormField` error).
- Variants — primary, danger, warning.
- Composition — imperative vs declarative, awaiting the promise, handling cancel as a type.
- Accessibility — focus on cancel, escape behaviour, no overlay dismiss.
- Sizing — single max-width, no `lg`/`xl` — confirmations should stay small and focused.

## Acceptance criteria

- [ ] Renders at 1440x900 matching production destructive-action confirmation dialog.
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `<AlertDialog.Provider />` mounted in `src/app/layout.tsx`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] At least two real consumers migrated (suggest: "Delete client" from clients detail page, "Delete service" from `/settings/services`).
- [ ] Confirm cancel has focus on open — manual keyboard test, documented in the commit message.

## Open questions

1. Do we ship this alongside `Modal` or collapse both into one `Dialog` primitive with tone? Suggest **alongside**. `Modal` hosts arbitrary content; `AlertDialog` is purpose-built for confirmations and should have a narrower API.
2. ~~Radix vs AntD~~ — **Resolved 2026-04-22: AntD.** Keep the DS on a single overlay foundation. See README.md decision A2.
3. During build, verify Cancel-default-focus works via AntD's `afterOpenChange`. If it doesn't, add a small `data-alert-cancel` ref pattern. Document in the commit.
