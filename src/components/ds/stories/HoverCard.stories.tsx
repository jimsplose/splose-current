import type { Meta, StoryObj } from "@storybook/react";
import HoverCard from "../HoverCard";
import PatientAvatar from "../PatientAvatar";
import { Tag } from "antd";

const meta: Meta<typeof HoverCard> = {
  title: "Overlays/HoverCard",
  component: HoverCard,
  tags: ["extended"],
  parameters: {
    layout: "padded",
    appPages: [
      {
        label: "Calendar (hover preview on appointments / patient avatars)",
        vercel: "https://splose-current.vercel.app/calendar",
        production: "https://acme.splose.com/calendar/week/25/3/2026",
      },
    ],
    referenceUrl: "https://www.radix-ui.com/primitives/docs/components/hover-card",
    splose: {
      status: "beta",
      summary:
        "Hover-triggered rich preview for patients, appointments, and linked records.",
      whatToUseInstead:
        "Raw AntD Popover with trigger=\"hover\" and manual safe-triangle workarounds.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/HoverCard.md",
      source: "src/components/ds/HoverCard.tsx",
    },
  },
};
export default meta;
type Story = StoryObj<typeof HoverCard>;

const harry = { id: "446604", firstName: "Harry", lastName: "Nguyen" };

const patientPreview = (
  <div style={{ display: "flex", gap: 12 }}>
    <PatientAvatar patient={harry} size="md" />
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontWeight: 600 }}>Harry Nguyen</div>
      <div style={{ fontSize: 12, color: "#6E6E64" }}>Last visit: 10/04/2026</div>
      <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
        <Tag color="#f1c21b">VIP</Tag>
        <Tag color="#0f62fe">NDIS</Tag>
      </div>
    </div>
  </div>
);

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  args: { content: patientPreview, side: "top", align: "center" },
  render: (args) => (
    <div style={{ padding: 80 }}>
      <HoverCard {...args}>
        <a style={{ color: "#5578FF" }}>Hover: Harry Nguyen</a>
      </HoverCard>
    </div>
  ),
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Sides: Story = {
  name: "Feature: Sides",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, auto)", gap: 40, padding: 120 }}>
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <HoverCard key={side} side={side} content={<div style={{ fontSize: 13 }}>Card on {side}</div>}>
          <a style={{ color: "#5578FF" }}>{side}</a>
        </HoverCard>
      ))}
    </div>
  ),
};

export const WithAvatar: Story = {
  name: "Feature: With Avatar",
  render: () => (
    <div style={{ padding: 80 }}>
      <HoverCard content={patientPreview}>
        <a style={{ color: "#5578FF" }}>Harry Nguyen</a>
      </HoverCard>
    </div>
  ),
};

export const WithLink: Story = {
  name: "Feature: With Link",
  render: () => (
    <div style={{ padding: 80 }}>
      <HoverCard
        content={
          <div>
            {patientPreview}
            <a
              style={{
                display: "inline-block",
                marginTop: 8,
                color: "#5578FF",
                fontSize: 13,
              }}
              href="/patients/446604"
            >
              View patient →
            </a>
          </div>
        }
      >
        <a style={{ color: "#5578FF" }}>Harry Nguyen</a>
      </HoverCard>
    </div>
  ),
};

export const LongContent: Story = {
  name: "Feature: Long Content",
  render: () => (
    <div style={{ padding: 80 }}>
      <HoverCard
        content={
          <div style={{ fontSize: 13, lineHeight: 1.5 }}>
            A longer preview paragraph showing how the card wraps to its 320px
            max-width. Useful for record summaries where a tooltip would be
            too short but a full modal would be overkill.
          </div>
        }
      >
        <a style={{ color: "#5578FF" }}>hover for summary</a>
      </HoverCard>
    </div>
  ),
};

export const DelayControls: Story = {
  name: "Feature: Delay Controls",
  render: () => (
    <div style={{ display: "flex", gap: 24, padding: 80 }}>
      <HoverCard openDelay={0} closeDelay={0} content={<div>No delay</div>}>
        <a>Instant</a>
      </HoverCard>
      <HoverCard content={<div>Default delays</div>}>
        <a>400/200</a>
      </HoverCard>
      <HoverCard openDelay={1000} closeDelay={600} content={<div>Slow delays</div>}>
        <a>1000/600</a>
      </HoverCard>
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const PatientHoverPreview: Story = {
  name: "Recipe: Patient Hover Preview",
  render: () => (
    <div style={{ padding: 80 }}>
      <span>Row: </span>
      <HoverCard content={patientPreview}>
        <a style={{ color: "#5578FF" }}>Harry Nguyen</a>
      </HoverCard>
      <span style={{ color: "#6E6E64" }}> · Initial consult · 22/04/2026</span>
    </div>
  ),
};

export const AppointmentAgendaHover: Story = {
  name: "Recipe: Appointment Agenda Hover",
  render: () => (
    <div style={{ padding: 80 }}>
      <HoverCard
        content={
          <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
            <div style={{ fontWeight: 600 }}>Initial consult — Harry Nguyen</div>
            <div style={{ color: "#6E6E64" }}>Tue 22 Apr · 10:00 AM · 60 min</div>
            <div style={{ color: "#6E6E64" }}>Dr Sarah Kim · Room 2</div>
          </div>
        }
      >
        <a>10:00 — Harry Nguyen</a>
      </HoverCard>
    </div>
  ),
};

export const InvoiceClientHover: Story = {
  name: "Recipe: Invoice Client Hover",
  render: () => (
    <div style={{ padding: 80 }}>
      <HoverCard content={patientPreview}>
        <a style={{ color: "#5578FF" }}>Client: Harry Nguyen</a>
      </HoverCard>
    </div>
  ),
};
