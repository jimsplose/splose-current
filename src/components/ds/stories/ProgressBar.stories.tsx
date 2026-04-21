import type { Meta, StoryObj } from "@storybook/react";
import ProgressBar from "../ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "Data Display/ProgressBar",
  component: ProgressBar,
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    tone: { control: "select", options: ["default", "success", "warning", "danger"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Playground: Story = {
  args: { value: 65, tone: "default", size: "md" },
  decorators: [(Story) => <div style={{ width: 240 }}><Story /></div>],
};

export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 240 }}>
      <div>
        <div className="text-label-md text-text-secondary" style={{ marginBottom: 6 }}>default (65%)</div>
        <ProgressBar value={65} tone="default" />
      </div>
      <div>
        <div className="text-label-md text-text-secondary" style={{ marginBottom: 6 }}>success (80%)</div>
        <ProgressBar value={80} tone="success" />
      </div>
      <div>
        <div className="text-label-md text-text-secondary" style={{ marginBottom: 6 }}>warning (45%)</div>
        <ProgressBar value={45} tone="warning" />
      </div>
      <div>
        <div className="text-label-md text-text-secondary" style={{ marginBottom: 6 }}>danger (20%)</div>
        <ProgressBar value={20} tone="danger" />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 240 }}>
      <div>
        <div className="text-label-md text-text-secondary" style={{ marginBottom: 6 }}>sm (4px)</div>
        <ProgressBar value={60} size="sm" />
      </div>
      <div>
        <div className="text-label-md text-text-secondary" style={{ marginBottom: 6 }}>md (6px)</div>
        <ProgressBar value={60} size="md" />
      </div>
      <div>
        <div className="text-label-md text-text-secondary" style={{ marginBottom: 6 }}>lg (8px)</div>
        <ProgressBar value={60} size="lg" />
      </div>
    </div>
  ),
};

export const UtilisationBars: Story = {
  name: "Recipe: Utilisation Bars (reports table)",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {[
        { name: "Dr Emily Watson", utilisation: 8.5 },
        { name: "Rachel Kim", utilisation: 7.9 },
        { name: "Chris Lawson", utilisation: 6.9 },
      ].map((p) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ProgressBar value={Math.min(p.utilisation * 10, 100)} width={64} />
          <span className="text-body-md text-text-secondary">{(p.utilisation * 10).toFixed(1)}%</span>
        </div>
      ))}
    </div>
  ),
};
