import type { Meta, StoryObj } from "@storybook/react";
import AppointmentCard from "../AppointmentCard";

const meta: Meta<typeof AppointmentCard> = {
  title: "Data Display/AppointmentCard",
  component: AppointmentCard,
  tags: ["custom"],
  argTypes: {
    status: {
      control: "select",
      options: ["scheduled", "confirmed", "completed", "no-show", "cancelled"],
    },
    density: {
      control: "radio",
      options: ["compact", "standard", "expanded"],
    },
    tone: { control: "color" },
  },
  parameters: {
    layout: "padded",
    splose: {
      status: "beta",
      summary:
        "Compact calendar/sidebar card rendering a single appointment (colour bar, time, patient, service, status).",
      whatToUseInstead:
        "Inline _calendarEvent_WaeeuXUs markup duplicated in calendar views and patient appointment lists.",
      referenceLibrary: "first-party",
      plan: "docs/ds-plans/AppointmentCard.md",
      source: "src/components/ds/AppointmentCard.tsx",
    },
    appPages: [
      {
        label: "Calendar",
        vercel: "https://splose-current.vercel.app/calendar",
        production: "https://acme.splose.com/calendar/week/25/3/2026",
      },
    ],
    referenceUrl: null,
  },
};
export default meta;
type Story = StoryObj<typeof AppointmentCard>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  args: {
    time: "9:00 AM – 9:30 AM",
    patientName: "Harry Nguyen",
    service: "Physio Initial",
    practitioner: "Dr Sarah Kim",
    status: "scheduled",
    density: "standard",
  },
  render: (args) => (
    <div style={{ width: 220 }}>
      <AppointmentCard {...args} />
    </div>
  ),
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

const base = {
  time: "10:00 AM – 10:30 AM",
  patientName: "Harry Nguyen",
  service: "Physio Initial",
  practitioner: "Dr Sarah Kim",
  location: "Room 2",
};

export const Compact: Story = {
  name: "Feature: Compact",
  render: () => (
    <div style={{ width: 220 }}>
      <AppointmentCard {...base} density="compact" />
    </div>
  ),
};

export const Standard: Story = {
  name: "Feature: Standard",
  render: () => (
    <div style={{ width: 220 }}>
      <AppointmentCard {...base} density="standard" />
    </div>
  ),
};

export const Expanded: Story = {
  name: "Feature: Expanded",
  render: () => (
    <div style={{ width: 260 }}>
      <AppointmentCard {...base} density="expanded" />
    </div>
  ),
};

export const StatusScheduled: Story = {
  name: "Feature: Status — scheduled",
  render: () => (
    <div style={{ width: 220 }}>
      <AppointmentCard {...base} status="scheduled" />
    </div>
  ),
};

export const StatusConfirmed: Story = {
  name: "Feature: Status — confirmed",
  render: () => (
    <div style={{ width: 220 }}>
      <AppointmentCard {...base} status="confirmed" />
    </div>
  ),
};

export const StatusCompleted: Story = {
  name: "Feature: Status — completed",
  render: () => (
    <div style={{ width: 220 }}>
      <AppointmentCard {...base} status="completed" />
    </div>
  ),
};

export const StatusNoShow: Story = {
  name: "Feature: Status — no-show",
  render: () => (
    <div style={{ width: 220 }}>
      <AppointmentCard {...base} status="no-show" />
    </div>
  ),
};

export const StatusCancelled: Story = {
  name: "Feature: Status — cancelled",
  render: () => (
    <div style={{ width: 220 }}>
      <AppointmentCard {...base} status="cancelled" />
    </div>
  ),
};

export const PractitionerColour: Story = {
  name: "Feature: Practitioner colour override",
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <div style={{ width: 200 }}>
        <AppointmentCard {...base} tone="#8250ff" />
      </div>
      <div style={{ width: 200 }}>
        <AppointmentCard {...base} tone="#f1c21b" patientName="Jamie Lee" />
      </div>
      <div style={{ width: 200 }}>
        <AppointmentCard {...base} tone="#0f62fe" patientName="Mira Chen" />
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  name: "Feature: Interactive (onClick)",
  render: () => (
    <div style={{ width: 220 }}>
      <AppointmentCard
        {...base}
        onClick={() => console.log("clicked")}
        onHover={() => console.log("hovered")}
      />
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const WeekViewGrid: Story = {
  name: "Recipe: Week View Grid",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 140px)",
        gap: 4,
        padding: 12,
        background: "#fafafa",
        borderRadius: 6,
      }}
    >
      {[
        { time: "9:00", name: "Harry N.", tone: "#5578FF" },
        { time: "9:30", name: "Mira C.", tone: "#24a148" },
        { time: "10:00", name: "Jamie L.", tone: "#8250ff" },
        { time: "10:30", name: "Sam R.", tone: "#0f62fe", status: "cancelled" as const },
        { time: "11:00", name: "Alex P.", tone: "#f1c21b" },
      ].map((a, i) => (
        <AppointmentCard
          key={i}
          time={a.time}
          patientName={a.name}
          tone={a.tone}
          status={a.status}
          density="compact"
        />
      ))}
    </div>
  ),
};

export const DayViewHour: Story = {
  name: "Recipe: Day View Hour (stacked)",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 300 }}>
      <AppointmentCard
        time="9:00 – 9:30"
        patientName="Harry Nguyen"
        service="Initial consult"
        tone="#5578FF"
      />
      <AppointmentCard
        time="9:30 – 10:00"
        patientName="Mira Chen"
        service="Follow-up"
        tone="#24a148"
      />
      <AppointmentCard
        time="10:00 – 10:30"
        patientName="Jamie Lee"
        service="Physio review"
        tone="#8250ff"
        status="completed"
      />
    </div>
  ),
};

export const PatientAppointmentList: Story = {
  name: "Recipe: Patient Appointment List",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 420 }}>
      {[
        { time: "Tue 22 Apr · 9:00 AM", status: "confirmed" as const },
        { time: "Thu 24 Apr · 10:00 AM", status: "scheduled" as const },
        { time: "Fri 25 Apr · 2:30 PM", status: "cancelled" as const },
      ].map((a, i) => (
        <AppointmentCard
          key={i}
          time={a.time}
          patientName="Harry Nguyen"
          service="Physio Initial"
          practitioner="Dr Sarah Kim"
          location="Room 2"
          status={a.status}
          density="expanded"
        />
      ))}
    </div>
  ),
};
