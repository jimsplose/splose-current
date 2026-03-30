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
    },
  },
]);

export default eslintConfig;
