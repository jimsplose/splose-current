import type { ThemeConfig } from "antd";

export const sploseTheme: ThemeConfig = {
  token: {
    // === PRIMARY (Violet) ===
    colorPrimary: "#8250FF", // violet-600
    colorPrimaryBg: "#f3eeff", // violet-100
    colorPrimaryBgHover: "#ede5ff", // violet-200
    colorPrimaryBorder: "#D6C1FF", // violet-300
    colorPrimaryHover: "#6B3FDB", // violet-700
    colorPrimaryActive: "#5532B3", // violet-800
    colorLink: "#8250FF", // match primary — antd v5 defaults to colorInfo otherwise

    // === SUCCESS ===
    colorSuccess: "#00C269", // success-600
    colorSuccessBg: "#E6F9F0", // success-100
    colorSuccessBorder: "#99E7C3", // success-300
    colorSuccessHover: "#33CF87", // success-500
    colorSuccessActive: "#00A651", // success-700

    // === WARNING ===
    colorWarning: "#FFD232", // warning-600
    colorWarningBg: "#FFFBEB", // warning-100
    colorWarningBorder: "#FFE89E", // warning-300
    colorWarningHover: "#FFD54C", // warning-500
    colorWarningActive: "#D4A20A", // warning-700

    // === ERROR (Critical) ===
    colorError: "#F00032", // critical-600 — matches production antd danger red
    colorErrorBg: "#FEF2F3", // critical-100
    colorErrorBorder: "#FBCBD1", // critical-300
    colorErrorHover: "#F2667A", // critical-500
    colorErrorActive: "#B00029", // critical-700

    // === INFO ===
    colorInfo: "#5578FF", // info-600
    colorInfoBg: "#F0F4FF", // info-100
    colorInfoBorder: "#C7D9FF", // info-300
    colorInfoHover: "#7C9DFF", // info-500
    colorInfoActive: "#3D5FDB", // info-700

    // === TEXT ===
    colorText: "#414549", // neutral-700 / cool-black-700
    colorTextSecondary: "#6E6E64", // neutral-600
    colorTextTertiary: "#b8bcc0", // cool-black-600
    colorTextQuaternary: "#e7e8e8", // cool-black-500

    // === BACKGROUNDS & FILLS ===
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBgLayout: "#ffffff", // white — matches production
    colorFill: "#eaedf1", // cool-black-400
    colorFillSecondary: "#f3f5f7", // cool-black-200
    colorFillTertiary: "#f9fafb", // cool-black-100
    colorFillQuaternary: "#FAFAF7", // neutral-100

    // === BORDERS ===
    colorBorder: "#e7e8e8", // cool-black-500
    colorBorderSecondary: "#edf0f3", // cool-black-300

    // === TYPOGRAPHY ===
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,
    controlHeight: 38,
    controlHeightLG: 38,
    fontSizeXL: 24,
    fontSizeHeading1: 30,
    fontSizeHeading2: 24,
    fontSizeHeading3: 18,
    fontSizeHeading4: 16,
    fontSizeHeading5: 14,

    // === SHAPE ===
    borderRadius: 8,
    borderRadiusSM: 6,
    borderRadiusLG: 12,
  },

  components: {
    Table: {
      headerBg: "#f3f5f7",
      headerColor: "#414549",
      rowHoverBg: "#f3f5f7",
      rowSelectedBg: "rgba(130, 80, 255, 0.05)",
      rowSelectedHoverBg: "rgba(130, 80, 255, 0.08)",
    },
    Button: {
      primaryShadow: "none",
      defaultShadow: "none",
      dangerShadow: "none",
      defaultBorderColor: "#414549",
    },
    Card: {
      headerBg: "#f3f5f7",
    },
    Modal: {
      titleFontSize: 18,
    },
    Input: {
      activeBorderColor: "#8250FF",
      hoverBorderColor: "#6B3FDB",
    },
    Select: {
      activeBorderColor: "#8250FF",
      hoverBorderColor: "#6B3FDB",
    },
    // Form.Item label styling — replaces DS FormLabel wrapper
    Form: {
      labelFontSize: 14,
      labelColor: "#414549",
      labelRequiredMarkColor: "#F00032",
      // verticalLabelPadding controls top padding on stacked labels
      verticalLabelPadding: "0 0 6px",
    },
    // Typography heading sizes aligned to our type scale
    Typography: {
      titleMarginBottom: 0,
      titleMarginTop: 0,
    },
  },
};
