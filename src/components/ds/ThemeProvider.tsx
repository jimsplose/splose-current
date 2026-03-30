"use client";

import { ConfigProvider } from "antd";
import type { ReactNode } from "react";
import { sploseTheme } from "./theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ConfigProvider theme={sploseTheme}>{children}</ConfigProvider>;
}
