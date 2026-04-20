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
    shape: {
      control: "select",
      options: ["default", "pill"],
      description: "Shape preset — default uses standard border-radius, pill uses borderRadius:9999",
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
    <Button variant="toolbar" size="sm" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(["primary", "secondary", "danger", "ghost", "link", "icon", "toolbar"] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="text-label-lg text-text-secondary" style={{ width: 80 }}>{variant}</span>
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
      <Button variant="ghost" round style={{ height: 40, width: 40, justifyContent: 'center' }}>
        <LeftOutlined style={{ fontSize: 16 }} />
      </Button>
      <Button variant="icon" round>
        <RightOutlined style={{ fontSize: 16 }} />
      </Button>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Pill Shapes                                                        */
/* ------------------------------------------------------------------ */

export const PillShapes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
      <Button variant="primary" size="sm" shape="pill">Primary pill</Button>
      <Button variant="secondary" size="sm" shape="pill">Secondary pill</Button>
      <Button variant="secondary" size="sm" shape="pill">Location</Button>
      <Button variant="secondary" size="sm" shape="pill">Practitioner</Button>
      <Button variant="secondary" size="sm" shape="pill">Compare</Button>
      <Button
        variant="secondary"
        size="sm"
        shape="pill"
        style={{ borderColor: 'var(--color-primary)', backgroundColor: 'rgba(124, 58, 237, 0.1)', fontWeight: 500, color: 'var(--color-primary)' }}
      >
        <CalendarOutlined style={{ fontSize: 16 }} />
        Jan 1 → Jan 31
        <DownOutlined style={{ fontSize: 14 }} />
      </Button>
    </div>
  ),
  parameters: { layout: "padded", docs: { description: { story: "shape=\"pill\" maps to AntD shape=\"round\" (borderRadius:9999). Used in filter rows (reports/page, settings/details)." } } },
};

/* ------------------------------------------------------------------ */
/*  With Icons                                                         */
/* ------------------------------------------------------------------ */

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
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
    <div style={{ width: 640 }}>
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
    <Card padding="none" className="text-text-secondary" style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, paddingLeft: 8, paddingRight: 8, paddingTop: 6, paddingBottom: 6 }}>
      <Button variant="toolbar" size="sm" style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11 }}>
        Arial
        <DownOutlined style={{ fontSize: 12 }} />
      </Button>
      <Button variant="toolbar" size="sm" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <FontSizeOutlined style={{ fontSize: 16 }} />
        <DownOutlined style={{ fontSize: 12 }} />
      </Button>
      <span className="bg-border" style={{ height: 16, width: 1 }} />
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
      <span className="bg-border" style={{ height: 16, width: 1 }} />
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
      <span style={{ flex: 1 }} />
      <Button variant="secondary" className="border-primary text-primary">
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--color-border)', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }}>
      <Button variant="secondary" size="sm">
        Today
      </Button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Button variant="icon" size="sm">
          <LeftOutlined style={{ fontSize: 16 }} />
        </Button>
        <Button variant="icon" size="sm">
          <RightOutlined style={{ fontSize: 16 }} />
        </Button>
      </div>
      <span className="text-display-md text-text">March 2026</span>
      <div className="text-text-secondary" style={{ marginLeft: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button variant="icon" size="sm">
          <FilterOutlined style={{ fontSize: 16 }} />
        </Button>
        <Button variant="icon" size="sm">
          <SettingOutlined style={{ fontSize: 16 }} />
        </Button>
      </div>
      <div style={{ flex: 1 }} />
      <Badge variant="green" shape="pill">East Clinics</Badge>
      <Badge variant="purple" shape="pill">Physio</Badge>
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Save</Button>
    </div>
  ),
};

/** Danger variant for destructive confirmation modals. */
export const FormActionsDanger: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
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
    <div className="text-text-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
    <div style={{ width: 288, display: 'flex', flexDirection: 'column', gap: 8, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 16 }}>
      <p className="text-heading-sm text-text">Actions</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <VideoCameraAddOutlined className="shrink-0 text-text-secondary" style={{ fontSize: 16 }} />
        <Button variant="link">Create Zoom meeting</Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <FileTextOutlined className="shrink-0 text-text-secondary" style={{ fontSize: 16 }} />
        <Button variant="link">Add invoice</Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 28 }}>
        <Button variant="link">Mark as</Button>
        <span className="text-text-secondary">and</span>
        <Button variant="link">Do not invoice?</Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <HistoryOutlined className="shrink-0 text-text-secondary" style={{ fontSize: 16 }} />
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
    <div style={{ position: 'relative', height: 160, width: 288, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#f9fafb' }}>
      <div className="text-body-md text-text-secondary" style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        Page content
      </div>
      <Button variant="primary" size="md" round style={{ position: 'absolute', right: 16, bottom: 16, boxShadow: '0 10px 15px rgba(0,0,0,.1)' }}>
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
    <Card padding="none" style={{ width: 208, boxShadow: '0 10px 15px rgba(0,0,0,.1)' }}>
      <div style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 12, paddingBottom: 4 }}>
        <p className="text-heading-sm text-text">9:00 AM</p>
      </div>
      <div style={{ paddingTop: 4, paddingBottom: 4 }}>
        <Button variant="ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: 10, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}>
          <ClockCircleOutlined style={{ fontSize: 16 }} className="text-text-secondary" />
          Support activity
        </Button>
        <Button variant="ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: 10, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}>
          <StopOutlined style={{ fontSize: 16 }} className="text-text-secondary" />
          Busy time
        </Button>
        <Button variant="ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: 10, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}>
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
    <div style={{ width: 480, borderTop: '1px solid var(--color-border)', padding: 12 }}>
      <Card padding="none" className="text-body-md text-text-secondary" style={{ marginBottom: 8, minHeight: 48, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}>
        Type a message...
      </Card>
      <div className="text-text-secondary" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="icon" size="sm" className="text-body-md-strong" title="Bold">
          B
        </Button>
        <Button variant="icon" size="sm" style={{ fontStyle: 'italic' }} title="Italic">
          I
        </Button>
        <Button variant="icon" size="sm" style={{ textDecoration: 'underline' }} title="Underline">
          U
        </Button>
        <span className="bg-border" style={{ marginLeft: 2, marginRight: 2, height: 16, width: 1 }} />
        <Button variant="icon" size="sm" title="Link">
          <LinkOutlined style={{ fontSize: 14 }} />
        </Button>
        <Button variant="icon" size="sm" title="Image">
          <PictureOutlined style={{ fontSize: 14 }} />
        </Button>
        <Button variant="icon" size="sm" title="List">
          <UnorderedListOutlined style={{ fontSize: 14 }} />
        </Button>
        <div style={{ flex: 1 }} />
        <Button variant="primary" size="sm">
          <SendOutlined style={{ fontSize: 14 }} />
          Send
        </Button>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
