# Assets Required for Prototype Fidelity

All image assets live in `public/images/` with subfolders by category. Reference them in code as `/images/brand/filename.svg`, `/images/integrations/filename.svg`, etc.

## Status Key

- [ ] = Not yet supplied (use placeholder)
- [x] = Supplied and ready to use

## Brand Assets (High Priority)

- [x] `/images/brand/splose logo.svg` -- Main logo in navigation header (45px wide, 40px on mobile)
- [x] `/images/brand/favicon.ico` -- Browser tab icon
- [x] `/images/brand/ai-icon.svg` -- AI sparkle icon used on AI feature buttons and badges
- [x] `/images/brand/ai feature.png` -- AI feature promotional image
- [x] `/images/brand/settings.png` -- Settings page decorative image

## Custom Fonts (High Priority)

All fonts are already installed in the prototype at `public/fonts/`:

- [x] `FAIRE-SprigSans-Bold.woff2` -- "Sprig Sans" Bold
- [x] `FAIRE-SprigSans-Medium.woff2` -- "Sprig Sans" Medium
- [x] `FAIRE-SprigSans-Regular.woff2` -- "Sprig Sans" Regular
- [x] Inter -- loaded via `next/font/google` in `layout.tsx`

No action needed. Fonts are wired into Tailwind via `globals.css` as `--font-sans` (Inter) and `--font-display` (Sprig Sans).

## Integration Logos (Medium Priority)

- [x] `/images/integrations/hicaps.png` -- HICAPS health claiming
- [x] `/images/integrations/mailchimp.svg` -- Mailchimp email integration
- [x] `/images/integrations/physitrack.svg` -- Physitrack exercise integration
- [x] `/images/integrations/quickbooks.svg` -- QuickBooks accounting integration
- [x] `/images/integrations/tyro-health.png` -- Tyro Health payment terminal
- [ ] `stripe.svg` -- Payments settings, invoice pages
- [ ] `xero.svg` -- Accounting integration settings
- [ ] `ndis.svg` -- NDIS bulk upload, patient settings
- [ ] `medicare.svg` -- Medicare/DVA claiming
- [ ] `google-maps.svg` -- Location settings, address fields
- [ ] `intercom.svg` -- Support chat bubble

**Still needed:** The missing integration logos above were not captured by the asset collector (likely not visible on the pages scanned). Download these from each service's brand/press page, or export from Figma, and save into `public/images/integrations/`.

## Other Assets

- [x] `/images/other/profile photo.png` -- Sample user profile photo (can be used as a placeholder for the logged-in user avatar)

## Icon Library

The prototype uses **`lucide-react`** (v0.577.0) for all icons. Already installed -- no action needed.

```tsx
import { Bell, MessageSquare, Settings, HelpCircle, Search, Plus, Edit, Trash2,
  Download, Printer, Eye, X, ChevronLeft, ChevronRight, ChevronDown,
  MoreHorizontal, User, Calendar, FileText, Clock, Undo } from 'lucide-react';
```

## User-Generated Content (Placeholder Treatment)

These are dynamic and do not need to be supplied. Use these placeholder approaches:

| Content type | Placeholder |
|-------------|-------------|
| Patient/contact avatars | Coloured circle with initials (matches real app behaviour) |
| User profile photos | Coloured circle with initials, or use `/images/other/profile photo.png` for the logged-in user |
| Uploaded documents/files | Generic file icon with filename text |
| Body chart templates | Simple outline SVG |
| Practice logo (per-workspace) | Grey box labelled "Practice Logo" |
