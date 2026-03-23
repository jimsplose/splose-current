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
    <div className="flex items-end gap-4">
      <div className="flex flex-col items-center gap-1">
        <Avatar name="Sarah Johnson" size="sm" color="#7c3aed" />
        <span className="text-xs text-text-secondary">sm</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar name="Sarah Johnson" size="md" color="#7c3aed" />
        <span className="text-xs text-text-secondary">md</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar name="Sarah Johnson" size="lg" color="#7c3aed" />
        <span className="text-xs text-text-secondary">lg</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar name="Sarah Johnson" size="xl" color="#7c3aed" />
        <span className="text-xs text-text-secondary">xl</span>
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
    <div className="grid grid-cols-3 gap-4">
      {[
        { name: "Joseph Go", color: "#f59e0b", role: "Occupational Therapist", specialty: "Paediatrics" },
        { name: "Hao Wang", color: "#16a34a", role: "Speech Pathologist", specialty: "" },
        { name: "Meghna Damodaran", color: "#ec4899", role: "Psychologist", specialty: "Clinical" },
      ].map((p) => (
        <div
          key={p.name}
          className="flex items-center gap-4 rounded-lg border border-border bg-white p-6"
        >
          <Avatar name={p.name} color={p.color} size="xl" />
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-text">{p.name}</h3>
            <p className="truncate text-sm text-text-secondary">{p.role}</p>
            {p.specialty && (
              <span className="mt-1 inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
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
    <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2">
      <Avatar name="Nicholas Smithson" color="#7c3aed" size="sm" />
      <span className="text-sm font-medium text-text">Nicholas Smithson</span>
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
    <div className="flex gap-6 border-b border-border pb-3">
      {[
        { name: "Joseph Go", color: "#f59e0b" },
        { name: "Hao Wang", color: "#16a34a" },
        { name: "Meghna Damodaran", color: "#ec4899" },
        { name: "Sarah Johnson", color: "#3b82f6" },
      ].map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <Avatar name={p.name} color={p.color} size="sm" />
          <span className="text-sm text-text">{p.name}</span>
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
    <div className="flex items-center gap-3 rounded-lg border border-border bg-white p-4">
      <Avatar name="Joseph Go" color="#f59e0b" size="md" />
      <div>
        <div className="font-medium text-text">Joseph Go</div>
        <div className="text-sm text-text-secondary">Occupational Therapist</div>
      </div>
    </div>
  ),
};
