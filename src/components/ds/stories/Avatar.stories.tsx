import type { Meta, StoryObj } from "@storybook/react";
import Avatar from "../Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Data Display/Avatar",
  component: Avatar,
  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "md", "lg", "xl"],
    },
    color: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export const Playground: Story = {
  args: {
    name: "Sarah Johnson",
    color: "#7c3aed",
    size: "md",
  },
};

// ---------------------------------------------------------------------------
// Feature stories
// ---------------------------------------------------------------------------

export const Small: Story = {
  args: { name: "Alice Brown", size: "sm", color: "#7c3aed" },
};

export const Medium: Story = {
  args: { name: "Sarah Johnson", size: "md", color: "#7c3aed" },
};

export const Large: Story = {
  args: { name: "Bob Wilson", size: "lg", color: "#f59e0b" },
};

export const ExtraLarge: Story = {
  args: { name: "Hao Wang", size: "xl", color: "#16a34a" },
};

export const CustomColor: Story = {
  args: { name: "Mark Chen", color: "#22c55e", size: "md" },
};

export const DefaultColor: Story = {
  args: { name: "Jane Doe", size: "md" },
};

// ---------------------------------------------------------------------------
// All sizes side by side
// ---------------------------------------------------------------------------

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Avatar name="Sarah Johnson" size="sm" color="#7c3aed" />
        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>sm</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Avatar name="Sarah Johnson" size="md" color="#7c3aed" />
        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>md</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Avatar name="Sarah Johnson" size="lg" color="#7c3aed" />
        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>lg</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Avatar name="Sarah Johnson" size="xl" color="#7c3aed" />
        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>xl</span>
      </div>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Recipes — real patterns from the codebase
// ---------------------------------------------------------------------------

/**
 * Practitioner cards on /practitioners — xl avatar with name and role.
 * Source: `src/app/practitioners/page.tsx`
 */
export const PractitionerGrid: Story = {
  name: "Recipe: Practitioner Grid",
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {[
        { name: "Joseph Go", color: "#f59e0b", role: "Occupational Therapist", specialty: "Paediatrics" },
        { name: "Hao Wang", color: "#16a34a", role: "Speech Pathologist", specialty: "" },
        { name: "Meghna Damodaran", color: "#ec4899", role: "Psychologist", specialty: "Clinical" },
      ].map((p) => (
        <div
          key={p.name}
          style={{ display: 'flex', alignItems: 'center', gap: 16, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}
        >
          <Avatar name={p.name} color={p.color} size="xl" />
          <div style={{ minWidth: 0 }}>
            <h3 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--color-text)' }}>{p.name}</h3>
            <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, color: 'var(--color-text-secondary)' }}>{p.role}</p>
            {p.specialty && (
              <span style={{ marginTop: 4, display: 'inline-block', borderRadius: '50%', backgroundColor: '#f3e8ff', paddingLeft: 8, paddingRight: 8, paddingTop: 2, paddingBottom: 2, fontSize: 11, fontWeight: 500, color: '#7e22ce' }}>
                {p.specialty}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Small avatar used in the top nav or sidebar user area.
 * Source: similar to dashboard appointments list at `src/app/page.tsx`
 */
export const TopNavUser: Story = {
  name: "Recipe: Top Nav User",
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 6, backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}>
      <Avatar name="Nicholas Smithson" color="#7c3aed" size="sm" />
      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text)' }}>Nicholas Smithson</span>
    </div>
  ),
};

/**
 * Row of small avatars with names used as calendar practitioner headers.
 * Source: `src/app/calendar/CalendarView.tsx` appointment details
 */
export const CalendarPractitionerHeaders: Story = {
  name: "Recipe: Calendar Practitioner Headers",
  render: () => (
    <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--color-border)', paddingBottom: 12 }}>
      {[
        { name: "Joseph Go", color: "#f59e0b" },
        { name: "Hao Wang", color: "#16a34a" },
        { name: "Meghna Damodaran", color: "#ec4899" },
        { name: "Sarah Johnson", color: "#3b82f6" },
      ].map((p) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar name={p.name} color={p.color} size="sm" />
          <span style={{ fontSize: 12, color: 'var(--color-text)' }}>{p.name}</span>
        </div>
      ))}
    </div>
  ),
};

/**
 * Medium avatar with name and role used on the online booking page.
 * Source: `src/app/online-booking/page.tsx`
 */
export const OnlineBookingPractitioner: Story = {
  name: "Recipe: Online Booking Practitioner",
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 16 }}>
      <Avatar name="Joseph Go" color="#f59e0b" size="md" />
      <div>
        <div style={{ fontWeight: 500, color: 'var(--color-text)' }}>Joseph Go</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Occupational Therapist</div>
      </div>
    </div>
  ),
};
