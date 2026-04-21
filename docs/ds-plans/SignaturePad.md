# SignaturePad build plan

**Phase:** 4
**Status:** Planned
**Estimated size:** M
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A drawable canvas that captures a handwritten signature and emits it as a base64 PNG or SVG string. Used for invoice sign-off, consent forms (intake, treatment plan), and any document that requires the patient's or practitioner's name-in-hand.

## API

```ts
interface SignaturePadProps {
  label?: string;
  value?: string | null;               // base64 PNG data URL
  defaultValue?: string;
  onChange?: (value: string | null) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  width?: number;                      // canvas width, default 360
  height?: number;                     // canvas height, default 120
  penColor?: string;                   // default "rgb(44, 44, 44)"
  background?: string;                 // default transparent; pass white for exported PNGs
  format?: "png" | "svg";              // export format, default "png"
  showClearButton?: boolean;           // default true
  minStrokes?: number;                 // validation — minimum strokes to accept, default 1
}
```

Emits `null` when empty; emits the serialised signature on every `onChange`. Call sites can gate save until the value is non-null.

## What it extends

`react-signature-canvas` (https://github.com/agilgur5/react-signature-canvas) or `signature_pad` directly. Both wrap HTML Canvas with smooth Bezier stroke rendering and pressure-sensitive thinning. `react-signature-canvas` gives a React-friendly ref API. AntD has no signature component; Radix has none. This is a new dep.

Bundle cost: `signature_pad` ≈ 10KB gz; `react-signature-canvas` wrapper adds ~2KB. Acceptable.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — no signature pad observed on the pages walked. Likely lives on invoice sign-off views that aren't linked from top-level nav.

- Confirm candidates during build:
  - `/invoices/{id}/view` — "Sign & lock" button on the header. Clicking could open a modal with a SignaturePad.
  - `/patient-form/{id}/view` — patient consent forms (NDIS intake, treatment plan).
  - `/notes/{id}/edit` — practitioner signature at the bottom of a final note.

## Measurement targets

No live sample — design defaults:

- Canvas default: `360 × 120px`, `2px` dashed `var(--color-border)`, `6px` border-radius, white bg.
- Focused: `2px` solid `var(--color-primary)` border.
- Error: `2px` solid `var(--color-danger)` border.
- Pen colour: `rgb(44, 44, 44)` default (primary text).
- Clear button: secondary `Button size="sm"`, positioned top-right inside the pad or beside the label.
- Accessibility affordance: visible text label above — "Sign here".
- On touch, canvas accepts single-finger strokes; second-finger scroll on the page (not inside the canvas).

## Accessibility

- Canvas itself is not accessible (no semantic representation of a drawing). Provide an alternative input path:
  - Typed-signature fallback: a `<FormInput>` where the user types their name in a cursive-style font. Emits the same `value` format.
  - Toggle between draw mode and type mode via a `SegmentedControl`.
- `aria-label` on the canvas: "Signature drawing area; use the Type mode if you cannot draw".
- The Clear button is keyboard-focusable with `aria-label="Clear signature"`.
- `required` is announced; on blur with empty canvas, shows the error.

## Visual states

- Empty (placeholder "Sign here" watermark)
- Drawing (smooth stroke following cursor)
- Has signature (readable strokes, clear button visible)
- Focused (primary border)
- Disabled (greyed out, no interaction)
- Error (danger border + error message)
- Type-mode fallback (cursive font input)

## Stories to build

- **Playground:** args-driven with dimensions, colour, format.
- **Feature stories:**
  - `Empty` — shows placeholder.
  - `Drawn` — signature populated from a stored string.
  - `Disabled`.
  - `Error`.
  - `CustomDimensions` — wider/taller variants.
  - `TypeMode` — typed fallback.
- **Recipe stories:**
  - `InvoiceSignOff` — `// Source: planned /invoices/{id}/view — Sign & Lock modal`
  - `ConsentForm` — `// Source: planned /patient-form/{id}/view — consent-form bottom signature`
  - `FinalNoteSign` — `// Source: planned /notes/{id}/edit — practitioner sign-off at the bottom of a final note`

## MDX docs outline

- H1: SignaturePad
- When to use — signed documents, consent forms, invoice sign-off.
- When not to use — text notes (use `RichTextEditor`), drawings on charts (use a body-chart component).
- Variants — dimensions, pen colour, type-mode fallback.
- Composition — inside a modal before "Save & lock", inside a form, beside the name/date row.
- Accessibility — type-mode fallback, required label, clear button affordance.
- Sizing — default 360x120; larger for full-page forms.

## Acceptance criteria

- [ ] Renders at 1440x900 via Storybook-only verification.
- [ ] Passes `@storybook/addon-a11y` checks (type-mode fallback path verified).
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`, explicitly calling out the type-mode fallback as the a11y route.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] `signature_pad` (or `react-signature-canvas`) dep added.
- [ ] Manual test on touchscreen — draw a stroke, confirm smoothness and no double-firing.

## Open questions

1. **Storage format** — PNG vs SVG. SVG is resolution-independent and smaller for simple strokes; PNG is universally embeddable in PDFs. Suggest **PNG** for invoice/document embedding; add SVG later if a specific use case needs it.
2. **Typed fallback** — mandatory or optional? Leans mandatory for accessibility; some business contexts (legal sign-off) may reject typed signatures. If so, disable the type-mode toggle in that context.
3. **Persistence** — signatures may be large strings (a few KB base64). Confirm with the backend team that the relevant schema columns (`invoice.signature`, `patientForm.signature`) accept long strings. Not a DS concern per se, but flagging so the build session can verify end-to-end.
