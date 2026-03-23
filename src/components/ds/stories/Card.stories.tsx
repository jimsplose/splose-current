import type { Meta, StoryObj } from "@storybook/react";
import Card from "../Card";
import Avatar from "../Avatar";
import Badge, { statusVariant } from "../Badge";
import Button from "../Button";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import DataTable, { TableHead, Th, TableBody, Td, Tr } from "../DataTable";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Card> = {
  title: "Layout/Card",
  component: Card,
  argTypes: {
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
      description: "Internal padding preset",
    },
    title: {
      control: "text",
      description: "Optional card title (rendered as h3)",
    },
    children: {
      control: false,
      description: "Card body content",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    padding: "md",
    title: "Card title",
    children: <p className="text-body-md text-text-secondary">Card content goes here. Try changing padding and title.</p>,
  },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  args: {
    children: <p className="text-body-md text-text-secondary">A basic card with default (md) padding.</p>,
  },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
};

export const WithTitle: Story = {
  args: {
    title: "SMS Balance",
    children: <p className="text-metric-lg text-text">884 credits</p>,
  },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
};

export const NoPadding: Story = {
  args: {
    padding: "none",
    children: (
      <div className="divide-y divide-border">
        <div className="px-4 py-3 text-body-md text-text">Row one</div>
        <div className="px-4 py-3 text-body-md text-text">Row two</div>
        <div className="px-4 py-3 text-body-md text-text">Row three</div>
      </div>
    ),
  },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
};

export const SmallPadding: Story = {
  args: {
    padding: "sm",
    title: "Quick stats",
    children: <p className="text-body-md text-text-secondary">Compact card with small padding.</p>,
  },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
};

export const LargePadding: Story = {
  args: {
    padding: "lg",
    title: "Account overview",
    children: <p className="text-body-md text-text-secondary">Spacious card with large padding.</p>,
  },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  PractitionerCard                                                   */
/*  Pattern: Avatar + name + role + stats in a grid card               */
/*  Source: /practitioners page — practitioner directory                */
/* ------------------------------------------------------------------ */

export const PractitionerCard: Story = {
  render: () => (
    <div className="grid w-[600px] grid-cols-2 gap-6">
      {[
        { name: "Dr Sarah Chen", role: "Physiotherapist", color: "#7c3aed", specialty: "Sports Rehab", appts: 142 },
        { name: "Tom Wilson", role: "Occupational Therapist", color: "#2563eb", specialty: "Paediatrics", appts: 98 },
        { name: "Emma Davis", role: "Speech Pathologist", color: "#059669", specialty: null, appts: 67 },
        { name: "James Park", role: "Psychologist", color: "#d97706", specialty: "CBT", appts: 203 },
      ].map((p) => (
        <Card
          key={p.name}
          padding="none"
          className="cursor-pointer p-6 transition-shadow duration-150 hover:border-primary/30 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <Avatar name={p.name} color={p.color} size="xl" />
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-text">{p.name}</h3>
              <p className="truncate text-sm text-text-secondary">{p.role}</p>
              {p.specialty && (
                <p className="truncate text-sm text-text-secondary">{p.specialty}</p>
              )}
              <p className="mt-1 text-caption-md text-text-secondary">{p.appts} appointments</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  TableWrapper                                                       */
/*  Pattern: Card with padding=none wrapping a DataTable               */
/*  Source: /reports page — practitioners table in a card               */
/* ------------------------------------------------------------------ */

export const TableWrapper: Story = {
  render: () => (
    <div className="w-[600px]">
      <Card padding="none">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h3 className="text-heading-sm text-text">Practitioners</h3>
            <p className="text-caption-md text-text-secondary">Breakdown of performance by individual practitioner</p>
          </div>
          <Button variant="ghost" size="sm">...</Button>
        </div>
        <DataTable>
          <TableHead>
            <Th>Name</Th>
            <Th align="right">Appointments</Th>
            <Th align="right">Revenue</Th>
            <Th>Status</Th>
          </TableHead>
          <TableBody>
            <Tr>
              <Td className="text-primary">Dr Sarah Chen</Td>
              <Td align="right">142</Td>
              <Td align="right">$26,270</Td>
              <Td><Badge variant={statusVariant("Active")}>Active</Badge></Td>
            </Tr>
            <Tr>
              <Td className="text-primary">Tom Wilson</Td>
              <Td align="right">98</Td>
              <Td align="right">$18,130</Td>
              <Td><Badge variant={statusVariant("Active")}>Active</Badge></Td>
            </Tr>
            <Tr>
              <Td className="text-primary">Emma Davis</Td>
              <Td align="right">67</Td>
              <Td align="right">$12,395</Td>
              <Td><Badge variant={statusVariant("Active")}>Active</Badge></Td>
            </Tr>
          </TableBody>
        </DataTable>
      </Card>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  FormSection                                                        */
/*  Pattern: Card used to group related form fields                    */
/*  Source: /settings pages — grouped settings sections                */
/* ------------------------------------------------------------------ */

export const FormSection: Story = {
  render: () => (
    <div className="w-[480px] space-y-4">
      <Card title="Personal information">
        <div className="space-y-4">
          <FormInput label="Full name" defaultValue="Dr Sarah Chen" />
          <FormInput label="Email" type="email" defaultValue="sarah@eastclinics.com.au" />
          <FormInput label="Phone" type="tel" defaultValue="0412 345 678" />
        </div>
      </Card>
      <Card title="Practice details">
        <div className="space-y-4">
          <FormSelect
            label="Role"
            options={[
              { value: "physio", label: "Physiotherapist" },
              { value: "ot", label: "Occupational Therapist" },
              { value: "speech", label: "Speech Pathologist" },
            ]}
          />
          <FormInput label="Provider number" defaultValue="2429341T" />
        </div>
      </Card>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  StatCard                                                           */
/*  Pattern: Metric number + label in a card (reports dashboard)       */
/*  Source: /reports page — utilisation, revenue stat cards             */
/* ------------------------------------------------------------------ */

export const StatCard: Story = {
  render: () => (
    <div className="grid w-[600px] grid-cols-3 gap-4">
      <Card>
        <p className="text-caption-md text-text-secondary">Total revenue</p>
        <p className="mt-1 text-metric-lg text-text">$48,795</p>
        <p className="mt-0.5 text-caption-md text-green-600">+12.3% from last month</p>
      </Card>
      <Card>
        <p className="text-caption-md text-text-secondary">Appointments</p>
        <p className="mt-1 text-metric-lg text-text">307</p>
        <p className="mt-0.5 text-caption-md text-text-secondary">This month</p>
      </Card>
      <Card>
        <p className="text-caption-md text-text-secondary">Utilisation</p>
        <p className="mt-1 text-metric-lg text-text">78.5%</p>
        <p className="mt-0.5 text-caption-md text-red-500">-2.1% from last month</p>
      </Card>
    </div>
  ),
  parameters: { layout: "padded" },
};
