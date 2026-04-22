import type { Meta, StoryObj } from "@storybook/react";
import {
  FilterOutlined,
  SettingOutlined,
  EnvironmentOutlined,
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import Tooltip from "../Tooltip";
import type { TooltipSide, TooltipAlign } from "../Tooltip";
import Button from "../Button";
import Icon from "../Icon";

const meta: Meta<typeof Tooltip> = {
  title: "Overlay/Tooltip",
  component: Tooltip,
  argTypes: {
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"] satisfies TooltipSide[],
    },
    align: {
      control: "select",
      options: ["start", "center", "end"] satisfies TooltipAlign[],
    },
    delay: { control: { type: "number", min: 0, max: 1000, step: 50 } },
    disabled: { control: "boolean" },
  },
  parameters: {
    layout: "centered",
    splose: {
      status: "beta",
      summary:
        "Hover/focus label for icon-only buttons, truncated text, and abbreviations.",
      whatToUseInstead: "Native title attribute; raw AntD Tooltip imports.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/Tooltip.md",
      source: "src/components/ds/Tooltip.tsx",
    },
  },
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  args: {
    content: "Filter",
    side: "top",
    align: "center",
    delay: 200,
    disabled: false,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="secondary">
        <Icon as={FilterOutlined} size="md" />
      </Button>
    </Tooltip>
  ),
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

/** One tooltip per side (top/right/bottom/left). */
export const Sides: Story = {
  name: "Feature: Sides",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, auto)",
        gap: 48,
        padding: 48,
        placeItems: "center",
      }}
    >
      {(["top", "right", "bottom", "left"] as TooltipSide[]).map((side) => (
        <Tooltip key={side} content={`Side: ${side}`} side={side}>
          <Button variant="secondary">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
  parameters: { layout: "padded" },
};

/** Start / center / end alignment along the top edge. */
export const Aligns: Story = {
  name: "Feature: Aligns",
  render: () => (
    <div style={{ display: "flex", gap: 48, padding: 48 }}>
      {(["start", "center", "end"] as TooltipAlign[]).map((align) => (
        <Tooltip key={align} content={`align: ${align}`} side="top" align={align}>
          <Button variant="secondary" style={{ width: 140 }}>
            {align}
          </Button>
        </Tooltip>
      ))}
    </div>
  ),
  parameters: { layout: "padded" },
};

/** The most common consumer — an icon-only Button. */
export const OnIconButton: Story = {
  name: "Feature: On Icon Button",
  render: () => (
    <div style={{ display: "flex", gap: 12, padding: 24 }}>
      <Tooltip content="Edit">
        <Button variant="secondary" iconOnly>
          <Icon as={EditOutlined} size="md" />
        </Button>
      </Tooltip>
      <Tooltip content="Duplicate">
        <Button variant="secondary" iconOnly>
          <Icon as={CopyOutlined} size="md" />
        </Button>
      </Tooltip>
      <Tooltip content="Delete">
        <Button variant="secondary" iconOnly>
          <Icon as={DeleteOutlined} size="md" />
        </Button>
      </Tooltip>
    </div>
  ),
  parameters: { layout: "padded" },
};

/** Tooltip reveals the full value when the trigger text is truncated. */
export const OnTruncatedText: Story = {
  name: "Feature: On Truncated Text",
  render: () => (
    <div style={{ width: 240, padding: 24 }}>
      <Tooltip content="Appointment with Harry Nguyen — Initial Consult — 60 min">
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            padding: 8,
            border: "1px solid var(--color-border, #e5e5e5)",
            borderRadius: 6,
          }}
        >
          Appointment with Harry Nguyen — Initial Consult — 60 min
        </div>
      </Tooltip>
    </div>
  ),
  parameters: { layout: "padded" },
};

/**
 * Tooltip on a disabled button.
 *
 * Native `disabled` buttons don't fire pointer events, so AntD (like Radix)
 * requires a wrapper span to pick up hover events. Wrap the disabled
 * element in a `<span>` and the tooltip will still fire.
 */
export const DisabledTrigger: Story = {
  name: "Feature: Disabled Trigger",
  render: () => (
    <div style={{ display: "flex", gap: 16, padding: 24 }}>
      <Tooltip content="Can't delete — record is locked">
        <span>
          <Button variant="secondary" disabled>
            Delete
          </Button>
        </span>
      </Tooltip>
      <Tooltip content="This tooltip is suppressed" disabled>
        <Button variant="secondary">No tooltip (disabled)</Button>
      </Tooltip>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from production                  */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  CalendarToolbarIconTooltips                                        */
/*  Source: acme.splose.com/calendar/week — filter/settings/map icons  */
/* ------------------------------------------------------------------ */

export const CalendarToolbarIconTooltips: Story = {
  name: "Recipe: Calendar Toolbar Icons",
  render: () => (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: 8,
        backgroundColor: "#fff",
        border: "1px solid var(--color-border, #e5e5e5)",
        borderRadius: 8,
      }}
    >
      <Tooltip content="Filter">
        <Button variant="secondary" iconOnly>
          <Icon as={FilterOutlined} size="md" />
        </Button>
      </Tooltip>
      <Tooltip content="Settings">
        <Button variant="secondary" iconOnly>
          <Icon as={SettingOutlined} size="md" />
        </Button>
      </Tooltip>
      <Tooltip content="Locations">
        <Button variant="secondary" iconOnly>
          <Icon as={EnvironmentOutlined} size="md" />
        </Button>
      </Tooltip>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  TableRowActionTooltips                                             */
/*  Source: acme.splose.com/invoices — row action icons                */
/* ------------------------------------------------------------------ */

export const TableRowActionTooltips: Story = {
  name: "Recipe: Table Row Actions",
  render: () => (
    <div style={{ padding: 24 }}>
      <table style={{ borderCollapse: "collapse", fontSize: 13 }}>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--color-border, #e5e5e5)" }}>
            <td style={{ padding: "12px 16px" }}>INV-0001</td>
            <td style={{ padding: "12px 16px" }}>Harry Nguyen</td>
            <td style={{ padding: "12px 16px" }}>$450.00</td>
            <td style={{ padding: "12px 8px" }}>
              <div style={{ display: "flex", gap: 4 }}>
                <Tooltip content="Print invoice">
                  <Button variant="secondary" iconOnly>
                    <Icon as={PrinterOutlined} size="md" />
                  </Button>
                </Tooltip>
                <Tooltip content="Duplicate">
                  <Button variant="secondary" iconOnly>
                    <Icon as={CopyOutlined} size="md" />
                  </Button>
                </Tooltip>
                <Tooltip content="Delete">
                  <Button variant="secondary" iconOnly>
                    <Icon as={DeleteOutlined} size="md" />
                  </Button>
                </Tooltip>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
  parameters: { layout: "padded" },
};
