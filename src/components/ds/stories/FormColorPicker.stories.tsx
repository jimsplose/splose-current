"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import FormColorPicker from "../FormColorPicker";

const meta: Meta<typeof FormColorPicker> = {
  title: "Design System/FormColorPicker",
  component: FormColorPicker,
};
export default meta;
type Story = StoryObj<typeof FormColorPicker>;

function NativeDemo() {
  const [color, setColor] = useState("#3b82f6");
  return <FormColorPicker label="Colour" value={color} onChange={setColor} variant="native" />;
}

function SwatchDemo() {
  const [color, setColor] = useState("#ef4444");
  return <FormColorPicker label="Colour" value={color} onChange={setColor} variant="swatches" />;
}

export const Native: Story = { render: () => <NativeDemo /> };
export const Swatches: Story = { render: () => <SwatchDemo /> };
