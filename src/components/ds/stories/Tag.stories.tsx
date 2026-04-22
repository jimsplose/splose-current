import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { StarFilled } from "@ant-design/icons";
import Tag from "../Tag";
import Icon from "../Icon";

const meta: Meta<typeof Tag> = {
  title: "Data Display/Tag",
  component: Tag,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    color: { control: "color" },
    interactive: { control: "boolean" },
    selected: { control: "boolean" },
  },
  parameters: {
    layout: "padded",
    splose: {
      status: "beta",
      summary:
        "User-generated colour-coded label for patient categorisation and record metadata.",
      whatToUseInstead:
        "<Badge variant=...> misused for user tags; raw AntD Tag imports.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/Tag.md",
      source: "src/components/ds/Tag.tsx",
    },
  },
};
export default meta;
type Story = StoryObj<typeof Tag>;

const palette = [
  { name: "Emerald", color: "#24a148" },
  { name: "Sapphire", color: "#0f62fe" },
  { name: "Amber", color: "#f1c21b" },
  { name: "Coral", color: "#fa4d56" },
  { name: "Violet", color: "#8250ff" },
  { name: "Slate", color: "#6f6f6f" },
  { name: "Mint", color: "#b4eb64" },
  { name: "Sky", color: "#a6c8ff" },
];

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  args: {
    children: "NDIS",
    color: "#5578FF",
    size: "sm",
    interactive: false,
    selected: false,
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  name: "Feature: Default (uncoloured)",
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Tag>VIP</Tag>
      <Tag>NDIS</Tag>
      <Tag>Payment plan</Tag>
    </div>
  ),
};

export const Coloured: Story = {
  name: "Feature: Coloured (palette)",
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {palette.map((p) => (
        <Tag key={p.name} color={p.color}>
          {p.name}
        </Tag>
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  name: "Feature: With Icon",
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Tag color="#f1c21b" icon={<Icon as={StarFilled} size="xs" />}>
        VIP
      </Tag>
      <Tag icon={<Icon as={StarFilled} size="xs" tone="secondary" />}>
        Priority
      </Tag>
    </div>
  ),
};

export const Removable: Story = {
  name: "Feature: Removable",
  render: () => {
    const Inner = () => {
      const [items, setItems] = useState(["VIP", "NDIS", "Payment plan"]);
      return (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {items.map((t) => (
            <Tag
              key={t}
              color="#5578FF"
              onRemove={() => setItems((x) => x.filter((i) => i !== t))}
            >
              {t}
            </Tag>
          ))}
          {items.length === 0 ? (
            <button onClick={() => setItems(["VIP", "NDIS", "Payment plan"])}>
              Reset
            </button>
          ) : null}
        </div>
      );
    };
    return <Inner />;
  },
};

export const Interactive: Story = {
  name: "Feature: Interactive (toggle)",
  render: () => {
    const Inner = () => {
      const [selected, setSelected] = useState<string[]>(["NDIS"]);
      const toggle = (t: string) =>
        setSelected((x) => (x.includes(t) ? x.filter((i) => i !== t) : [...x, t]));
      return (
        <div style={{ display: "flex", gap: 8 }}>
          {["VIP", "NDIS", "Payment plan", "Overdue"].map((t) => (
            <Tag
              key={t}
              interactive
              selected={selected.includes(t)}
              color={selected.includes(t) ? "#5578FF" : undefined}
              onClick={() => toggle(t)}
            >
              {t}
            </Tag>
          ))}
        </div>
      );
    };
    return <Inner />;
  },
};

export const SelectedState: Story = {
  name: "Feature: Selected state",
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Tag interactive>Unselected</Tag>
      <Tag interactive selected color="#5578FF">
        Selected
      </Tag>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Feature: Sizes",
  render: () => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Tag size="sm" color="#24a148">Small</Tag>
      <Tag size="md" color="#24a148">Medium</Tag>
      <Tag size="lg" color="#24a148">Large</Tag>
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const PatientTags: Story = {
  name: "Recipe: Patient Tags",
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Tag color="#f1c21b">VIP</Tag>
      <Tag color="#0f62fe">NDIS</Tag>
      <Tag color="#6f6f6f">Payment plan</Tag>
      <Tag color="#fa4d56">Overdue account</Tag>
    </div>
  ),
};

export const WaitlistTags: Story = {
  name: "Recipe: Waitlist Tags",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <Tag color="#24a148">Initial consult</Tag>
        <Tag color="#6f6f6f">Low priority</Tag>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Tag color="#0f62fe">Follow-up</Tag>
        <Tag color="#fa4d56">Urgent</Tag>
      </div>
    </div>
  ),
};

export const TagFilterBar: Story = {
  name: "Recipe: Tag Filter Bar",
  render: () => {
    const Inner = () => {
      const [selected, setSelected] = useState<string[]>(["VIP"]);
      const toggle = (t: string) =>
        setSelected((x) => (x.includes(t) ? x.filter((i) => i !== t) : [...x, t]));
      return (
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: 12,
            borderRadius: 8,
            background: "#fafafa",
          }}
        >
          <span style={{ fontSize: 12, color: "#6E6E64", alignSelf: "center" }}>
            Tags:
          </span>
          {["VIP", "NDIS", "Payment plan", "Medicare", "Private"].map((t) => (
            <Tag
              key={t}
              interactive
              selected={selected.includes(t)}
              color={selected.includes(t) ? "#5578FF" : undefined}
              onClick={() => toggle(t)}
            >
              {t}
            </Tag>
          ))}
        </div>
      );
    };
    return <Inner />;
  },
};
