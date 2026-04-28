import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { fn } from "storybook/test";
import ReorderModal, { type ReorderItem } from "../ReorderModal";
import { Button } from "antd";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */
const meta: Meta<typeof ReorderModal> = {
  title: "Overlays/ReorderModal",
  component: ReorderModal,
  tags: ["custom"],
  parameters: {
    layout: "centered",
    appPages: [
      {
        label: "Settings: Custom fields (reorder fields)",
        vercel: "https://splose-current.vercel.app/settings/custom-fields",
        localhost: "http://localhost:3000/settings/custom-fields",
        production: "https://acme.splose.com/settings/custom-fields",
      },
    ],
    referenceUrl: null,
  },
  argTypes: {
    open: { control: "boolean" },
    title: { control: "text" },
    items: { control: "object" },
    onClose: { action: "onClose" },
    onReorder: { action: "onReorder" },
  },
  args: {
    open: true,
    title: "Reorder items",
    onClose: fn(),
    onReorder: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof ReorderModal>;

/* ------------------------------------------------------------------ */
/*  Shared helper — wraps modal in open/close toggle                   */
/* ------------------------------------------------------------------ */
function ReorderDemo(props: Omit<React.ComponentProps<typeof ReorderModal>, "open" | "onClose">) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <ReorderModal {...props} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Playground                                                         */
/* ------------------------------------------------------------------ */
const defaultItems: ReorderItem[] = [
  { id: "1", label: "Full name" },
  { id: "2", label: "Date of birth" },
  { id: "3", label: "Phone number" },
  { id: "4", label: "Email address" },
  { id: "5", label: "Medicare number" },
];

export const Playground: Story = {
  args: { items: defaultItems, title: "Reorder items" },
  render: (args) => <ReorderDemo {...args} />,
};

/* ------------------------------------------------------------------ */
/*  Feature stories                                                    */
/* ------------------------------------------------------------------ */

/** Default state with a handful of items. */
export const Default: Story = {
  render: () => (
    <ReorderDemo
      title="Reorder items"
      items={defaultItems}
      onReorder={(items) => console.log("New order:", items)}
    />
  ),
};

/** Scrollable list with many items. */
export const ManyItems: Story = {
  render: () => (
    <ReorderDemo
      title="Reorder 15 items"
      items={Array.from({ length: 15 }, (_, i) => ({
        id: String(i + 1),
        label: `Item ${i + 1}`,
      }))}
      onReorder={(items) => console.log("New order:", items)}
    />
  ),
};

/** Labels that wrap to multiple lines. */
export const LongLabels: Story = {
  render: () => (
    <ReorderDemo
      title="Reorder fields"
      items={[
        { id: "1", label: "Client's primary emergency contact phone number (after hours)" },
        { id: "2", label: "Detailed treatment plan notes including observations and recommendations" },
        { id: "3", label: "Medicare Individual Therapeutic Plan reference number" },
        { id: "4", label: "Short" },
      ]}
      onReorder={(items) => console.log("New order:", items)}
    />
  ),
};

/* ------------------------------------------------------------------ */
/*  Recipe stories — real codebase patterns                            */
/* ------------------------------------------------------------------ */

/* Source: /settings/custom-fields — reorder the custom fields list */
export const ReorderFormFields: Story = {
  name: "Recipe: Form Fields",
  render: () => (
    <ReorderDemo
      title="Reorder custom fields"
      items={[
        { id: "1", label: "Diagnosis" },
        { id: "2", label: "Goal 1" },
        { id: "3", label: "Client's deidentification code" },
        { id: "4", label: "Personal Care" },
        { id: "5", label: "Level of Education" },
        { id: "6", label: "Child Name" },
      ]}
      onReorder={(items) => console.log("Reordered fields:", items)}
    />
  ),
};

/* Source: /settings/services — reorder clinic services */
export const ReorderServices: Story = {
  name: "Recipe: Services",
  render: () => (
    <ReorderDemo
      title="Reorder services"
      items={[
        { id: "svc-1", label: "Initial Assessment (60 min)" },
        { id: "svc-2", label: "Standard Consultation (30 min)" },
        { id: "svc-3", label: "Extended Consultation (50 min)" },
        { id: "svc-4", label: "Group Session (90 min)" },
        { id: "svc-5", label: "Telehealth Consultation (30 min)" },
        { id: "svc-6", label: "Report Writing (non-attendance)" },
      ]}
      onReorder={(items) => console.log("Reordered services:", items)}
    />
  ),
};

/* Source: /settings/templates — reorder sections within an appointment template */
export const ReorderTemplateSections: Story = {
  name: "Recipe: Template Sections",
  render: () => (
    <ReorderDemo
      title="Reorder template sections"
      items={[
        { id: "sec-1", label: "Presenting issue" },
        { id: "sec-2", label: "Session observations" },
        { id: "sec-3", label: "Interventions" },
        { id: "sec-4", label: "Client response" },
        { id: "sec-5", label: "Plan / next steps" },
      ]}
      onReorder={(items) => console.log("Reordered sections:", items)}
    />
  ),
};
