import type { Preview } from "@storybook/react";
import React from "react";
import { ConfigProvider } from "antd";
import { sploseTheme } from "../src/components/ds/theme";
import "../src/app/globals.css";

const preview: Preview = {
  globalTypes: {
    source: {
      name: "Source",
      description:
        "URL source used by the AppPagesTable in MDX docs (and any story that reads `source` from globals).",
      defaultValue: "vercel",
      toolbar: {
        title: "Source",
        icon: "globe",
        items: [
          { value: "localhost", title: "Localhost (3000)" },
          { value: "vercel", title: "Vercel preview" },
          { value: "production", title: "Production (acme)" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story) => (
      <ConfigProvider theme={sploseTheme}>
        <Story />
      </ConfigProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
