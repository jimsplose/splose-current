# PatientAvatar build plan

**Phase:** 3
**Status:** Done
**Estimated size:** S
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A circular avatar showing a patient's initials on a tinted background, rendered deterministically from the patient record. Used in patient row lists, the patient detail header, the calendar appointment card, and anywhere a patient is referenced with their name. Differs from the generic `Avatar` component in the DS — `PatientAvatar` owns the Splose-specific colour assignment rule (hash patient ID → palette slot) so the same patient always gets the same colour.

## API

```ts
interface PatientAvatarProps {
  patient: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    displayName?: string | null;     // falls back to firstName + lastName
    photoUrl?: string | null;
    tone?: string;                    // override auto-tone (e.g. archived patients grey out)
  };
  size?: "xs" | "sm" | "md" | "lg" | "xl";    // 20 / 26 / 32 / 40 / 48
  interactive?: boolean;              // focus ring + hover, renders as <button>
  onClick?: () => void;
  status?: "active" | "archived" | "deceased";
}
```

Colour assignment: deterministic hash of `patient.id` modulo the Splose palette (7 colours from `ColorDot`). Override with `tone` for explicit cases (archived → grey, emergency flag → red).

Initials: first letter of `firstName` + first letter of `lastName`, uppercased. Fall back to `displayName[0]` if first/last not provided.

## What it extends

The existing `Avatar` DS component — `PatientAvatar` is a thin Splose-specific wrapper that owns the colour-hash and initials-derivation logic. `Avatar` stays the generic primitive for non-patient uses (user avatars in the top nav, reviewer avatars on notes, etc.).

Under the hood:
- If `patient.photoUrl` is present, render an `<img>` inside the circle.
- Else, render initials on the auto-toned background.
- Apply the `status` overlay (archived = 60% opacity + grey tint; deceased = small cross icon in corner).

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — captured the patient avatar on the detail page header.

Measured (patient detail page header avatar):
- Size: `36x36px` (between md 32 and lg 40 — confirm Splose standard).
- Background: `rgb(130, 80, 255)` (primary purple).
- Text: white, `14px`, `500` weight.
- Border-radius: `50%`.

- `https://acme.splose.com/patients/446604/details` — header avatar beside patient name.
- `https://acme.splose.com/patients` — avatar in each list row.
- `https://acme.splose.com/calendar/week/22/4/2026` — avatar on appointment cards (small size).
- `https://acme.splose.com/waitlist` — avatar in each row.

## Measurement targets

Captured + expected:

- Sizes: `xs = 20px`, `sm = 26px`, `md = 32px`, `lg = 40px`, `xl = 48px`.
  - Production uses 36px on detail header; either introduce a `36` as the `md` default (and adjust), or document that `md = 36` and shift the ladder. Confirm in build.
- Background: deterministic from patient ID → one of 7 palette colours (`ColorDot` palette).
- Text colour: white (all palette backgrounds pass 4.5:1 with white).
- Font: `font-weight: 500`. Size scales: `10px` xs, `11px` sm, `13px` md, `16px` lg, `18px` xl.
- Border-radius: `50%` always.
- Image fallback: if `photoUrl` 404s, re-render with initials.
- Archived overlay: 60% opacity on the whole avatar + grey tint.

## Accessibility

- If `interactive`, renders as `<button aria-label="{displayName}">`.
- If static, renders as `<span role="img" aria-label="{displayName}">`.
- If `photoUrl` loaded, `<img alt="{displayName}">` — SR reads name, not "image".
- Never rely on colour as meaning — the initials are the label, colour is incidental.
- `status` changes are announced: "Harry Nguyen, archived" when `status="archived"`.

## Visual states

- Initials (default, colour-hashed)
- With photo (img loaded)
- With photo (img errored → fallback initials)
- Archived (desaturated)
- Deceased (small cross icon corner)
- Interactive hover (slight ring)
- Interactive focused (primary ring)
- Sizes xs / sm / md / lg / xl

## Stories to build

- **Playground:** args-driven with patient fields, size, interactive, status.
- **Feature stories:**
  - `Sizes` — xs / sm / md / lg / xl side by side for one patient.
  - `Palette` — same size, 7 patients showing the full colour palette.
  - `WithPhoto` — photoUrl loaded.
  - `WithPhotoError` — photoUrl 404 → initials fallback.
  - `Archived` — archived overlay.
  - `Interactive` — clickable variant with focus ring.
- **Recipe stories:**
  - `PatientDetailHeader` — `// Source: acme.splose.com/patients/446604/details — header avatar + name pair`
  - `PatientListRow` — `// Source: acme.splose.com/patients — list row avatar + name + meta`
  - `CalendarEventAvatar` — `// Source: acme.splose.com/calendar/week — small avatar on appointment card`
  - `WaitlistRowAvatar` — `// Source: acme.splose.com/waitlist — avatar per row`

## MDX docs outline

- H1: PatientAvatar
- When to use — anywhere a patient is displayed with their name.
- When not to use — user avatars (use generic `Avatar`), organisation avatars (use `Avatar` with explicit tone).
- Variants — sizes, status overlays, with photo vs initials.
- Composition — beside a patient name, in a list row, inside an appointment card.
- Accessibility — label, role, colour-is-not-meaning.
- Sizing — size ladder and when to pick each.

## Acceptance criteria

- [ ] Renders at 1440x900 matching production patient detail header avatar.
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] At least one real consumer migrated. Suggest: the patient detail header — the most visible place the component ships, and a good smoke test for 36px sizing.

## Open questions

1. **Size ladder alignment** — production uses 36px on the patient detail header; our DS size ladder has `md = 32px` and `lg = 40px`. Options: (a) add a size token between md and lg (`md-plus = 36`), (b) shift `md` to 36, (c) use `md` in code and accept a 4px production delta. Lean **(b)** — reset `md = 36` to match production.
2. **Hash function** — which hash to use? Suggest a small local function (e.g. FNV-1a over patient.id) rather than pulling in a crypto dep. Stable across deploys is the only requirement.
3. **Archived / deceased semantics** — confirm these statuses exist in the data model or are purely presentational. If data-driven, verify the field name.
