import type { Meta, StoryObj } from "@storybook/react";
import PatientAvatar from "../PatientAvatar";

const meta: Meta<typeof PatientAvatar> = {
  title: "Data Display/PatientAvatar",
  component: PatientAvatar,
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    status: { control: "select", options: ["active", "archived", "deceased"] },
  },
  parameters: {
    layout: "padded",
    splose: {
      status: "beta",
      summary:
        "Deterministic initials avatar for patients using a hashed colour palette.",
      whatToUseInstead:
        "Generic <Avatar> with ad-hoc colour logic duplicated per caller.",
      referenceLibrary: "first-party",
      plan: "docs/ds-plans/PatientAvatar.md",
      source: "src/components/ds/PatientAvatar.tsx",
    },
  },
};
export default meta;
type Story = StoryObj<typeof PatientAvatar>;

const harry = { id: "446604", firstName: "Harry", lastName: "Nguyen" };
const mira = { id: "123456", firstName: "Mira", lastName: "Chen" };
const jamie = { id: "789012", firstName: "Jamie", lastName: "Lee" };

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  args: { patient: harry, size: "md", status: "active" },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Sizes: Story = {
  name: "Feature: Sizes",
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
        <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <PatientAvatar patient={harry} size={s} />
          <span style={{ fontSize: 11, color: "#6E6E64" }}>{s}</span>
        </div>
      ))}
    </div>
  ),
};

export const Palette: Story = {
  name: "Feature: Palette (deterministic from id)",
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <PatientAvatar
          key={i}
          patient={{
            id: `patient-${i * 1037 + 1}`,
            firstName: `P${i}`,
            lastName: "T",
          }}
          size="md"
        />
      ))}
    </div>
  ),
};

export const WithPhoto: Story = {
  name: "Feature: With Photo",
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <PatientAvatar
        patient={{
          ...harry,
          photoUrl: "https://i.pravatar.cc/80?u=harry",
        }}
        size="lg"
      />
      <PatientAvatar
        patient={{ ...mira, photoUrl: "https://i.pravatar.cc/80?u=mira" }}
        size="lg"
      />
    </div>
  ),
};

export const WithPhotoError: Story = {
  name: "Feature: With Photo Error (fallback)",
  render: () => (
    <PatientAvatar
      patient={{
        ...harry,
        photoUrl: "https://example.com/does-not-exist.jpg",
      }}
      size="lg"
    />
  ),
};

export const Archived: Story = {
  name: "Feature: Archived",
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <PatientAvatar patient={harry} size="md" status="active" />
      <PatientAvatar patient={harry} size="md" status="archived" />
      <PatientAvatar patient={harry} size="md" status="deceased" />
    </div>
  ),
};

export const Interactive: Story = {
  name: "Feature: Interactive",
  render: () => (
    <PatientAvatar
      patient={harry}
      size="lg"
      interactive
      onClick={() => console.log("avatar clicked")}
    />
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const PatientDetailHeader: Story = {
  name: "Recipe: Patient Detail Header",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <PatientAvatar patient={harry} size="md" />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>Harry Nguyen</div>
        <div style={{ fontSize: 13, color: "#6E6E64" }}>Patient · #446604</div>
      </div>
    </div>
  ),
};

export const PatientListRow: Story = {
  name: "Recipe: Patient List Row",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", maxWidth: 420 }}>
      {[harry, mira, jamie].map((p, i) => (
        <div
          key={p.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 0",
            borderBottom: i < 2 ? "1px solid #eee" : "none",
          }}
        >
          <PatientAvatar patient={p} size="sm" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              {p.firstName} {p.lastName}
            </div>
            <div style={{ fontSize: 12, color: "#6E6E64" }}>Next appt: Tue 22 Apr</div>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const CalendarEventAvatar: Story = {
  name: "Recipe: Calendar Event Avatar",
  render: () => (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 8px",
        borderRadius: 6,
        background: "#5578FF",
        color: "#fff",
        fontSize: 12,
        width: 180,
      }}
    >
      <PatientAvatar patient={harry} size="xs" />
      <span>9:00 — Harry Nguyen</span>
    </div>
  ),
};

export const WaitlistRowAvatar: Story = {
  name: "Recipe: Waitlist Row Avatar",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 10 }}>
      <PatientAvatar patient={jamie} size="sm" />
      <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>Jamie Lee</div>
        <div style={{ fontSize: 12, color: "#6E6E64" }}>Initial consult · Added 3 days ago</div>
      </div>
    </div>
  ),
};
