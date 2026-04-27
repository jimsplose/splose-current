import type { Meta, StoryObj } from "@storybook/react";
import Grid from "../Grid";
import Card from "../Card";
import Stat from "../Stat";
import Text from "../Text";
import FormInput from "../FormInput";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Grid> = {
  title: "Layout/Grid",
  component: Grid,
  tags: ["extended"],
  argTypes: {
    cols: {
      control: "select",
      options: [1, 2, 3, 4],
      description: "Number of equal-width columns (1-4)",
    },
    gap: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Gap between grid items (preset or pixel number)",
    },
    children: { control: false },
  },
  parameters: {
    layout: "padded",
    appPages: [
      { label: "New client form", vercel: "https://splose-current.vercel.app/clients/new", production: "https://acme.splose.com/patients/new" },
      { label: "Patient details", vercel: "https://splose-current.vercel.app/clients/cmngtw7n9005eycwg4e67506h", production: "https://acme.splose.com/patients/446604/details" },
      { label: "Settings — Forms (edit)", vercel: "https://splose-current.vercel.app/settings/forms/1", production: "https://acme.splose.com/settings/forms" },
      { label: "Settings — Details", vercel: "https://splose-current.vercel.app/settings/details", production: "https://acme.splose.com/settings/details" },
    ],
    referenceUrl: "https://ant.design/components/grid",
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

/* Helper: generic placeholder cell */
const Cell = ({ label }: { label: string }) => (
  <Card padding="md">
    <Text variant="body/md">{label}</Text>
  </Card>
);

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired -- use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    cols: 3,
    gap: "lg",
    children: (
      <>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Cell key={i} label={`Grid item ${i}`} />
        ))}
      </>
    ),
  },
  decorators: [(Story) => <div style={{ width: 720 }}>{Story()}</div>],
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const TwoColumns: Story = {
  args: { cols: 2, gap: "lg" },
  render: (args) => (
    <Grid {...args}>
      <Cell label="Column 1" />
      <Cell label="Column 2" />
    </Grid>
  ),
  decorators: [(Story) => <div style={{ width: 600 }}>{Story()}</div>],
};

export const ThreeColumns: Story = {
  args: { cols: 3, gap: "md" },
  render: (args) => (
    <Grid {...args}>
      <Cell label="Column 1" />
      <Cell label="Column 2" />
      <Cell label="Column 3" />
    </Grid>
  ),
  decorators: [(Story) => <div style={{ width: 720 }}>{Story()}</div>],
};

export const FourColumns: Story = {
  args: { cols: 4, gap: "md" },
  render: (args) => (
    <Grid {...args}>
      {["A", "B", "C", "D"].map((l) => (
        <Cell key={l} label={`Column ${l}`} />
      ))}
    </Grid>
  ),
  decorators: [(Story) => <div style={{ width: 800 }}>{Story()}</div>],
};

/* ================================================================== */
/*  3. ALL VARIANTS COMPARISON                                         */
/* ================================================================== */

/** Side-by-side comparison of column counts with different gap sizes. */
export const AllVariants: Story = {
  render: () => {
    const gaps = ["sm", "md", "lg"] as const;
    const colCounts = [2, 3, 4] as const;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 32, width: 800 }}>
        {colCounts.map((cols) =>
          gaps.map((gap) => (
            <div key={`${cols}-${gap}`}>
              <Text variant="caption/md" color="secondary" style={{ marginBottom: 8, display: "block" }}>
                cols={cols} gap=&quot;{gap}&quot;
              </Text>
              <Grid cols={cols} gap={gap}>
                {Array.from({ length: cols }, (_, i) => (
                  <Cell key={i} label={`${i + 1}`} />
                ))}
              </Grid>
            </div>
          )),
        )}
      </div>
    );
  },
};

/* ================================================================== */
/*  4. RECIPE STORIES -- real patterns from the Splose codebase        */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  DashboardStats                                                     */
/*  Pattern: 4 stat cards in a single row                              */
/*  Source: / -- dashboard overview metrics                             */
/* ------------------------------------------------------------------ */

export const DashboardStats: Story = {
  render: () => (
    <div style={{ width: 800 }}>
      <Grid cols={4} gap="md">
        <Card padding="md">
          <Stat label="Revenue" value="$48,795" description="+12.3% from last month" />
        </Card>
        <Card padding="md">
          <Stat label="Appointments" value="307" description="This month" />
        </Card>
        <Card padding="md">
          <Stat label="Utilisation" value="78.5%" description="-2.1% from last month" />
        </Card>
        <Card padding="md">
          <Stat label="New clients" value="24" description="+6 vs last month" />
        </Card>
      </Grid>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  SettingsFormLayout                                                  */
/*  Pattern: 2-column form field grid for settings pages               */
/*  Source: /settings -- practice details form                         */
/* ------------------------------------------------------------------ */

export const SettingsFormLayout: Story = {
  render: () => (
    <div style={{ width: 640 }}>
      <Card title="Practice details" padding="lg">
        <Grid cols={2} gap="md">
          <FormInput label="Practice name" defaultValue="East Melbourne Clinics" />
          <FormInput label="ABN" defaultValue="12 345 678 901" />
          <FormInput label="Phone" type="tel" defaultValue="03 9876 5432" />
          <FormInput label="Email" type="email" defaultValue="admin@eastclinics.com.au" />
          <FormInput label="Address" defaultValue="123 Collins St" />
          <FormInput label="Suburb" defaultValue="Melbourne" />
        </Grid>
      </Card>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  ReportMetricsRow                                                   */
/*  Pattern: 3 metric cards in a row for report summaries              */
/*  Source: /reports -- top-level KPI summary                          */
/* ------------------------------------------------------------------ */

export const ReportMetricsRow: Story = {
  render: () => (
    <div style={{ width: 720 }}>
      <Grid cols={3} gap="lg">
        <Card padding="md" shadow>
          <Stat label="Total billed" value="$126,400" description="Year to date" />
        </Card>
        <Card padding="md" shadow>
          <Stat label="Outstanding" value="$8,230" color="#ef4444" description="14 invoices pending" />
        </Card>
        <Card padding="md" shadow>
          <Stat label="Avg per session" value="$185" description="Across all practitioners" />
        </Card>
      </Grid>
    </div>
  ),
};
