import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Drawer from "../Drawer";
import { Button } from "antd";
import List from "../List";
import FormInput from "../FormInput";
import FormTextarea from "../FormTextarea";

const meta: Meta<typeof Drawer> = {
  title: "Overlays/Drawer",
  component: Drawer,
  tags: ["extended"],
  parameters: {
    layout: "fullscreen",
    appPages: [
      {
        label: "Calendar (appointment details / side panels via CalendarView)",
        vercel: "https://splose-current.vercel.app/calendar",
        localhost: "http://localhost:3000/calendar",
        production: "https://acme.splose.com/calendar/week/25/3/2026",
      },
    ],
    referenceUrl: "https://ant.design/components/drawer",
    splose: {
      status: "beta",
      summary:
        "Edge-anchored panel overlay for secondary surfaces (appointment details, filter trays, help sheets).",
      whatToUseInstead:
        "Raw AntD Drawer imports; bespoke right-rail markup like AppointmentSidePanel.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/Drawer.md",
      source: "src/components/ds/Drawer.tsx",
    },
  },
};
export default meta;
type Story = StoryObj<typeof Drawer>;

function TriggeredDrawer(props: Omit<React.ComponentProps<typeof Drawer>, "open" | "onClose" | "children"> & { children?: React.ReactNode; label?: string }) {
  const { label = "Open drawer", children, ...rest } = props;
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: 24 }}>
      <Button variant="primary" onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Drawer {...rest} open={open} onClose={() => setOpen(false)}>
        {children ?? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p>Drawer body content.</p>
            <p>Close by pressing Escape, clicking the overlay, or the × icon.</p>
          </div>
        )}
      </Drawer>
    </div>
  );
}

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  render: () => (
    <TriggeredDrawer
      title="Appointment details"
      description="Tue 22 Apr · 10:00 AM"
      label="Open drawer"
    />
  ),
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Sides: Story = {
  name: "Feature: Sides",
  render: () => (
    <div style={{ display: "flex", gap: 8, padding: 24 }}>
      {(["right", "left", "top", "bottom"] as const).map((side) => (
        <TriggeredDrawer key={side} side={side} title={`Side: ${side}`} label={side} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  name: "Feature: Sizes",
  render: () => (
    <div style={{ display: "flex", gap: 8, padding: 24 }}>
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <TriggeredDrawer key={size} size={size} title={`Size: ${size}`} label={size} />
      ))}
    </div>
  ),
};

export const WithHeaderBar: Story = {
  name: "Feature: With Header Bar",
  render: () => (
    <TriggeredDrawer
      title="Filters"
      description="Narrow the report to a date range"
      headerBar
      label="Open headerBar drawer"
    />
  ),
};

export const WithFooter: Story = {
  name: "Feature: With Footer",
  render: () => {
    const Inner = () => {
      const [open, setOpen] = useState(false);
      return (
        <div style={{ padding: 24 }}>
          <Button onClick={() => setOpen(true)}>Open drawer with footer</Button>
          <Drawer
            open={open}
            onClose={() => setOpen(false)}
            title="Send note"
            description="Compose and deliver a note to the patient."
            footer={
              <>
                <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => setOpen(false)}>Send</Button>
              </>
            }
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <FormInput label="To" defaultValue="harry.n@example.com" />
              <FormInput label="Subject" defaultValue="Progress note" />
              <FormTextarea label="Body" rows={6} />
            </div>
          </Drawer>
        </div>
      );
    };
    return <Inner />;
  },
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const AppointmentSidePanel: Story = {
  name: "Recipe: Appointment Side Panel",
  render: () => {
    const Inner = () => {
      const [open, setOpen] = useState(false);
      return (
        <div style={{ padding: 24 }}>
          <Button onClick={() => setOpen(true)}>Click appointment</Button>
          <Drawer
            open={open}
            onClose={() => setOpen(false)}
            title="Initial consult — Harry Nguyen"
            description="Tue 22 Apr · 10:00 AM · 60 min"
            size="lg"
            footer={
              <>
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancel appt</Button>
                <Button variant="primary" onClick={() => setOpen(false)}>Mark attended</Button>
              </>
            }
          >
            <List
              divider
              labelWidth={120}
              items={[
                { label: "Service", value: "Initial consult (60 min)" },
                { label: "Practitioner", value: "Dr Sarah Kim" },
                { label: "Room", value: "Room 2" },
                { label: "Status", value: "Confirmed" },
                { label: "Notes", value: "Patient mentioned recurring shoulder pain; bring goniometer." },
              ]}
            />
          </Drawer>
        </div>
      );
    };
    return <Inner />;
  },
};

export const SendNoteDrawer: Story = {
  name: "Recipe: Send Note Drawer",
  render: () => <TriggeredDrawer title="Send note" description="Deliver to patient" label="Send note…" />,
};

export const FiltersDrawer: Story = {
  name: "Recipe: Filters Drawer",
  render: () => <TriggeredDrawer title="Filters" description="Refine the report" headerBar label="Filters…" />,
};
