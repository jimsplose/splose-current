import { useState } from "react";
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
      control: "text",
      description: "CSS color (hex, rgb) OR semantic token: green/red/yellow/blue/gray/purple/orange",
    },
    size: {
      control: "radio",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "xs=8px, sm=12px, md=16px, lg=20px, xl=28px",
    },
    shape: {
      control: "radio",
      options: ["circle", "rect"],
      description: "circle (default) or rectangular swatch",
    },
    label: {
      control: "text",
      description: "Optional label rendered to the right of the dot",
    },
    interactive: {
      control: "boolean",
      description: "Renders as a <button> with cursor:pointer",
    },
    selected: {
      control: "boolean",
      description: "Shows a selection ring (only meaningful when interactive=true)",
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
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <ColorDot color="#7c3aed" size={s} />
          <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{s}</span>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Rect shape                                                         */
/*  As used in settings/tags — colour preview swatch in a table row    */
/* ------------------------------------------------------------------ */

export const RectShape: Story = {
  name: "Shape: Rect Swatches",
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {["#EAB308", "#22C55E", "#EF4444", "#2563EB", "#7C3AED"].map((c) => (
        <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ColorDot color={c} shape="rect" size="md" />
          <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>{c}</span>
        </div>
      ))}
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  Interactive swatches                                               */
/*  As used in settings/online-bookings — accessible colour selector   */
/* ------------------------------------------------------------------ */

const DEMO_SWATCHES = ["#7c3aed", "#f97316", "#10b981", "#3b82f6", "#ef4444", "#f59e0b", "#1e3a5f", "#ec4899"];

export const InteractiveSwatches: Story = {
  name: "Interactive: Color Selector",
  render: () => {
    const [selected, setSelected] = useState("#7c3aed");
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>Accessible colour suggestions</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {DEMO_SWATCHES.map((color) => (
            <ColorDot
              key={color}
              color={color}
              size="xl"
              shape="circle"
              interactive
              selected={selected === color}
              onClick={() => setSelected(color)}
            />
          ))}
        </div>
        <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>Selected: <code>{selected}</code></p>
      </div>
    );
  },
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  Color palette                                                      */
/* ------------------------------------------------------------------ */

export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <ColorDot color="#ef4444" />
      <ColorDot color="#f59e0b" />
      <ColorDot color="#22c55e" />
      <ColorDot color="#3b82f6" />
      <ColorDot color="#8b5cf6" />
      <ColorDot color="#6b7280" />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Semantic color tokens                                              */
/*  Pass green/red/yellow/blue/gray/purple/orange instead of hex       */
/* ------------------------------------------------------------------ */

export const SemanticColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
      {(['green', 'red', 'yellow', 'blue', 'gray', 'purple', 'orange'] as const).map((token) => (
        <div key={token} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <ColorDot color={token} size="sm" />
          <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{token}</span>
        </div>
      ))}
    </div>
  ),
  parameters: { layout: 'padded' },
};

/* ------------------------------------------------------------------ */
/*  WithLabel                                                          */
/*  Replaces the deleted Status component — dot + inline label text    */
/* ------------------------------------------------------------------ */

export const WithLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ColorDot color="green" label="Active" />
      <ColorDot color="red" label="Overdue" />
      <ColorDot color="purple" label="Bill Gates Demo" />
      <ColorDot color="gray" label="No status" />
      <ColorDot color="blue" label="Ruvi R." />
    </div>
  ),
  parameters: { layout: 'padded' },
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
    <div style={{ width: 384, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 16 }}>
      <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 12 }}>Income</p>
      {/* Simulated bar chart placeholder */}
      <div style={{ marginBottom: 12, display: 'flex', height: 128, alignItems: 'flex-end', gap: 8 }}>
        {[60, 80, 45, 70, 90, 55, 75, 65, 85, 50, 95, 70].map((h, i) => (
          <div key={i} style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'stretch', gap: 2 }}>
            <div style={{ borderRadius: 2, backgroundColor: '#bef264' }} style={{ height: `${h * 0.6}%` }} />
            <div style={{ borderRadius: 2, backgroundColor: '#c084fc' }} style={{ height: `${h * 0.4}%` }} />
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ColorDot color="#bef264" size="xs" /> Invoices
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
    <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--color-border)', paddingBottom: 12 }}>
      {[
        { name: "Joseph Go", color: "#f59e0b" },
        { name: "Hao Wang", color: "#16a34a" },
        { name: "Meghna Damodaran", color: "#ec4899" },
        { name: "Sarah Johnson", color: "#3b82f6" },
      ].map((p) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ColorDot color={p.color} size="xs" />
          <span style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.67, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
    <div style={{ width: 600 }}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr className="bg-table-header" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Name</th>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Group</th>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Capacity</th>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Location</th>
          </tr>
        </thead>
        <tbody style={{ borderTop: 'none' }}>
          {[
            { name: "Room 1", color: "#ef4444", group: "Treatment", capacity: 1, location: "East Clinics" },
            { name: "Room 2", color: "#3b82f6", group: "Treatment", capacity: 2, location: "East Clinics" },
            { name: "Gym", color: "#22c55e", group: "Exercise", capacity: 8, location: "West Clinics" },
            { name: "Pool", color: "#f59e0b", group: "Hydrotherapy", capacity: 4, location: "West Clinics" },
          ].map((room) => (
            <tr key={room.name} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ColorDot color={room.color} />
                  {room.name}
                </div>
              </td>
              <td style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>{room.group}</td>
              <td style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>{room.capacity}</td>
              <td style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>{room.location}</td>
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
    <div style={{ width: 500 }}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr className="bg-table-header" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Name</th>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Utilisation</th>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Duration (mins)</th>
          </tr>
        </thead>
        <tbody style={{ borderTop: 'none' }}>
          {[
            { name: "Leave me alone", color: "#ef4444", util: "Excluded", dur: 15 },
            { name: "Meeting", color: "#1f2937", util: "Excluded", dur: 30 },
            { name: "Lunch", color: "#6366f1", util: "Excluded", dur: 30 },
            { name: "Admin", color: "#a855f7", util: "Included", dur: 30 },
            { name: "CPD", color: "#3b82f6", util: "Excluded", dur: 30 },
            { name: "Travel", color: "#22c55e", util: "Excluded", dur: 30 },
          ].map((b) => (
            <tr key={b.name} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ColorDot color={b.color} />
                  {b.name}
                </div>
              </td>
              <td style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>{b.util}</td>
              <td style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>{b.dur}</td>
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
    <div style={{ width: 320, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 16 }}>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ColorDot color="#f59e0b" size="sm" />
          <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)' }}>Sarah Johnson (Initial Assessment)</span>
        </div>
        <button style={{ color: 'var(--color-text-secondary)' }}>&times;</button>
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.57, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>9:00 AM - 10:00 AM</p>
        <p style={{ color: 'var(--color-text-secondary)' }}>Joseph Go</p>
        <p style={{ color: 'var(--color-text-secondary)' }}>Room 1 - East Clinics</p>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
