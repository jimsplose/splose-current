import type { Meta, StoryObj } from "@storybook/react";
import { CheckCircle, LayoutGrid, Columns2 } from "lucide-react";
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
      backHref="/notes"
      title="SOAP Note"
      badge={
        <>
          <Badge variant="green">
            <CheckCircle className="h-3 w-3" />
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
          { label: <LayoutGrid className="h-4 w-4" />, value: "single" },
          { label: <Columns2 className="h-4 w-4" />, value: "split" },
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
