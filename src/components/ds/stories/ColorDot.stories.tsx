import type { Meta, StoryObj } from "@storybook/react";
import ColorDot from "../ColorDot";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof ColorDot> = {
  title: "Data Display/ColorDot",
  component: ColorDot,
  argTypes: {
    color: {
      control: "color",
      description: "CSS color value (hex, rgb, etc.)",
    },
    size: {
      control: "radio",
      options: ["xs", "sm", "md", "lg"],
      description: "xs=8px, sm=12px, md=16px, lg=20px",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ColorDot>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    color: "#7c3aed",
    size: "sm",
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES — one per size                                  */
/* ================================================================== */

export const ExtraSmall: Story = {
  args: { color: "#ef4444", size: "xs" },
};

export const Small: Story = {
  args: { color: "#ef4444", size: "sm" },
};

export const Medium: Story = {
  args: { color: "#3b82f6", size: "md" },
};

export const Large: Story = {
  args: { color: "#22c55e", size: "lg" },
};

/* ------------------------------------------------------------------ */
/*  All Sizes side-by-side                                             */
/* ------------------------------------------------------------------ */

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(["xs", "sm", "md", "lg"] as const).map((s) => (
        <div key={s} className="flex flex-col items-center gap-1">
          <ColorDot color="#7c3aed" size={s} />
          <span className="text-xs text-text-secondary">{s}</span>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Color palette                                                      */
/* ------------------------------------------------------------------ */

export const AllColors: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <ColorDot color="#ef4444" />
      <ColorDot color="#f59e0b" />
      <ColorDot color="#22c55e" />
      <ColorDot color="#3b82f6" />
      <ColorDot color="#8b5cf6" />
      <ColorDot color="#6b7280" />
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  ChartLegend                                                        */
/*  Pattern: Small color dots with labels used as chart legends         */
/*  Source: /page.tsx (Dashboard) — income chart with Invoices/Payments */
/*  legend items using xs dots with CSS variable colors                 */
/* ------------------------------------------------------------------ */

export const ChartLegend: Story = {
  name: "Recipe: Chart Legend",
  render: () => (
    <div className="w-96 rounded-lg border border-border bg-white p-4">
      <p className="mb-3 text-label-lg text-text">Income</p>
      {/* Simulated bar chart placeholder */}
      <div className="mb-3 flex h-32 items-end gap-2">
        {[60, 80, 45, 70, 90, 55, 75, 65, 85, 50, 95, 70].map((h, i) => (
          <div key={i} className="flex flex-1 flex-col items-stretch gap-0.5">
            <div className="rounded-sm bg-[#bef264]" style={{ height: `${h * 0.6}%` }} />
            <div className="rounded-sm bg-[#c084fc]" style={{ height: `${h * 0.4}%` }} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 text-caption-md text-text-secondary">
        <span className="flex items-center gap-1.5">
          <ColorDot color="#bef264" size="xs" /> Invoices
        </span>
        <span className="flex items-center gap-1.5">
          <ColorDot color="#c084fc" size="xs" /> Payments
        </span>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  PractitionerIndicator                                              */
/*  Pattern: Colored dot + practitioner first name as calendar headers  */
/*  Source: /calendar — CalendarView.tsx practitioner column headers     */
/* ------------------------------------------------------------------ */

export const PractitionerIndicator: Story = {
  name: "Recipe: Practitioner Indicator",
  render: () => (
    <div className="flex gap-6 border-b border-border pb-3">
      {[
        { name: "Joseph Go", color: "#f59e0b" },
        { name: "Hao Wang", color: "#16a34a" },
        { name: "Meghna Damodaran", color: "#ec4899" },
        { name: "Sarah Johnson", color: "#3b82f6" },
      ].map((p) => (
        <div key={p.name} className="flex items-center gap-1">
          <ColorDot color={p.color} size="xs" />
          <span className="truncate text-label-md text-text">
            {p.name.split(" ")[0]} {p.name.split(" ")[1]?.[0]}.
          </span>
        </div>
      ))}
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  RoomsResourcesTable                                                */
/*  Pattern: ColorDot next to room name in a settings table row.       */
/*  Each room has a unique color shown as a small dot before the name.  */
/*  Source: /settings/rooms-resources page — ColorDot in Name column    */
/* ------------------------------------------------------------------ */

export const RoomsResourcesTable: Story = {
  name: "Recipe: Rooms & Resources Table",
  render: () => (
    <div className="w-[600px]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-table-header">
            <th className="px-4 py-3 text-left text-label-lg text-text">Name</th>
            <th className="px-4 py-3 text-left text-label-lg text-text">Group</th>
            <th className="px-4 py-3 text-left text-label-lg text-text">Capacity</th>
            <th className="px-4 py-3 text-left text-label-lg text-text">Location</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {[
            { name: "Room 1", color: "#ef4444", group: "Treatment", capacity: 1, location: "East Clinics" },
            { name: "Room 2", color: "#3b82f6", group: "Treatment", capacity: 2, location: "East Clinics" },
            { name: "Gym", color: "#22c55e", group: "Exercise", capacity: 8, location: "West Clinics" },
            { name: "Pool", color: "#f59e0b", group: "Hydrotherapy", capacity: 4, location: "West Clinics" },
          ].map((room) => (
            <tr key={room.name} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-body-md text-text">
                <div className="flex items-center gap-2.5">
                  <ColorDot color={room.color} />
                  {room.name}
                </div>
              </td>
              <td className="px-4 py-3 text-body-md text-text-secondary">{room.group}</td>
              <td className="px-4 py-3 text-body-md text-text-secondary">{room.capacity}</td>
              <td className="px-4 py-3 text-body-md text-text-secondary">{room.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  BusyTimeNameColumn                                                 */
/*  Pattern: ColorDot paired with busy time name in a table. Each      */
/*  busy time type has a distinct color to match calendar events.       */
/*  Source: /settings/busy-times page — ColorDot in Name column         */
/* ------------------------------------------------------------------ */

export const BusyTimeNameColumn: Story = {
  name: "Recipe: Busy Time Name Column",
  render: () => (
    <div className="w-[500px]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-table-header">
            <th className="px-4 py-3 text-left text-label-lg text-text">Name</th>
            <th className="px-4 py-3 text-left text-label-lg text-text">Utilisation</th>
            <th className="px-4 py-3 text-left text-label-lg text-text">Duration (mins)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {[
            { name: "Leave me alone", color: "#ef4444", util: "Excluded", dur: 15 },
            { name: "Meeting", color: "#1f2937", util: "Excluded", dur: 30 },
            { name: "Lunch", color: "#6366f1", util: "Excluded", dur: 30 },
            { name: "Admin", color: "#a855f7", util: "Included", dur: 30 },
            { name: "CPD", color: "#3b82f6", util: "Excluded", dur: 30 },
            { name: "Travel", color: "#22c55e", util: "Excluded", dur: 30 },
          ].map((b) => (
            <tr key={b.name} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-body-md text-text">
                <div className="flex items-center gap-2">
                  <ColorDot color={b.color} />
                  {b.name}
                </div>
              </td>
              <td className="px-4 py-3 text-body-md text-text-secondary">{b.util}</td>
              <td className="px-4 py-3 text-body-md text-text-secondary">{b.dur}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  AppointmentDetailHeader                                            */
/*  Pattern: ColorDot next to the appointment client name + type in    */
/*  the calendar appointment side panel header. Color indicates the    */
/*  practitioner assigned to the appointment.                          */
/*  Source: /calendar CalendarView.tsx — appointment detail panel       */
/* ------------------------------------------------------------------ */

export const AppointmentDetailHeader: Story = {
  name: "Recipe: Appointment Detail Header",
  render: () => (
    <div className="w-80 rounded-lg border border-border bg-white p-4">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <ColorDot color="#f59e0b" size="sm" />
          <span className="text-heading-sm text-text">Sarah Johnson (Initial Assessment)</span>
        </div>
        <button className="text-text-secondary hover:text-text">&times;</button>
      </div>
      <div className="space-y-2 text-body-md">
        <p className="text-text-secondary">9:00 AM - 10:00 AM</p>
        <p className="text-text-secondary">Joseph Go</p>
        <p className="text-text-secondary">Room 1 - East Clinics</p>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
