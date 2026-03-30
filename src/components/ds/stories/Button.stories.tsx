import type { Meta, StoryObj } from "@storybook/react";
import {
  PlusOutlined,
  DownOutlined,
  LeftOutlined,
  RightOutlined,
  SettingOutlined,
  FilterOutlined,
  AppstoreOutlined,
  EnvironmentOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  LinkOutlined,
  PictureOutlined,
  TableOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  AlignLeftOutlined,
  BgColorsOutlined,
  ThunderboltOutlined,
  FontSizeOutlined,
  VideoCameraAddOutlined,
  FileTextOutlined,
  HistoryOutlined,
  ClockCircleOutlined,
  StopOutlined,
  CalendarOutlined,
  SendOutlined,
} from "@ant-design/icons";
import Button from "../Button";
import PageHeader from "../PageHeader";
import Card from "../Card";
import Navbar from "../Navbar";
import Badge from "../Badge";
import Chip from "../Chip";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Button> = {
  title: "Actions/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger", "ghost", "link", "icon", "toolbar"],
      description: "Visual style of the button",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size preset — affects padding and font size",
    },
    round: {
      control: "boolean",
      description: "Render as a circle (for FAB / round icon buttons)",
    },
    disabled: {
      control: "boolean",
      description: "Native disabled attribute",
    },
    children: {
      control: "text",
      description: "Button content — text, icons, or both",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    variant: "primary",
    size: "md",
    round: false,
    children: "Click me",
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES — one per variant                               */
/* ================================================================== */

export const Primary: Story = {
  args: { variant: "primary", children: "Primary Button" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary Button" },
};

export const Danger: Story = {
  args: { variant: "danger", children: "Delete" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Ghost Button" },
};

export const Link: Story = {
  args: { variant: "link", children: "Link Button" },
};

export const Icon: Story = {
  args: { variant: "icon", children: "B" },
  parameters: { docs: { description: { story: "Minimal padding, for toolbar-style icon buttons." } } },
};

export const Toolbar: Story = {
  render: () => (
    <Button variant="toolbar" size="sm" className="flex items-center gap-0.5">
      Arial
      <DownOutlined style={{ fontSize: 12 }} />
    </Button>
  ),
  parameters: { docs: { description: { story: "Used in rich-text toolbars for font/size pickers." } } },
};

/* ------------------------------------------------------------------ */
/*  All Variants side-by-side                                          */
/* ------------------------------------------------------------------ */

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="icon">
        <PlusOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="toolbar" size="sm">
        Toolbar <DownOutlined style={{ fontSize: 12 }} />
      </Button>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  All Sizes                                                          */
/* ------------------------------------------------------------------ */

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      {(["primary", "secondary", "danger", "ghost", "link", "icon", "toolbar"] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <span className="w-20 text-label-lg text-text-secondary">{variant}</span>
          <Button variant={variant} size="sm">
            {variant === "icon" ? <PlusOutlined style={{ fontSize: 14 }} /> : "Small"}
          </Button>
          <Button variant={variant} size="md">
            {variant === "icon" ? <PlusOutlined style={{ fontSize: 16 }} /> : "Medium"}
          </Button>
          <Button variant={variant} size="lg">
            {variant === "icon" ? <PlusOutlined style={{ fontSize: 20 }} /> : "Large"}
          </Button>
        </div>
      ))}
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  Round Buttons                                                      */
/* ------------------------------------------------------------------ */

export const RoundButtons: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button variant="primary" size="sm" round>
        <PlusOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="primary" size="md" round>
        <PlusOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="primary" size="lg" round>
        <PlusOutlined style={{ fontSize: 20 }} />
      </Button>
      <Button variant="secondary" size="md" round>
        <SettingOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="ghost" round className="h-10 w-10 justify-center">
        <LeftOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="icon" round>
        <RightOutlined style={{ fontSize: 16 }} />
      </Button>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  With Icons                                                         */
/* ------------------------------------------------------------------ */

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">
        <PlusOutlined style={{ fontSize: 16 }} />
        New client
      </Button>
      <Button variant="secondary">
        <SettingOutlined style={{ fontSize: 16 }} />
        Settings
      </Button>
      <Button variant="secondary">
        Export
        <DownOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="danger">
        <StopOutlined style={{ fontSize: 16 }} />
        Delete
      </Button>
      <Button variant="ghost">
        <FilterOutlined style={{ fontSize: 16 }} />
        Filter
      </Button>
      <Button variant="link">
        <HistoryOutlined style={{ fontSize: 14 }} />
        View change log
      </Button>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  PageHeaderActions                                                   */
/*  Pattern: PageHeader with primary + secondary buttons               */
/*  Source: /clients, /invoices, /practitioners pages                   */
/* ------------------------------------------------------------------ */

export const PageHeaderActions: Story = {
  render: () => (
    <div className="w-[640px]">
      <PageHeader title="Invoices">
        <Button variant="secondary">Export</Button>
        <Button variant="primary">
          <PlusOutlined style={{ fontSize: 16 }} />
          New Invoice
        </Button>
      </PageHeader>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  ToolbarButtons                                                     */
/*  Pattern: Rich text toolbar with icon + toolbar variants            */
/*  Source: /notes/[id]/edit page                                      */
/* ------------------------------------------------------------------ */

export const ToolbarButtons: Story = {
  render: () => (
    <Card padding="none" className="inline-flex flex-wrap items-center gap-1 px-2 py-1.5 text-text-secondary">
      <Button variant="toolbar" size="sm" className="flex items-center gap-0.5 text-xs">
        Arial
        <DownOutlined style={{ fontSize: 12 }} />
      </Button>
      <Button variant="toolbar" size="sm" className="flex items-center gap-0.5">
        <FontSizeOutlined style={{ fontSize: 16 }} />
        <DownOutlined style={{ fontSize: 12 }} />
      </Button>
      <span className="h-4 w-px bg-border" />
      <Button variant="icon">
        <BoldOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="icon">
        <ItalicOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="icon">
        <UnderlineOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="icon">
        <StrikethroughOutlined style={{ fontSize: 16 }} />
      </Button>
      <span className="h-4 w-px bg-border" />
      <Button variant="icon">
        <LinkOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="icon">
        <PictureOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="icon">
        <TableOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="icon">
        <UnorderedListOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="icon">
        <OrderedListOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="icon">
        <AlignLeftOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="icon">
        <BgColorsOutlined style={{ fontSize: 16 }} />
      </Button>
      <span className="flex-1" />
      <Button variant="secondary" className="border-primary text-primary hover:bg-primary/10">
        <ThunderboltOutlined style={{ fontSize: 14 }} />
        Generate
      </Button>
      <Button variant="primary" round size="sm">
        <PlusOutlined style={{ fontSize: 16 }} />
      </Button>
    </Card>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  FilterChipRow                                                      */
/*  Pattern: Calendar-style toolbar with chips, icon buttons, and FAB  */
/*  Source: /calendar CalendarView toolbar                              */
/* ------------------------------------------------------------------ */

export const FilterChipRow: Story = {
  render: () => (
    <div className="flex items-center gap-2 border-b border-border px-4 py-2">
      <Button variant="secondary" size="sm">
        Today
      </Button>
      <div className="flex items-center gap-1">
        <Button variant="icon" size="sm">
          <LeftOutlined style={{ fontSize: 16 }} />
        </Button>
        <Button variant="icon" size="sm">
          <RightOutlined style={{ fontSize: 16 }} />
        </Button>
      </div>
      <span className="text-display-md text-text">March 2026</span>
      <div className="ml-2 flex items-center gap-2 text-text-secondary">
        <Button variant="icon" size="sm">
          <FilterOutlined style={{ fontSize: 16 }} />
        </Button>
        <Button variant="icon" size="sm">
          <SettingOutlined style={{ fontSize: 16 }} />
        </Button>
      </div>
      <div className="flex-1" />
      <Chip variant="green">East Clinics</Chip>
      <Chip variant="purple">Physio</Chip>
      <Button variant="primary" size="sm" round>
        <PlusOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="secondary" size="sm">
        Calendar <span className="text-text-secondary">&#9662;</span>
      </Button>
      <Button variant="secondary" size="sm">
        Week <span className="text-text-secondary">&#9662;</span>
      </Button>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  FormActions                                                        */
/*  Pattern: Cancel + Save pair at the bottom of a modal/form          */
/*  Source: /settings/cancellation-reasons, /calendar create modal      */
/* ------------------------------------------------------------------ */

export const FormActions: Story = {
  render: () => (
    <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Save</Button>
    </div>
  ),
};

/** Danger variant for destructive confirmation modals. */
export const FormActionsDanger: Story = {
  render: () => (
    <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
      <Button variant="secondary">Cancel</Button>
      <Button variant="danger">Delete</Button>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  IconButtonGroup                                                    */
/*  Pattern: Group of icon buttons (calendar toolbar utilities)        */
/*  Source: /calendar CalendarView — filter, settings, grid, map       */
/* ------------------------------------------------------------------ */

export const IconButtonGroup: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-text-secondary">
      <Button variant="icon" size="sm">
        <FilterOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="icon" size="sm">
        <SettingOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="icon" size="sm">
        <AppstoreOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="icon" size="sm">
        <EnvironmentOutlined style={{ fontSize: 16 }} />
      </Button>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  LinkActions                                                        */
/*  Pattern: Column of link-style buttons with icons                   */
/*  Source: /clients/[id]/appointments AppointmentSidePanel            */
/* ------------------------------------------------------------------ */

export const LinkActions: Story = {
  render: () => (
    <div className="w-72 space-y-2 rounded-lg border border-border bg-white p-4">
      <p className="text-heading-sm text-text">Actions</p>
      <div className="flex items-center gap-3">
        <VideoCameraAddOutlined style={{ fontSize: 16 }} className="shrink-0 text-text-secondary" />
        <Button variant="link">Create Zoom meeting</Button>
      </div>
      <div className="flex items-center gap-3">
        <FileTextOutlined style={{ fontSize: 16 }} className="shrink-0 text-text-secondary" />
        <Button variant="link">Add invoice</Button>
      </div>
      <div className="flex items-center gap-3 pl-7">
        <Button variant="link">Mark as</Button>
        <span className="text-text-secondary">and</span>
        <Button variant="link">Do not invoice?</Button>
      </div>
      <div className="flex items-center gap-3">
        <HistoryOutlined style={{ fontSize: 16 }} className="shrink-0 text-text-secondary" />
        <Button variant="link" size="sm">
          View change log
        </Button>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  FABButton                                                          */
/*  Pattern: Floating action button — round + primary                  */
/*  Source: /calendar (new appointment), /notes/[id]/edit (add block)  */
/* ------------------------------------------------------------------ */

export const FABButton: Story = {
  render: () => (
    <div className="relative h-40 w-72 rounded-lg border border-border bg-gray-50">
      <div className="flex h-full items-center justify-center text-body-md text-text-secondary">
        Page content
      </div>
      <Button variant="primary" size="md" round className="absolute right-4 bottom-4 shadow-lg">
        <PlusOutlined style={{ fontSize: 20 }} />
      </Button>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  NavbarWithButtons                                                  */
/*  Pattern: Document navbar with action buttons                       */
/*  Source: /notes/[id]/edit, /invoices/[id]                           */
/* ------------------------------------------------------------------ */

export const NavbarWithButtons: Story = {
  render: () => (
    <Navbar backHref="#" title="Invoice #1042" badge={<Badge variant="green">Paid</Badge>}>
      <Button variant="secondary">Send</Button>
      <Button variant="primary">Sign &amp; lock</Button>
    </Navbar>
  ),
  parameters: { layout: "fullscreen" },
};

/* ------------------------------------------------------------------ */
/*  ContextMenuButtons                                                 */
/*  Pattern: Popover with ghost button list (calendar click-to-create) */
/*  Source: /calendar CalendarView click popover                       */
/* ------------------------------------------------------------------ */

export const ContextMenuButtons: Story = {
  render: () => (
    <Card padding="none" className="w-52 shadow-lg">
      <div className="px-3 pt-3 pb-1">
        <p className="text-heading-sm text-text">9:00 AM</p>
      </div>
      <div className="py-1">
        <Button variant="ghost" className="w-full justify-start gap-2.5 px-3 py-2">
          <ClockCircleOutlined style={{ fontSize: 16 }} className="text-text-secondary" />
          Support activity
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2.5 px-3 py-2">
          <StopOutlined style={{ fontSize: 16 }} className="text-text-secondary" />
          Busy time
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2.5 px-3 py-2">
          <CalendarOutlined style={{ fontSize: 16 }} className="text-text-secondary" />
          Appointment
        </Button>
      </div>
    </Card>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  ComposeToolbar                                                     */
/*  Pattern: Message compose area with icon buttons + send             */
/*  Source: / (dashboard) compose area                                 */
/* ------------------------------------------------------------------ */

export const ComposeToolbar: Story = {
  render: () => (
    <div className="w-[480px] border-t border-border p-3">
      <Card padding="none" className="mb-2 min-h-[48px] px-3 py-2 text-body-md text-text-secondary">
        Type a message...
      </Card>
      <div className="flex items-center gap-0.5 text-text-secondary">
        <Button variant="icon" size="sm" className="text-body-md-strong" title="Bold">
          B
        </Button>
        <Button variant="icon" size="sm" className="italic" title="Italic">
          I
        </Button>
        <Button variant="icon" size="sm" className="underline" title="Underline">
          U
        </Button>
        <span className="mx-0.5 h-4 w-px bg-border" />
        <Button variant="icon" size="sm" title="Link">
          <LinkOutlined style={{ fontSize: 14 }} />
        </Button>
        <Button variant="icon" size="sm" title="Image">
          <PictureOutlined style={{ fontSize: 14 }} />
        </Button>
        <Button variant="icon" size="sm" title="List">
          <UnorderedListOutlined style={{ fontSize: 14 }} />
        </Button>
        <div className="flex-1" />
        <Button variant="primary" size="sm">
          <SendOutlined style={{ fontSize: 14 }} />
          Send
        </Button>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
