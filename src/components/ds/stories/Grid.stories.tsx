import type { Meta, StoryObj } from "@storybook/react";
import Grid from "../Grid";
import Card from "../Card";
import Text from "../Text";

const meta: Meta<typeof Grid> = {
  title: "Layout/Grid",
  component: Grid,
  argTypes: {
    cols: { control: "select", options: [1, 2, 3, 4] },
    gap: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const Playground: Story = {
  args: {
    cols: 3,
    gap: "lg",
    children: (
      <>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} padding="md">
            <Text variant="body/md">Grid item {i}</Text>
          </Card>
        ))}
      </>
    ),
  },
  decorators: [(Story) => <div style={{ width: 600 }}>{Story()}</div>],
};

export const TwoColumns: Story = {
  args: { cols: 2, gap: "lg" },
  render: (args) => (
    <Grid {...args}>
      <Card padding="md"><Text variant="heading/sm">Column 1</Text></Card>
      <Card padding="md"><Text variant="heading/sm">Column 2</Text></Card>
    </Grid>
  ),
  decorators: [(Story) => <div style={{ width: 600 }}>{Story()}</div>],
};

export const FourColumns: Story = {
  args: { cols: 4, gap: "md" },
  render: (args) => (
    <Grid {...args}>
      {["Revenue", "Appointments", "Utilisation", "Clients"].map((label) => (
        <Card key={label} padding="md">
          <Text variant="caption/md" color="secondary">{label}</Text>
          <Text variant="metric/lg">$12,450</Text>
        </Card>
      ))}
    </Grid>
  ),
  decorators: [(Story) => <div style={{ width: 700 }}>{Story()}</div>],
};
