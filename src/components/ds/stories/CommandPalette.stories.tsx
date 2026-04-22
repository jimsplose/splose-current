import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  PlusOutlined,
  UserAddOutlined,
  FileAddOutlined,
  CalendarOutlined,
  SearchOutlined,
  SettingOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import CommandPalette from "../CommandPalette";
import type { CommandEntry } from "../CommandPalette";
import Button from "../Button";
import Icon from "../Icon";

const meta: Meta = {
  title: "Overlay/CommandPalette",
  parameters: {
    layout: "centered",
    splose: {
      status: "beta",
      summary:
        "Cmd+K launcher overlay with fuzzy search across navigation, actions, and recent records.",
      whatToUseInstead:
        "No current equivalent — adds keyboard-first navigation for power users.",
      referenceLibrary: "cmdk",
      plan: "docs/ds-plans/CommandPalette.md",
      source: "src/components/ds/CommandPalette.tsx",
    },
  },
};
export default meta;
type Story = StoryObj;

const globalCommands: CommandEntry[] = [
  {
    id: "nav-dashboard",
    group: "Navigate",
    label: "Go to Dashboard",
    icon: <Icon as={CalendarOutlined} size="md" />,
    keywords: ["home", "dash"],
    onSelect: () => console.log("nav dashboard"),
  },
  {
    id: "nav-calendar",
    group: "Navigate",
    label: "Go to Calendar",
    icon: <Icon as={CalendarOutlined} size="md" />,
    onSelect: () => console.log("nav calendar"),
  },
  {
    id: "nav-invoices",
    group: "Navigate",
    label: "Go to Invoices",
    icon: <Icon as={DollarOutlined} size="md" />,
    onSelect: () => console.log("nav invoices"),
  },
  {
    id: "nav-patients",
    group: "Navigate",
    label: "Go to Patients",
    icon: <Icon as={SearchOutlined} size="md" />,
    onSelect: () => console.log("nav patients"),
  },
  {
    id: "nav-settings",
    group: "Navigate",
    label: "Go to Settings",
    icon: <Icon as={SettingOutlined} size="md" />,
    onSelect: () => console.log("nav settings"),
  },
  {
    id: "create-invoice",
    group: "Create",
    label: "New invoice",
    icon: <Icon as={FileAddOutlined} size="md" />,
    shortcut: ["⌘", "I"],
    onSelect: () => console.log("create invoice"),
  },
  {
    id: "create-patient",
    group: "Create",
    label: "New patient",
    icon: <Icon as={UserAddOutlined} size="md" />,
    shortcut: ["⌘", "P"],
    onSelect: () => console.log("create patient"),
  },
  {
    id: "create-appt",
    group: "Create",
    label: "New appointment",
    icon: <Icon as={PlusOutlined} size="md" />,
    shortcut: ["⌘", "A"],
    onSelect: () => console.log("create appt"),
  },
  {
    id: "recent-harry",
    group: "Recents",
    label: "Harry Nguyen",
    onSelect: () => console.log("open harry"),
  },
  {
    id: "recent-mira",
    group: "Recents",
    label: "Mira Chen",
    onSelect: () => console.log("open mira"),
  },
];

/* ================================================================== */
/*  Shared helper                                                      */
/* ================================================================== */

function withTrigger(
  label: string,
  commands: CommandEntry[],
  startOpen = false,
) {
  const Inner = () => {
    const [open, setOpen] = useState(startOpen);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>{label}</Button>
        <CommandPalette
          commands={commands}
          open={open}
          onOpenChange={setOpen}
        />
      </div>
    );
  };
  return <Inner />;
}

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  render: () => withTrigger("Open palette (⌘K)", globalCommands),
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  name: "Feature: Default (groups visible)",
  render: () => withTrigger("Open default palette", globalCommands, true),
};

export const WithShortcuts: Story = {
  name: "Feature: With Shortcuts",
  render: () =>
    withTrigger(
      "Open with shortcuts",
      globalCommands.filter((c) => c.shortcut?.length),
      true,
    ),
};

export const WithGroups: Story = {
  name: "Feature: With Groups",
  render: () => withTrigger("Open grouped palette", globalCommands, true),
};

export const Scoped: Story = {
  name: "Feature: Scoped (patient context)",
  render: () =>
    withTrigger(
      "Open patient-scoped",
      [
        {
          id: "new-note",
          group: "Patient",
          label: "New note",
          icon: <Icon as={PlusOutlined} size="md" />,
          onSelect: () => console.log("new note"),
        },
        {
          id: "new-invoice-for",
          group: "Patient",
          label: "New invoice for Harry Nguyen",
          icon: <Icon as={DollarOutlined} size="md" />,
          onSelect: () => console.log("new invoice for harry"),
        },
        {
          id: "archive",
          group: "Patient",
          label: "Archive client",
          onSelect: () => console.log("archive"),
        },
        ...globalCommands.filter((c) => c.group === "Navigate"),
      ],
      true,
    ),
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const GlobalCmdK: Story = {
  name: "Recipe: Global Cmd+K",
  render: () => withTrigger("Open global Cmd+K", globalCommands, true),
};

export const PatientScopedCmdK: Story = {
  name: "Recipe: Patient-scoped Cmd+K",
  render: () =>
    withTrigger(
      "Patient Cmd+K",
      [
        { id: "pat-note", group: "Patient actions", label: "New note", icon: <Icon as={PlusOutlined} size="md" />, onSelect: () => {} },
        { id: "pat-inv", group: "Patient actions", label: "New invoice", icon: <Icon as={DollarOutlined} size="md" />, onSelect: () => {} },
        { id: "pat-appt", group: "Patient actions", label: "New appointment", icon: <Icon as={CalendarOutlined} size="md" />, onSelect: () => {} },
        { id: "pat-archive", group: "Patient actions", label: "Archive", onSelect: () => {} },
        ...globalCommands.filter((c) => c.group === "Navigate"),
      ],
      true,
    ),
};

export const CalendarScopedCmdK: Story = {
  name: "Recipe: Calendar-scoped Cmd+K",
  render: () =>
    withTrigger(
      "Calendar Cmd+K",
      [
        { id: "cal-appt", group: "Calendar actions", label: "New appointment at selected slot", icon: <Icon as={PlusOutlined} size="md" />, onSelect: () => {} },
        { id: "cal-busy", group: "Calendar actions", label: "New busy time", onSelect: () => {} },
        { id: "cal-filter", group: "Calendar actions", label: "Filter by practitioner…", icon: <Icon as={SearchOutlined} size="md" />, onSelect: () => {} },
        { id: "cal-view", group: "Calendar actions", label: "Switch view (week/day/month)", onSelect: () => {} },
        ...globalCommands.filter((c) => c.group === "Navigate"),
      ],
      true,
    ),
};
