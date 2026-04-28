import type { Meta, StoryObj } from "@storybook/react";
import Divider from "../Divider";

const meta: Meta<typeof Divider> = {
  title: "Layout/Divider",
  component: Divider,
  tags: ["extended"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "subtle", "primary"],
      description: "Border color intensity",
    },
    spacing: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg"],
      description: "Margin — vertical (horizontal/default) or horizontal (vertical orientation)",
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Horizontal rule or inline vertical separator",
    },
  },
  parameters: {
    layout: "padded",
    appPages: [
      { label: "Dashboard", vercel: "https://splose-current.vercel.app/", localhost: "http://localhost:3000/", production: "https://acme.splose.com/" },
      { label: "Patient details", vercel: "https://splose-current.vercel.app/clients/cmngtw7n9005eycwg4e67506h", localhost: "http://localhost:3000/clients/cmngtw7n9005eycwg4e67506h", production: "https://acme.splose.com/patients/446604/details" },
      { label: "Settings — Details", vercel: "https://splose-current.vercel.app/settings/details", localhost: "http://localhost:3000/settings/details", production: "https://acme.splose.com/settings/details" },
      { label: "Waitlist", vercel: "https://splose-current.vercel.app/waitlist", localhost: "http://localhost:3000/waitlist", production: "https://acme.splose.com/waitlist" },
    ],
    referenceUrl: "https://ant.design/components/divider",
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Playground: Story = {
  args: { variant: "default", spacing: "md", orientation: "horizontal" },
};

export const AllSpacings: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <p style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>spacing=&quot;none&quot;</p>
      <Divider spacing="none" />
      <p style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>spacing=&quot;xs&quot;</p>
      <Divider spacing="xs" />
      <p style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>spacing=&quot;sm&quot;</p>
      <Divider spacing="sm" />
      <p style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>spacing=&quot;md&quot; (default)</p>
      <Divider spacing="md" />
      <p style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>spacing=&quot;lg&quot;</p>
      <Divider spacing="lg" />
      <p style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>End</p>
    </div>
  ),
};

export const Subtle: Story = {
  args: { variant: "subtle", spacing: "md" },
};

export const Orientation: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <p style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.67, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Horizontal (default)</p>
        <div style={{ width: 400 }}>
          <Divider orientation="horizontal" spacing="md" />
        </div>
      </div>
      <div>
        <p style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.67, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Vertical — toolbar separator (spacing=&quot;none&quot;)</p>
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 8px", border: "1px solid var(--color-border)", borderRadius: 6 }}>
          <button style={{ padding: "2px 6px", fontSize: 12, fontWeight: 700 }}>B</button>
          <button style={{ padding: "2px 6px", fontSize: 12, fontStyle: "italic" }}>I</button>
          <Divider orientation="vertical" spacing="none" />
          <button style={{ padding: "2px 6px", fontSize: 12 }}>Link</button>
          <button style={{ padding: "2px 6px", fontSize: 12 }}>Table</button>
          <Divider orientation="vertical" spacing="none" />
          <button style={{ padding: "2px 6px", fontSize: 12 }}>AI</button>
        </div>
      </div>
      <div>
        <p style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.67, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Vertical — with spacing=&quot;xs&quot; (4px each side)</p>
        <div style={{ display: "flex", alignItems: "center", padding: "6px 8px", border: "1px solid var(--color-border)", borderRadius: 6 }}>
          <button style={{ padding: "2px 6px", fontSize: 12, fontWeight: 700 }}>B</button>
          <button style={{ padding: "2px 6px", fontSize: 12, fontStyle: "italic" }}>I</button>
          <Divider orientation="vertical" spacing="xs" />
          <button style={{ padding: "2px 6px", fontSize: 12 }}>Link</button>
        </div>
      </div>
    </div>
  ),
};
