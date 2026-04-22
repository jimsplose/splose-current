// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  ...storybook.configs["flat/recommended"],
  // Ban direct antd imports outside the ds/ wrapper layer
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/ds/**"],
    rules: {
      "no-restricted-imports": ["error", {
        paths: [
          {
            name: "antd",
            importNames: [
              "Alert", "Avatar", "Button", "Card", "Checkbox", "Collapse",
              "DatePicker", "Dropdown", "Form", "Input", "List", "Modal",
              "Pagination", "Radio", "Select", "Spin", "Statistic", "Switch",
              "Table", "Tabs", "Tag", "Typography", "Upload", "ColorPicker",
              "Menu", "Tooltip",
            ],
            message: "Import from '@/components/ds' instead. Direct antd imports are only allowed inside src/components/ds/.",
          },
          {
            name: "@ant-design/icons",
            message: "Import icons from '@/components/ds' instead. Direct @ant-design/icons imports are only allowed inside src/components/ds/.",
          },
        ],
      }],

      // Merged no-restricted-syntax rule set (Wave 5 Plan 08: promoted from
      // separate warn blocks into a single unified block).
      //
      // Part A — DS-first: warn on inline style={{}} properties that duplicate
      // DS component responsibility. Pure-layout inlines (margin, padding, gap,
      // flex, position, width, height, overflow) are allowed per CLAUDE.md.
      // Severity stays at "warn" — legitimate edge cases exist (dynamic user
      // colors, decorative gradients); disable with eslint-disable-next-line.
      //
      // Part B — Wave 5 utility-class enforcement: error on any className still
      // referencing a deleted globals.css utility class. These classes no longer
      // exist in globals.css after Plan 08 — callers would silently lose styles.
      "no-restricted-syntax": [
        "warn",
        // Part A — DS-first inline-style guards (audit sessions 27/28)
        {
          selector: 'JSXAttribute[name.name="style"] ObjectExpression > Property[key.name=/^(color|backgroundColor)$/]',
          message: "DS-first: inline color/backgroundColor — prefer <Text color=…>, <Card tint=…>, <Badge variant=…>, or <FeatureCard tone=…>. See docs/ds-audit-2026-04-20.md.",
        },
        {
          selector: 'JSXAttribute[name.name="style"] ObjectExpression > Property[key.name="fontWeight"]',
          message: "DS-first: inline fontWeight — prefer <Text weight='medium'|'bold'>. See docs/ds-audit-fix-backlog.md Session 01.",
        },
        {
          selector: 'JSXAttribute[name.name="style"] ObjectExpression > Property[key.name=/^(fontSize|fontFamily|lineHeight|letterSpacing)$/]',
          message: "DS-first: inline font sizing/family — prefer <Text variant='…'> or <Icon size='…'>. See docs/ds-audit-2026-04-20.md.",
        },
        {
          selector: 'JSXAttribute[name.name="style"] ObjectExpression > Property[key.name=/^(border|borderColor|borderTop|borderBottom|borderLeft|borderRight)$/]',
          message: "DS-first: inline border — prefer <Card>, <Divider orientation='vertical'>, or a DS component prop.",
        },
        {
          selector: 'JSXAttribute[name.name="style"] ObjectExpression > Property[key.name="boxShadow"]',
          message: "DS-first: inline boxShadow — prefer <Card shadow>.",
        },
        {
          selector: 'JSXAttribute[name.name="style"] ObjectExpression > Property[key.name="textDecoration"]',
          message: "DS-first: inline textDecoration — prefer <Button variant='link'> or a DS component.",
        },
      ],
      // Part B — Wave 5 utility-class enforcement (promoted to error, Plan 08)
      // These selectors are a separate rule entry so severity can differ.
      // Note: ESLint flat config merges rules from multiple config objects
      // sequentially — we keep Part B in its own "no-restricted-syntax" entry
      // here to allow independent severity. Both entries are ACTIVE because
      // they are in the same config object (no override).
    },
  },
  // Wave 5 utility-class enforcement — error severity (Plan 08 promoted).
  // Placed in a second config object so its severity is independent of Part A.
  // In ESLint flat config, a later "no-restricted-syntax" in the SAME files/
  // ignores scope overrides the earlier one. To keep both active, we use
  // separate config objects with non-overlapping ignores — Part A ignores
  // stories; Part B targets all tsx including stories (utility classes are gone
  // from globals.css and must not appear anywhere).
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": ["error",
        {
          selector: "JSXAttribute[name.name='className'][value.type='Literal'][value.value=/\\b(text-body-(md|lg|sm|md-strong|lg-strong)|text-heading-(sm|md|lg)|text-label-(sm|md|lg)|text-caption-(sm|md)|text-display-(sm|md|lg)|text-metric-(sm|md|lg))\\b/]",
          message: "Utility class deleted from globals.css (Wave 5). Use <Text variant='...'> instead. See docs/ds-plans-wave5/README.md.",
        },
        {
          selector: "JSXAttribute[name.name='className'][value.type='Literal'][value.value=/\\b(text-text\\b|text-text-secondary|text-text-tertiary|text-text-inverted|text-primary\\b|text-danger|text-success|text-warning|border-border|border-primary|divide-border|bg-primary)\\b/]",
          message: "Utility class deleted from globals.css (Wave 5). Use <Text color> prop, <Td color> prop, or CSS variable inline instead.",
        },
        {
          selector: "JSXAttribute[name.name='className'][value.type='Literal'][value.value=/\\b(mb-[0-9]|mt-[0-9]|p-[0-9]|pt-[0-9]|pb-[0-9]|flex-1|shrink-0|w-full|max-w-2xl|overflow-hidden|overflow-y-auto|border-b\\b)\\b/]",
          message: "Utility class deleted from globals.css (Wave 5). Replace with <Flex vertical gap={N}>, DS component prop, or style={{}}.",
        },
      ],
    },
  },
]);

export default eslintConfig;
