import type { Meta, StoryObj } from "@storybook/react";
import { FileTextOutlined, DatabaseOutlined } from "@ant-design/icons";
import Card, { type CardProps } from "../Card";
import Avatar from "../Avatar";
import Badge, { statusVariant } from "../Badge";
import { Button } from "antd";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import DataTable, { TableHead, Th, TableBody, Td, Tr } from "../DataTable";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Card> = {
  title: "Layout/Card",
  component: Card,
  tags: ["extended"],
  parameters: {
    appPages: [
      { label: "Dashboard", vercel: "https://splose-current.vercel.app/", localhost: "http://localhost:3000/", production: "https://acme.splose.com/" },
      { label: "Patient details", vercel: "https://splose-current.vercel.app/clients/cmngtw7n9005eycwg4e67506h", localhost: "http://localhost:3000/clients/cmngtw7n9005eycwg4e67506h", production: "https://acme.splose.com/patients/446604/details" },
      { label: "Patient invoices", vercel: "https://splose-current.vercel.app/clients/cmngtw7n9005eycwg4e67506h/invoices", localhost: "http://localhost:3000/clients/cmngtw7n9005eycwg4e67506h/invoices", production: "https://acme.splose.com/patients/446604/invoices" },
      { label: "New client form", vercel: "https://splose-current.vercel.app/clients/new", localhost: "http://localhost:3000/clients/new", production: "https://acme.splose.com/patients/new" },
    ],
    referenceUrl: "https://ant.design/components/card",
  },
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
    tint: {
      control: "select",
      options: ["default", "subtle", "muted"],
      description: "Background tint: default=transparent, subtle=fill-secondary, muted=fill-tertiary",
    },
    variant: {
      control: "select",
      options: ["default", "dashed"],
      description: "Border style: default=1px solid, dashed=2px dashed",
    },
    interactive: {
      control: "boolean",
      description: "Renders as <button> with hover/focus, for clickable card UIs",
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
    children: <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Card content goes here. Try changing padding and title.</p>,
  },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  args: {
    children: <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>A basic card with default (md) padding.</p>,
  },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

export const WithTitle: Story = {
  args: {
    title: "SMS Balance",
    children: <p style={{ fontFamily: "'Sprig Sans', 'Inter', sans-serif", fontSize: 30, fontWeight: 700, lineHeight: 1.2, fontVariantNumeric: 'tabular-nums', color: 'var(--color-text)' }}>884 credits</p>,
  },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

export const NoPadding: Story = {
  args: {
    padding: "none",
    children: (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>Row one</div>
        <div style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderTop: '1px solid var(--color-border)' }}>Row two</div>
        <div style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderTop: '1px solid var(--color-border)' }}>Row three</div>
      </div>
    ),
  },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

export const SmallPadding: Story = {
  args: {
    padding: "sm",
    title: "Quick stats",
    children: <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Compact card with small padding.</p>,
  },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

export const LargePadding: Story = {
  args: {
    padding: "lg",
    title: "Account overview",
    children: <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Spacious card with large padding.</p>,
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
              <h3 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--color-text)' }}>{p.name}</h3>
              <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, color: 'var(--color-text-secondary)' }}>{p.role}</p>
              {p.specialty && (
                <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, color: 'var(--color-text-secondary)' }}>{p.specialty}</p>
              )}
              <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)', marginTop: 4 }}>{p.appts} appointments</p>
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
            <h3 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)' }}>Practitioners</h3>
            <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>Breakdown of performance by individual practitioner</p>
          </div>
          <Button variant="ghost" size="small">...</Button>
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
              <Td style={{ color: 'var(--color-primary)' }}>Dr Sarah Chen</Td>
              <Td align="right">142</Td>
              <Td align="right">$26,270</Td>
              <Td><Badge variant={statusVariant("Active")}>Active</Badge></Td>
            </Tr>
            <Tr>
              <Td style={{ color: 'var(--color-primary)' }}>Tom Wilson</Td>
              <Td align="right">98</Td>
              <Td align="right">$18,130</Td>
              <Td><Badge variant={statusVariant("Active")}>Active</Badge></Td>
            </Tr>
            <Tr>
              <Td style={{ color: 'var(--color-primary)' }}>Emma Davis</Td>
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
        <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>Total revenue</p>
        <p style={{ fontFamily: "'Sprig Sans', 'Inter', sans-serif", fontSize: 30, fontWeight: 700, lineHeight: 1.2, fontVariantNumeric: 'tabular-nums', color: 'var(--color-text)', marginTop: 4 }}>$48,795</p>
        <p style={{ fontSize: 12, lineHeight: 1.67, color: '#16a34a', marginTop: 2 }}>+12.3% from last month</p>
      </Card>
      <Card>
        <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>Appointments</p>
        <p style={{ fontFamily: "'Sprig Sans', 'Inter', sans-serif", fontSize: 30, fontWeight: 700, lineHeight: 1.2, fontVariantNumeric: 'tabular-nums', color: 'var(--color-text)', marginTop: 4 }}>307</p>
        <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)', marginTop: 2 }}>This month</p>
      </Card>
      <Card>
        <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>Utilisation</p>
        <p style={{ fontFamily: "'Sprig Sans', 'Inter', sans-serif", fontSize: 30, fontWeight: 700, lineHeight: 1.2, fontVariantNumeric: 'tabular-nums', color: 'var(--color-text)', marginTop: 4 }}>78.5%</p>
        <p style={{ fontSize: 12, lineHeight: 1.67, marginTop: 2, color: '#ef4444' }}>-2.1% from last month</p>
      </Card>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ================================================================== */
/*  4. NEW PROP STORIES (tint / interactive / variant)                 */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  TintVariants                                                       */
/*  Shows all three tint values side-by-side                          */
/* ------------------------------------------------------------------ */

export const TintVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, width: 600 }}>
      {(["default", "subtle", "muted"] as CardProps["tint"][]).map((t) => (
        <Card key={t} tint={t}>
          <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 4 }}>{`tint="${t}"`}</p>
          <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
            {t === "default" && "Transparent background"}
            {t === "subtle" && "fill-secondary (#f3f5f7)"}
            {t === "muted" && "fill-tertiary (#f9fafb)"}
          </p>
        </Card>
      ))}
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  DashedVariant                                                      */
/*  Shows dashed border, standalone and with tint                     */
/* ------------------------------------------------------------------ */

export const DashedVariant: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 400 }}>
      <Card variant="dashed" padding="lg">
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>variant="dashed"</p>
          <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)', marginTop: 4 }}>2px dashed border, default background</p>
        </div>
      </Card>
      <Card variant="dashed" tint="muted" padding="lg">
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>variant="dashed" + tint="muted"</p>
          <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)', marginTop: 4 }}>Upload drop zones, placeholder areas</p>
        </div>
      </Card>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  InteractiveCards                                                   */
/*  Renders as <button> — source selection pattern from data-import   */
/* ------------------------------------------------------------------ */

export const InteractiveCards: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, width: 480 }}>
      <Card interactive padding={24} onClick={() => alert("CSV selected")}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
          <FileTextOutlined style={{ fontSize: 40, color: 'var(--color-primary)' }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)' }}>CSV</p>
            <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)', marginTop: 4 }}>Import clients, contacts, or appointments</p>
          </div>
        </div>
      </Card>
      <Card interactive padding={24} onClick={() => alert("Cliniko selected")}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
          <DatabaseOutlined style={{ fontSize: 40, color: 'var(--color-primary)' }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)' }}>Cliniko</p>
            <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)', marginTop: 4 }}>Migrate your data from Cliniko</p>
          </div>
        </div>
      </Card>
    </div>
  ),
  parameters: { layout: "padded" },
};
