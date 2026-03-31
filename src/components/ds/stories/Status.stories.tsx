import type { Meta, StoryObj } from "@storybook/react";
import Status from "../Status";
import Badge, { statusVariant } from "../Badge";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Status> = {
  title: "Data Display/Status",
  component: Status,
  argTypes: {
    color: {
      control: "select",
      options: ["green", "red", "yellow", "blue", "gray", "purple", "orange"],
      description: "Color of the status dot",
    },
    label: {
      control: "text",
      description: "Optional text label beside the dot",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Status>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    color: "green",
    label: "Active",
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES — one per color                                 */
/* ================================================================== */

export const Green: Story = {
  args: { color: "green", label: "Active" },
};

export const Blue: Story = {
  args: { color: "blue", label: "Upcoming" },
};

export const Yellow: Story = {
  args: { color: "yellow", label: "Pending" },
};

export const Red: Story = {
  args: { color: "red", label: "Cancelled" },
};

export const Gray: Story = {
  args: { color: "gray", label: "Draft" },
};

export const Purple: Story = {
  args: { color: "purple", label: "In progress" },
};

export const Orange: Story = {
  args: { color: "orange", label: "Archived" },
};

export const DotOnly: Story = {
  args: { color: "blue" },
};

/* ------------------------------------------------------------------ */
/*  All Colors side-by-side                                            */
/* ------------------------------------------------------------------ */

export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Status color="green" label="Active" />
      <Status color="red" label="Cancelled" />
      <Status color="yellow" label="Pending" />
      <Status color="blue" label="Upcoming" />
      <Status color="gray" label="Draft" />
      <Status color="purple" label="In progress" />
      <Status color="orange" label="Archived" />
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  AppointmentStatusColumn                                            */
/*  Pattern: Status dots + text in an appointments table               */
/*  Source: /clients/[id]/appointments — green/blue/red/gray dots      */
/*  next to the appointment date & time                                */
/* ------------------------------------------------------------------ */

export const AppointmentStatusColumn: Story = {
  name: "Recipe: Appointment Status Column",
  render: () => (
    <div style={{ width: 700 }}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr className="border-border bg-table-header" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>When</th>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Where</th>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Type</th>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Practitioner</th>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Invoice status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {[
            { date: "Sat 7 Feb 2026, 1:30 pm", where: "East Clinics", type: "Standard", prac: "Emma Thompson", status: "Draft", color: "green" as const },
            { date: "Fri 6 Feb 2026, 10:00 am", where: "East Clinics", type: "Initial Assessment", prac: "James Wilson", status: "Paid", color: "blue" as const },
            { date: "Thu 5 Feb 2026, 2:00 pm", where: "West Clinics", type: "Follow Up", prac: "Lisa Adams", status: "Cancelled", color: "red" as const },
            { date: "Wed 4 Feb 2026, 9:00 am", where: "East Clinics", type: "Standard", prac: "Emma Thompson", status: "Do not invoice", color: "gray" as const },
          ].map((a) => (
            <tr key={a.date} >
              <td className="text-body-md text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Status color={a.color} />
                  {a.date}
                </div>
              </td>
              <td className="text-body-md text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>{a.where}</td>
              <td className="text-body-md text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>{a.type}</td>
              <td className="text-body-md text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>{a.prac}</td>
              <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>
                <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  ProgressNotesPractitioner                                          */
/*  Pattern: Status dots with practitioner names in reports            */
/*  Source: /reports/progress-notes — green/purple dots next to names  */
/* ------------------------------------------------------------------ */

export const ProgressNotesPractitioner: Story = {
  name: "Recipe: Progress Notes Practitioner",
  render: () => (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 12, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 16 }}>
      <p className="text-label-lg text-text">Practitioners</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Status color="green" label="AAA TEST" />
        <Status color="purple" label="Bill Gates Demo" />
        <Status color="green" label="Ruvi R." />
        <Status color="purple" label="Zoe Gomez" />
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
