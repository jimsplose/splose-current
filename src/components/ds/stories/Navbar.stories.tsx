import type { Meta, StoryObj } from "@storybook/react";
import { CheckCircleOutlined, AppstoreOutlined, SplitCellsOutlined, ShareAltOutlined, EyeOutlined } from "@ant-design/icons";
import Navbar from "../Navbar";
import Badge from "../Badge";
import Button from "../Button";
import Filter from "../Filter";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Navbar> = {
  title: "Navigation/Navbar",
  component: Navbar,
  argTypes: {
    backHref: {
      control: "text",
      description: "URL for the back arrow link",
    },
    title: {
      control: "text",
      description: "Page/document title shown next to the back arrow",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    backHref: "#",
    title: "Document title",
    badge: <Badge variant="green">Status</Badge>,
    children: (
      <>
        <Button variant="secondary">Secondary</Button>
        <Button variant="primary">Primary</Button>
      </>
    ),
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  args: {
    backHref: "#",
    title: "Page title",
  },
};

export const WithBadge: Story = {
  args: {
    backHref: "#",
    title: "Progress Note",
    badge: <Badge variant="green">Final</Badge>,
  },
};

export const WithActions: Story = {
  args: {
    backHref: "#",
    title: "Invoice #INV-0042",
    children: (
      <>
        <Button variant="secondary">Send</Button>
        <Button variant="primary">Sign &amp; lock</Button>
      </>
    ),
  },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  ProgressNoteNavbar                                                 */
/*  Pattern: Note view with Final badge + client link + toolbar        */
/*  Source: /notes/[id] page                                           */
/* ------------------------------------------------------------------ */

export const ProgressNoteNavbar: Story = {
  render: () => (
    <Navbar
      backHref="/"
      title="SOAP Note"
      badge={
        <>
          <Badge variant="green">
            <CheckCircleOutlined style={{ fontSize: 12 }} />
            Final
          </Badge>
          <span className="text-label-lg text-primary hover:underline">Sarah Johnson</span>
        </>
      }
    >
      <Button variant="secondary">Send</Button>
      <Button variant="primary">Sign &amp; lock</Button>
    </Navbar>
  ),
};

/* ------------------------------------------------------------------ */
/*  InvoiceNavbar                                                      */
/*  Pattern: Invoice document with Pay + Email + Actions               */
/*  Source: /payments/new, invoice detail pattern                       */
/* ------------------------------------------------------------------ */

export const InvoiceNavbar: Story = {
  render: () => (
    <Navbar
      backHref="/invoices"
      title="Invoice #INV-1042"
      badge={<Badge variant="green">Paid</Badge>}
    >
      <Button variant="secondary">Email</Button>
      <Button variant="primary">Pay</Button>
      <Button variant="secondary">Actions</Button>
    </Navbar>
  ),
};

/* ------------------------------------------------------------------ */
/*  NoteEditorNavbar                                                   */
/*  Pattern: Note editor with Saved badge + view toggle + Save         */
/*  Source: /notes/[id]/edit page                                      */
/* ------------------------------------------------------------------ */

export const NoteEditorNavbar: Story = {
  render: () => (
    <Navbar
      backHref="/notes/1"
      title="SOAP Note"
      badge={
        <>
          <span className="cursor-pointer text-body-md text-primary hover:underline">Sarah Johnson</span>
          <Badge variant="green">Saved</Badge>
        </>
      }
    >
      <Filter
        items={[
          { label: <AppstoreOutlined style={{ fontSize: 16 }} />, value: "single" },
          { label: <SplitCellsOutlined style={{ fontSize: 16 }} />, value: "split" },
        ]}
        value="single"
        onChange={() => {}}
      />
      <Button variant="primary" className="border-green-500 bg-green-500 hover:bg-green-600">
        Save as final
      </Button>
    </Navbar>
  ),
};

/* ------------------------------------------------------------------ */
/*  NewPaymentNavbar                                                   */
/*  Pattern: New payment form with Cancel + Add actions                */
/*  Source: /payments/new page                                         */
/* ------------------------------------------------------------------ */

export const NewPaymentNavbar: Story = {
  render: () => (
    <Navbar backHref="/payments" title="New payment">
      <Button variant="secondary" className="border-primary text-primary hover:bg-primary/10">
        Cancel
      </Button>
      <Button variant="primary">Add</Button>
    </Navbar>
  ),
};

/* ------------------------------------------------------------------ */
/*  NewNoteNavbar                                                      */
/*  Pattern: New note with Unsaved badge + green add button + toggle   */
/*  Source: /notes/new page                                            */
/* ------------------------------------------------------------------ */

export const NewNoteNavbar: Story = {
  render: () => (
    <Navbar
      backHref="/"
      title="New progress note"
      badge={<Badge variant="yellow">Unsaved</Badge>}
    >
      <Button variant="primary" round size="sm" className="border-green-500 bg-green-500 hover:bg-green-600">
        <span className="text-heading-lg leading-none">+</span>
      </Button>
      <Filter
        items={[
          { label: <AppstoreOutlined style={{ fontSize: 16 }} />, value: "single" },
          { label: <SplitCellsOutlined style={{ fontSize: 16 }} />, value: "split" },
        ]}
        value="single"
        onChange={() => {}}
      />
    </Navbar>
  ),
};

/* ------------------------------------------------------------------ */
/*  FormEditorNavbar                                                   */
/*  Pattern: Form template editor with Share, Preview, and Save        */
/*  Source: /settings/forms/[id] page                                  */
/* ------------------------------------------------------------------ */

export const FormEditorNavbar: Story = {
  render: () => (
    <Navbar backHref="/settings/forms" title="Client intake form">
      <div className="flex items-center gap-2">
        <Button variant="icon" title="Share & Automate">
          <ShareAltOutlined style={{ fontSize: 16 }} />
        </Button>
        <Button variant="secondary">
          <EyeOutlined style={{ fontSize: 16 }} /> Preview
        </Button>
        <Button variant="primary">Save</Button>
      </div>
    </Navbar>
  ),
};

/* ------------------------------------------------------------------ */
/*  CSVImportNavbar                                                    */
/*  Pattern: Data import wizard with Cancel + Import actions           */
/*  Source: /settings/data-import/csv page                             */
/* ------------------------------------------------------------------ */

export const CSVImportNavbar: Story = {
  render: () => (
    <Navbar backHref="/settings/data-import" title="CSV Import">
      <div className="flex items-center gap-2">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Import</Button>
      </div>
    </Navbar>
  ),
};
