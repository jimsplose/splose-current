import type { Meta, StoryObj } from "@storybook/react";
import DetailPage from "../DetailPage";
import { Button } from "antd";
import Card from "../Card";
import Badge from "../Badge";
import Tab from "../Tab";
import type { TabItem } from "../Tab";

const meta: Meta<typeof DetailPage> = {
  title: "Templates/DetailPage",
  component: DetailPage,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof DetailPage>;

const sampleTabs: TabItem[] = [
  { key: "overview", label: "Overview" },
  { key: "appointments", label: "Appointments" },
  { key: "invoices", label: "Invoices" },
  { key: "notes", label: "Notes" },
];

export const Playground: Story = {
  args: {
    title: "Sarah Mitchell",
    subtitle: "s.mitchell@email.com · (08) 7074 0000",
    actions: (
      <>
        <Button variant="secondary">Edit</Button>
        <Button variant="primary">New appointment</Button>
      </>
    ),
    tabs: <Tab items={sampleTabs} activeKey="overview" onChange={() => {}} />,
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card title="Personal details">
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>Date of birth: 15 Mar 1985</p>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>Gender: Female</p>
        </Card>
        <Card title="Recent appointments">
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>No upcoming appointments.</p>
        </Card>
      </div>
    ),
  },
};

/*  Source: /clients/[id] — client detail with sidebar  */
export const ClientDetailRecipe: Story = {
  name: "Recipe: Client Detail",
  render: () => (
    <DetailPage
      title="Skyler Peterson"
      subtitle="skyler@email.com · +61 412 345 678"
      actions={
        <>
          <Badge variant="green">Active</Badge>
          <Button variant="secondary">Edit</Button>
          <Button variant="primary">New appointment</Button>
        </>
      }
      tabs={<Tab items={sampleTabs} activeKey="overview" onChange={() => {}} />}
      sidebar={
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card title="Quick info" padding="sm">
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>NDIS #: 4312876543</p>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Medicare: 2456 78901 2</p>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Plan dates: 1 Jan – 30 Jun 2026</p>
          </Card>
          <Card title="Tags" padding="sm">
            <Badge variant="green" shape="pill">NDIS</Badge>{" "}
            <Badge variant="purple" shape="pill">Physio</Badge>
          </Card>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card title="Upcoming appointments">
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>Physiotherapy — 15 Apr 2026, 10:00 AM</p>
        </Card>
        <Card title="Recent notes">
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>Progress note from 2 Apr 2026</p>
        </Card>
      </div>
    </DetailPage>
  ),
};
