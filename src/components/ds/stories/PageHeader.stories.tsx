import type { Meta, StoryObj } from "@storybook/react";
import PageHeader from "../PageHeader";
import Button from "../Button";

const meta: Meta<typeof PageHeader> = {
  title: "Design System/PageHeader",
  component: PageHeader,
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const TitleOnly: Story = {
  args: { title: "Clients" },
};

export const WithActions: Story = {
  render: () => (
    <PageHeader title="Invoices">
      <Button variant="secondary">Export</Button>
      <Button variant="primary">+ New Invoice</Button>
    </PageHeader>
  ),
};
