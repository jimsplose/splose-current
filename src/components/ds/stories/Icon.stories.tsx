import type { Meta, StoryObj } from "@storybook/react";
import {
  StarOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  FileOutlined,
} from "@ant-design/icons";
import Icon from "../Icon";
import type { IconSize, IconTone } from "../Icon";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Icon> = {
  title: "Data Display/Icon",
  component: Icon,
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"] satisfies IconSize[],
      description: "Icon size (xs=10px, sm=12px, md=14px, lg=16px, xl=18px, 2xl=20px, 3xl=24px)",
    },
    tone: {
      control: "select",
      options: ["default", "secondary", "tertiary", "primary", "success", "warning", "danger", "inverted"] satisfies IconTone[],
      description: "Icon color tone",
    },
    as: {
      control: false,
      description: "AntD icon component to render (pass the component class, not JSX)",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    as: StarOutlined,
    size: "lg",
    tone: "primary",
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES — individual props                              */
/* ================================================================== */

export const DefaultTone: Story = {
  args: { as: InfoCircleOutlined, size: "lg", tone: "default" },
};

export const PrimaryTone: Story = {
  args: { as: InfoCircleOutlined, size: "lg", tone: "primary" },
};

export const SuccessTone: Story = {
  args: { as: CheckCircleOutlined, size: "lg", tone: "success" },
};

export const WarningTone: Story = {
  args: { as: WarningOutlined, size: "lg", tone: "warning" },
};

export const DangerTone: Story = {
  args: { as: CloseCircleOutlined, size: "lg", tone: "danger" },
};

/* ================================================================== */
/*  3. GRID STORIES — all sizes × all tones                            */
/* ================================================================== */

const ALL_SIZES: IconSize[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"];
const ALL_TONES: IconTone[] = [
  "default",
  "secondary",
  "tertiary",
  "primary",
  "success",
  "warning",
  "danger",
  "inverted",
];

/** All 7 sizes with a single icon — compare spacing and visual weight. */
export const SizeGrid: Story = {
  name: "Grid: All Sizes",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 16 }}>
      {ALL_SIZES.map((size) => (
        <div key={size} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <Icon as={StarOutlined} size={size} tone="primary" />
          <span style={{ fontSize: 11, color: "#6E6E64" }}>{size}</span>
        </div>
      ))}
    </div>
  ),
  parameters: { layout: "padded" },
};

/** All 8 tones — verify each color token resolves correctly. */
export const ToneGrid: Story = {
  name: "Grid: All Tones",
  render: () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 24,
        padding: 16,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
      }}
    >
      {ALL_TONES.map((tone) => (
        <div
          key={tone}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            padding: 12,
            borderRadius: 8,
            backgroundColor: tone === "inverted" ? "#414549" : "#fff",
            border: "1px solid var(--color-border)",
          }}
        >
          <Icon as={StarOutlined} size="xl" tone={tone} />
          <span
            style={{
              fontSize: 11,
              color: tone === "inverted" ? "#fff" : "#6E6E64",
            }}
          >
            {tone}
          </span>
        </div>
      ))}
    </div>
  ),
  parameters: { layout: "padded" },
};

/** Full matrix: every size × every tone. */
export const AllVariants: Story = {
  name: "All Variants (size × tone matrix)",
  render: () => (
    <div style={{ overflowX: "auto", padding: 16 }}>
      <table style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ padding: "4px 12px 8px 0", fontSize: 11, color: "#6E6E64", textAlign: "left", fontWeight: 600 }}>
              tone \ size
            </th>
            {ALL_SIZES.map((size) => (
              <th key={size} style={{ padding: "4px 12px 8px", fontSize: 11, color: "#6E6E64", textAlign: "center", fontWeight: 600 }}>
                {size}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ALL_TONES.map((tone) => (
            <tr key={tone} style={{ backgroundColor: tone === "inverted" ? "#414549" : "transparent" }}>
              <td style={{ padding: "6px 12px 6px 0", fontSize: 11, color: tone === "inverted" ? "#fff" : "#6E6E64", fontWeight: 500 }}>
                {tone}
              </td>
              {ALL_SIZES.map((size) => (
                <td key={size} style={{ padding: "6px 12px", textAlign: "center" }}>
                  <Icon as={StarOutlined} size={size} tone={tone} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ================================================================== */
/*  4. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  DashboardMetricIcon                                                */
/*  Pattern: large icon next to a stat/metric value on the dashboard   */
/*  Source: /dashboard — stat cards use oversized icons                */
/* ------------------------------------------------------------------ */

export const DashboardMetricIcon: Story = {
  name: "Recipe: Dashboard Metric Icon",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16 }}>
      {[
        { icon: HomeOutlined, label: "Appointments today", value: "12" },
        { icon: UserOutlined, label: "Active clients", value: "284" },
        { icon: BellOutlined, label: "Reminders sent", value: "7" },
        { icon: FileOutlined, label: "Pending invoices", value: "3" },
      ].map(({ icon: IconComp, label, value }) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, border: "1px solid var(--color-border)", borderRadius: 8, backgroundColor: "#fff" }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: "var(--ant-color-primary-bg, #f0ebff)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon as={IconComp} size="xl" tone="primary" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#6E6E64" }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#414549" }}>{value}</div>
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  ToolbarIcons                                                        */
/*  Pattern: small secondary-tone icons in a rich-text toolbar         */
/*  Source: notes/[id]/edit — toolbar uses 12–14px AntD icons inline   */
/* ------------------------------------------------------------------ */

export const ToolbarIcons: Story = {
  name: "Recipe: Toolbar Icons",
  render: () => (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        padding: "4px 8px",
        border: "1px solid var(--color-border)",
        borderRadius: 6,
        backgroundColor: "#fff",
      }}
    >
      {[HomeOutlined, FileOutlined, SettingOutlined, BellOutlined, UserOutlined].map((IconComp, i) => (
        <button
          key={i}
          style={{
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
        >
          <Icon as={IconComp} size="md" tone="secondary" />
        </button>
      ))}
    </div>
  ),
  parameters: { layout: "padded" },
};
