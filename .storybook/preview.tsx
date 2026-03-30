import type { Preview } from "@storybook/react";
import React from "react";
import { ConfigProvider } from "antd";
import { sploseTheme } from "../src/components/ds/theme";
import "../src/app/globals.css";

const preview: Preview = {
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
