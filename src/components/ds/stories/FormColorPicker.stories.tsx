"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import FormColorPicker from "../FormColorPicker";

const meta: Meta<typeof FormColorPicker> = {
  title: "Forms/FormColorPicker",
  component: FormColorPicker,
  argTypes: {
    label: { control: "text" },
    value: { control: "color" },
    variant: {
      control: "select",
      options: ["native", "swatches"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof FormColorPicker>;

/* ── Playground ─────────────────────────────────────────────────────────── */

function PlaygroundDemo(args: { label?: string; value?: string; variant?: "native" | "swatches" }) {
  const [color, setColor] = useState(args.value ?? "#3b82f6");
  return (
    <FormColorPicker
      label={args.label ?? "Colour"}
      value={color}
      onChange={setColor}
      variant={args.variant ?? "native"}
    />
  );
}

export const Playground: Story = {
  args: {
    label: "Colour",
    value: "#3b82f6",
    variant: "native",
  },
  render: (args) => <PlaygroundDemo {...args} />,
};

/* ── Feature Stories ────────────────────────────────────────────────────── */

function NativeDemo() {
  const [color, setColor] = useState("#3b82f6");
  return <FormColorPicker label="Colour" value={color} onChange={setColor} variant="native" />;
}

function SwatchesDemo() {
  const [color, setColor] = useState("#ef4444");
  return <FormColorPicker label="Colour" value={color} onChange={setColor} variant="swatches" />;
}

export const Native: Story = { render: () => <NativeDemo /> };
export const Swatches: Story = { render: () => <SwatchesDemo /> };

/* ── Recipes ────────────────────────────────────────────────────────────── */

function RoomColorPickerRecipe() {
  const [name, setName] = useState("Room 1");
  const [color, setColor] = useState("#3b82f6");

  return (
    <div className="max-w-sm space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">settings/rooms-resources</code> — room
        edit modal uses swatch picker.
      </p>
      <div>
        <label className="mb-1 block text-label-lg text-text-secondary">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none focus:border-primary"
        />
      </div>
      <FormColorPicker value={color} onChange={setColor} variant="swatches" />
      <div className="flex items-center gap-2 rounded border border-border p-3">
        <div className="h-6 w-6 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-body-md text-text">{name}</span>
        <span className="text-body-sm text-text-secondary">({color})</span>
      </div>
    </div>
  );
}

function TagColorPickerRecipe() {
  const [name, setName] = useState("Priority");
  const [color, setColor] = useState("#ef4444");

  return (
    <div className="max-w-sm space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">settings/tags</code> — tag edit modal
        uses native color picker.
      </p>
      <div>
        <label className="mb-1 block text-label-lg text-text-secondary">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none focus:border-primary"
        />
      </div>
      <FormColorPicker value={color} onChange={setColor} variant="native" />
      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-body-sm font-medium text-white"
          style={{ backgroundColor: color }}
        >
          {name}
        </span>
      </div>
    </div>
  );
}

export const RoomColorPicker: Story = {
  name: "Recipe: Room Color Picker",
  render: () => <RoomColorPickerRecipe />,
};

export const TagColorPicker: Story = {
  name: "Recipe: Tag Color Picker",
  render: () => <TagColorPickerRecipe />,
};
