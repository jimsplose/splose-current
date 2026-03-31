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
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  args: {
    children: <p className="text-body-md text-text-secondary">A basic card with default (md) padding.</p>,
  },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

export const WithTitle: Story = {
  args: {
    title: "SMS Balance",
    children: <p className="text-metric-lg text-text">884 credits</p>,
  },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

export const NoPadding: Story = {
  args: {
    padding: "none",
    children: (
      <div className="divide-y divide-border">
        <div className="text-body-md text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>Row one</div>
        <div className="text-body-md text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>Row two</div>
        <div className="text-body-md text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>Row three</div>
      </div>
    ),
  },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

export const SmallPadding: Story = {
  args: {
    padding: "sm",
    title: "Quick stats",
    children: <p className="text-body-md text-text-secondary">Compact card with small padding.</p>,
  },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

export const LargePadding: Story = {
  args: {
    padding: "lg",
    title: "Account overview",
    children: <p className="text-body-md text-text-secondary">Spacious card with large padding.</p>,
  },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
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
    <div style={{ display: 'grid', width: 600, gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
      {[
        { name: "Dr Sarah Chen", role: "Physiotherapist", color: "#7c3aed", specialty: "Sports Rehab", appts: 142 },
        { name: "Tom Wilson", role: "Occupational Therapist", color: "#2563eb", specialty: "Paediatrics", appts: 98 },
        { name: "Emma Davis", role: "Speech Pathologist", color: "#059669", specialty: null, appts: 67 },
        { name: "James Park", role: "Psychologist", color: "#d97706", specialty: "CBT", appts: 203 },
      ].map((p) => (
        <Card
          key={p.name}
          padding="none"
          style={{ cursor: 'pointer', padding: 24, transition: 'box-shadow 0.15s' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar name={p.name} color={p.color} size="xl" />
            <div style={{ minWidth: 0 }}>
              <h3 className="text-text" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>{p.name}</h3>
              <p className="text-text-secondary" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>{p.role}</p>
              {p.specialty && (
                <p className="text-text-secondary" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>{p.specialty}</p>
              )}
              <p className="text-caption-md text-text-secondary" style={{ marginTop: 4 }}>{p.appts} appointments</p>
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
    <div style={{ width: 600 }}>
      <Card padding="none">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>
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
    <div style={{ width: 480, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="Personal information">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormInput label="Full name" defaultValue="Dr Sarah Chen" />
          <FormInput label="Email" type="email" defaultValue="sarah@eastclinics.com.au" />
          <FormInput label="Phone" type="tel" defaultValue="0412 345 678" />
        </div>
      </Card>
      <Card title="Practice details">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
    <div style={{ display: 'grid', width: 600, gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <Card>
        <p className="text-caption-md text-text-secondary">Total revenue</p>
        <p className="text-metric-lg text-text" style={{ marginTop: 4 }}>$48,795</p>
        <p className="text-caption-md text-green-600" style={{ marginTop: 2 }}>+12.3% from last month</p>
      </Card>
      <Card>
        <p className="text-caption-md text-text-secondary">Appointments</p>
        <p className="text-metric-lg text-text" style={{ marginTop: 4 }}>307</p>
        <p className="text-caption-md text-text-secondary" style={{ marginTop: 2 }}>This month</p>
      </Card>
      <Card>
        <p className="text-caption-md text-text-secondary">Utilisation</p>
        <p className="text-metric-lg text-text" style={{ marginTop: 4 }}>78.5%</p>
        <p className="text-caption-md" style={{ marginTop: 2, color: '#ef4444' }}>-2.1% from last month</p>
      </Card>
    </div>
  ),
  parameters: { layout: "padded" },
};
