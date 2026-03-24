import type { Meta, StoryObj } from "@storybook/react";
import { Search, FileText, Package } from "lucide-react";
import EmptyState from "../EmptyState";
import Button from "../Button";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof EmptyState> = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  argTypes: {
    title: {
      control: "text",
      description: "Optional bold heading above the message",
    },
    message: {
      control: "text",
      description: "Descriptive message explaining the empty state",
    },
  },
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    title: "Nothing here yet",
    message: "Get started by creating your first item.",
    icon: <FileText className="h-10 w-10 text-text-secondary" />,
    action: <Button variant="primary">Create item</Button>,
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  args: {
    message: "No invoices found.",
  },
};

export const WithAction: Story = {
  args: {
    message: "No payments yet.",
    action: <Button variant="primary">Add payment</Button>,
  },
};

export const WithIcon: Story = {
  args: {
    icon: <Search className="h-10 w-10 text-text-secondary" />,
    title: "No results",
    message: "Try adjusting your search or filters.",
  },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  NoSearchResults                                                    */
/*  Pattern: Shown when a search/filter returns zero rows              */
/*  Source: /notes/[id]/edit — "No reference notes found"              */
/* ------------------------------------------------------------------ */

export const NoSearchResults: Story = {
  args: {
    message: "No reference notes found",
    className: "mt-16",
  },
};

/* ------------------------------------------------------------------ */
/*  NoNotesFound                                                       */
/*  Pattern: Empty table state on the notes list page                  */
/*  Source: /notes page                                                */
/* ------------------------------------------------------------------ */

export const NoNotesFound: Story = {
  args: {
    message: "No progress notes found. Create your first note to get started.",
    className: "py-12",
  },
};

/* ------------------------------------------------------------------ */
/*  NoProductsYet                                                      */
/*  Pattern: Empty table row for products list                         */
/*  Source: /products page                                             */
/* ------------------------------------------------------------------ */

export const NoProductsYet: Story = {
  render: () => (
    <div className="rounded-lg border border-border bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="px-4 py-3 text-label-lg text-text-secondary">Name</th>
            <th className="px-4 py-3 text-label-lg text-text-secondary">Price</th>
            <th className="px-4 py-3 text-label-lg text-text-secondary">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3}>
              <EmptyState
                icon={<Package className="h-10 w-10 text-text-secondary" />}
                message="No products found."
                className="py-8"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  ScreenerTriageEmpty                                                */
/*  Pattern: Empty state inside a screener/triage table — simple       */
/*  message without icon, matching the waitlist screener tab           */
/*  Source: src/app/waitlist/page.tsx — "No screener entries found."    */
/* ------------------------------------------------------------------ */

export const ScreenerTriageEmpty: Story = {
  name: "Recipe: Screener Triage Empty",
  render: () => (
    <div className="rounded-lg border border-border bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="px-4 py-3 text-label-lg text-text-secondary">Triage</th>
            <th className="px-4 py-3 text-label-lg text-text-secondary">Tags</th>
            <th className="px-4 py-3 text-label-lg text-text-secondary">Client</th>
            <th className="px-4 py-3 text-label-lg text-text-secondary">Date submitted</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4}>
              <EmptyState message="No screener entries found." className="py-8" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  WaitlistClosedEmpty                                                */
/*  Pattern: Dynamic message empty state for waitlist tabs — the       */
/*  message changes based on the active tab (active/closed)            */
/*  Source: src/app/waitlist/page.tsx — "No {tab} entries found."       */
/* ------------------------------------------------------------------ */

export const WaitlistClosedEmpty: Story = {
  name: "Recipe: Waitlist Closed Empty",
  render: () => (
    <div className="rounded-lg border border-border bg-white">
      <div className="flex gap-4 border-b border-border px-4 py-2">
        <span className="text-body-md text-text-secondary">Active</span>
        <span className="border-b-2 border-primary pb-1 text-body-md font-medium text-primary">
          Closed
        </span>
      </div>
      <EmptyState message="No closed entries found." className="py-8" />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  ContactAssociatedClientsEmpty                                      */
/*  Pattern: EmptyState with icon for no associated clients — used     */
/*  below a section heading on the contact detail page                 */
/*  Source: src/app/contacts/[id]/page.tsx — "No associated clients"    */
/* ------------------------------------------------------------------ */

export const ContactAssociatedClientsEmpty: Story = {
  name: "Recipe: No Associated Clients",
  render: () => (
    <div className="w-[500px] rounded-lg border border-border bg-white p-6">
      <h2 className="mb-4 text-heading-lg text-text">Associated clients</h2>
      <EmptyState
        icon={<Search className="h-10 w-10 text-gray-400" />}
        message="No associated clients"
      />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  FormTemplatesEmpty                                                 */
/*  Pattern: EmptyState placed below a DataTable (not inside tbody) —  */
/*  the forms settings page pattern for search-filtered empty results  */
/*  Source: src/app/settings/forms/page.tsx — "No form templates found" */
/* ------------------------------------------------------------------ */

export const FormTemplatesEmpty: Story = {
  name: "Recipe: Form Templates Empty",
  render: () => (
    <div className="rounded-lg border border-border bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="px-4 py-3 text-label-lg text-text-secondary">Title</th>
            <th className="px-4 py-3 text-label-lg text-text-secondary">Form type</th>
            <th className="px-4 py-3 text-label-lg text-text-secondary">Created at</th>
            <th className="px-4 py-3 text-label-lg text-text-secondary">Updated at</th>
          </tr>
        </thead>
      </table>
      <EmptyState message="No form templates found" className="py-8" />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  PaymentNoLinkedInvoices                                            */
/*  Pattern: EmptyState inside a payment form table with an            */
/*  instructional message — tells the user how to proceed              */
/*  Source: src/app/payments/new/page.tsx — "No invoices linked"        */
/* ------------------------------------------------------------------ */

export const PaymentNoLinkedInvoices: Story = {
  name: "Recipe: Payment No Linked Invoices",
  render: () => (
    <div className="rounded-lg border border-border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-heading-sm text-text">Linked invoices</h3>
        <button className="text-body-md text-primary">+ Link invoice</button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="px-4 py-2 text-label-lg text-text-secondary">Invoice #</th>
            <th className="px-4 py-2 text-label-lg text-text-secondary">Client</th>
            <th className="px-4 py-2 text-right text-label-lg text-text-secondary">Due</th>
            <th className="px-4 py-2 text-right text-label-lg text-text-secondary">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4}>
              <EmptyState
                message='No invoices linked. Click "Link invoice" to apply this payment to outstanding invoices.'
                className="py-6"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};
