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

      // DS-first enforcement: warn on inline style={{}} properties that
      // duplicate a DS component's responsibility. Pure-layout inlines
      // (margin, padding, gap, flex, position, width, height, overflow)
      // are intentionally not flagged — they're allowed per CLAUDE.md's
      // "Decision Trees" (one-off layout values are fine inline).
      //
      // Drives the remaining sessions in docs/ds-audit-fix-backlog.md and
      // prevents regressions after the backlog lands. Severity is "warn"
      // rather than "error" to avoid blocking legitimate edge cases
      // (dynamic user-chosen colors, decorative gradients). Once the
      // backlog is ~80% complete, consider promoting to "error".
      //
      // Implementation note: each rule uses an AST selector matching
      // JSXAttribute[name.name="style"] > ObjectExpression Property. The
      // regex matches Identifier keys (standard CSS-in-JS); quoted keys
      // like "color": are unusual and not matched.
      "no-restricted-syntax": ["warn",
        {
          selector: 'JSXAttribute[name.name="style"] ObjectExpression > Property[key.name=/^(color|backgroundColor)$/]',
          message: "DS-first: inline color/backgroundColor — prefer <Text color=…>, <Card tint=…>, <Badge variant=…>, or (post-Session-11) <FeatureCard tone=…>. See docs/ds-audit-2026-04-20.md.",
        },
        {
          selector: 'JSXAttribute[name.name="style"] ObjectExpression > Property[key.name="fontWeight"]',
          message: "DS-first: inline fontWeight — prefer <Text weight='medium'|'bold'> (Session 01 added this prop). See docs/ds-audit-fix-backlog.md Session 01.",
        },
        {
          selector: 'JSXAttribute[name.name="style"] ObjectExpression > Property[key.name=/^(fontSize|fontFamily|lineHeight|letterSpacing)$/]',
          message: "DS-first: inline font sizing/family — prefer <Text variant='…'> (with heading/xl + page-title landing in Session 08) or <Icon size='…'> (Session 04). See docs/ds-audit-2026-04-20.md.",
        },
        {
          selector: 'JSXAttribute[name.name="style"] ObjectExpression > Property[key.name=/^(border|borderColor|borderTop|borderBottom|borderLeft|borderRight)$/]',
          message: "DS-first: inline border — prefer <Card>, <Divider orientation='vertical'> (Session 02), or a DS component prop. See docs/ds-audit-2026-04-20.md.",
        },
        {
          selector: 'JSXAttribute[name.name="style"] ObjectExpression > Property[key.name="boxShadow"]',
          message: "DS-first: inline boxShadow — prefer <Card shadow>.",
        },
        {
          selector: 'JSXAttribute[name.name="style"] ObjectExpression > Property[key.name="textDecoration"]',
          message: "DS-first: inline textDecoration — prefer <Button variant='link'> (Session 13) or a DS component.",
        },
      ],
    },
  },
]);

export default eslintConfig;
