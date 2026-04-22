# Wave 5 · Plan 03 — Patient surface migration

**Status:** Done
**Estimated effort:** M
**Recommended model:** Sonnet 4.6 (mostly mechanical — avatar + tag + field substitutions)
**Thinking budget:** think

## Surface

- `src/app/patients/page.tsx` — patient list with avatar + name + meta rows.
- `src/app/patients/[id]/details/*` + `clients/[id]/ClientDetailClient.tsx` — patient detail header + contact info block + billing block + tag row.
- `src/app/patients/new/page.tsx` + `contacts/new/page.tsx` — new-patient / new-contact forms (DOB, mobile, referrer).
- `src/app/waitlist/page.tsx` — waitlist row (avatar + tags).
- `src/app/patients/[id]/cases/*` — case summary label/value rows.

## Migrations

This plan does TWO things in one pass for every file it touches: (1) adopt the new Wave 4 DS components, and (2) remove hand-written utility classes from `globals.css`. Both migrations happen in the same edit per file to avoid double-touch.

### A. DS component adoption

| From | To | Surface |
|---|---|---|
| Generic `<Avatar name={...} color={...}>` with ad-hoc colour logic | `<PatientAvatar patient={{ id, firstName, lastName }}>` | patient list, detail header, waitlist, ClientDetailClient |
| Inline `<Badge>` with manual colour per tag | `<Tag color={tag.color}>{tag.label}</Tag>` + `onRemove` where tags are removable | patient detail tag row, waitlist tag chips |
| Hand-rolled label/value rows `<div><label>Phone</label><span>...</span></div>` | `<List items={[{ label, value, hint?, editable? }]}>` with `layout="horizontal"` and `divider` | patient contact info card, billing card, contacts detail |
| `<FormInput type="text">` for DOB | `<DatePicker label="Date of birth" maxDate={today}>` | patients/new, patient edit |
| `<FormInput type="tel">` for mobile + home phone | `<PhoneInput defaultCountry="AU">` | patients/new, contacts/new, patient edit |
| Plain anchor with `<Avatar>` inline | `<HoverCard content={patientPreview}><a>Patient name</a></HoverCard>` | patient row in list — OPTIONAL polish |

### B. Utility-class removal on patient surfaces

Use the replacement mapping + priority ladder in [README.md § "Utility-class replacement reference"](README.md#utility-class-replacement-reference). Applies to every `.tsx` under:

- `src/app/clients/**`
- `src/app/patients/**`
- `src/app/waitlist/**`
- `src/app/contacts/**`

Structural class work that lives in this plan (from utility plan Task E2): `hover-underline-on-row-hover` in `src/app/clients/ClientsPageClient.tsx`. Move to a local CSS module:

```css
/* ClientsPageClient.module.css */
tr:hover .hoverUnderline { text-decoration: underline; }
```

Then `className="hover-underline-on-row-hover"` → `className={styles.hoverUnderline}`.

Also: `row-hover` on `<Tr>` elements in patient list tables → `<Tr hover>` (DS prop).

## Chrome MCP verification

At 1440×900 on both tabs:

1. **Patient list:** avatar colour is deterministic (hash of `patient.id`) — same patient renders the same hue on every load. Sizing matches production (sm = 26px in list rows).
2. **Patient detail header:** avatar size matches 36px production baseline. Tag row wraps correctly on narrow widths.
3. **Contact info block:** label + value + hint icon for fields like "Gap fee" render correctly; edit pencil fires `onEdit` on matching rows.
4. **DOB DatePicker:** placeholder shows `DD/MM/YYYY`, max-date clamp prevents picking future dates.
5. **Mobile PhoneInput:** typing `0412345678` formats to `0412 345 678` and stores as `+61412345678`.
6. **Waitlist:** tags use service-configured colours.

## Acceptance criteria

### DS adoption
- [ ] `grep -c "<Avatar\b" src/app/patients src/app/clients src/app/waitlist -r` = 0 outside of non-patient avatars (practitioner, reviewer — keep generic `Avatar` there).
- [ ] `grep -c "parseFloat\|formatPhone\|stripSpaces" src/app/patients src/app/contacts -r` drops by ≥5.
- [ ] ClientDetailClient.tsx remains ≤10 inline `style={{` (session 26 target).
- [ ] New-patient form saves a valid E.164 phone number (verify in Prisma / devtools after a test save).
- [ ] Tag row renders user-configured colours with correct contrast.

### Utility-class cleanup on patient surfaces
- [ ] `grep -rn 'className=.*text-body-\|className=.*text-heading-\|className=.*text-label-\|className=.*text-caption-\|className=.*text-display-\|className=.*text-metric-' src/app/clients src/app/patients src/app/waitlist src/app/contacts --include='*.tsx'` = 0
- [ ] `grep -rn 'className=.*\btext-text\b\|className=.*text-text-secondary\|className=.*text-primary\b\|className=.*text-danger\b\|className=.*border-border\|className=.*bg-primary' src/app/clients src/app/patients src/app/waitlist src/app/contacts --include='*.tsx'` = 0
- [ ] `grep -rn 'className=.*\bmb-[0-9]\|className=.*\bmt-[0-9]\|className=.*\bp-[0-9]\b\|className=.*\bflex-1\b\|className=.*\bshrink-0\b\|className=.*\bw-full\b\|className=.*\boverflow-hidden\b\|className=.*\boverflow-y-auto\b\|className=.*\bborder-b\b' src/app/clients src/app/patients src/app/waitlist src/app/contacts --include='*.tsx'` = 0
- [ ] `grep -rn 'row-hover\|hover-underline-on-row-hover' src/app/clients src/app/patients src/app/waitlist src/app/contacts --include='*.tsx'` = 0

### Gate
- [ ] tsc 0 errors, `npx next build` passes.
- [ ] `.verification-evidence` written per migrated surface (typography + spacing + color).

## Commit discipline

One commit per page:
1. patients/page.tsx + waitlist/page.tsx list rows → PatientAvatar (sm)
2. patients/[id]/details + ClientDetailClient header → PatientAvatar (md) + Tag row
3. ClientDetailClient contact/billing blocks → enhanced List (divider + editable + hint)
4. patients/new + contacts/new → DatePicker (DOB) + PhoneInput (mobile)
5. Optional: HoverCard preview on patient-row links (polish)
6. Wave 5 Plan 03 status flip + session log

## Known pitfalls

- ClientDetailClient has an extensive history (sessions 04, 21, 26, 26b, 31 all touched it). Check `git log --oneline -20 src/app/clients/[id]/ClientDetailClient.tsx` before starting. The 4 remaining inline styles from session 26b are intentional (aside layout, FileUpload, 2 Tr borders) — don't churn them.
- Tag colour contrast — Wave 4 `Tag` picks white/dark text automatically, but validate against the existing `/settings/tags` palette values. If any custom colour fails contrast, surface it during the build (don't silently render unreadable text).
- DOB DatePicker emits `Date` at local midnight; ensure the persistence layer stores/reads the day part without timezone drift.
- HoverCard on patient rows is hover-only — keyboard users must still get the name/link to the patient. Verify tab order around the wrapper span.

## Open questions

1. **Archived patients** — `PatientAvatar` supports `status="archived"` (desaturate). Does the patient list surface archived patients in the same list or a separate tab? If same list, wire the status prop; if separate, leave active.
2. **Tag create flow** — removing a tag via `<Tag onRemove>` fires back. Does the waitlist entry UI allow adding tags inline, or only in `/settings/tags`? If inline, pair with a `ComboBox` tag picker — out of scope for this plan, flag as Wave 6.
