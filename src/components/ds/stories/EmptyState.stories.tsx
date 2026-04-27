import type { Meta, StoryObj } from "@storybook/react";
import { SearchOutlined, FileTextOutlined, InboxOutlined } from "@ant-design/icons";
import EmptyState from "../EmptyState";
import { Button } from "antd";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof EmptyState> = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  tags: ["extended"],
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
    appPages: [
      {
        label: "Waitlist",
        vercel: "https://splose-current.vercel.app/waitlist",
        production: "https://acme.splose.com/waitlist",
      },
      {
        label: "Settings — Forms",
        vercel: "https://splose-current.vercel.app/settings/forms",
        production: "https://acme.splose.com/settings/forms",
      },
      {
        label: "Products",
        vercel: "https://splose-current.vercel.app/products",
        production: "https://acme.splose.com/products",
      },
      {
        label: "Client invoices tab",
        vercel: "https://splose-current.vercel.app/clients/cmngtw7n9005eycwg4e67506h/invoices",
        production: "https://acme.splose.com/patients/446604/invoices",
      },
    ],
    referenceUrl: "https://ant.design/components/empty",
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
    icon: <FileTextOutlined style={{ fontSize: 40, color: 'var(--color-text-secondary)' }} />,
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
    icon: <SearchOutlined style={{ fontSize: 40, color: 'var(--color-text-secondary)' }} />,
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
    style: { marginTop: 64 },
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
    style: { paddingTop: 48, paddingBottom: 48 },
  },
};

/* ------------------------------------------------------------------ */
/*  NoProductsYet                                                      */
/*  Pattern: Empty table row for products list                         */
/*  Source: /products page                                             */
/* ------------------------------------------------------------------ */

export const NoProductsYet: Story = {
  render: () => (
    <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff' }}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>Name</th>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>Price</th>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3}>
              <EmptyState
                icon={<InboxOutlined style={{ fontSize: 40, color: 'var(--color-text-secondary)' }} />}
                message="No products found."
                style={{ paddingTop: 32, paddingBottom: 32 }}
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
    <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff' }}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>Triage</th>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>Tags</th>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>Client</th>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>Date submitted</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4}>
              <EmptyState message="No screener entries found." style={{ paddingTop: 32, paddingBottom: 32 }} />
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
    <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff' }}>
      <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid var(--color-border)', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }}>
        <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Active</span>
        <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary)', paddingBottom: 4, fontWeight: 500 }}>
          Closed
        </span>
      </div>
      <EmptyState message="No closed entries found." style={{ paddingTop: 32, paddingBottom: 32 }} />
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
    <div style={{ width: 500, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, color: 'var(--color-text)', marginBottom: 16 }}>Associated clients</h2>
      <EmptyState
        icon={<SearchOutlined style={{ fontSize: 40, color: '#9ca3af' }} />}
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
    <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff' }}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>Title</th>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>Form type</th>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>Created at</th>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>Updated at</th>
          </tr>
        </thead>
      </table>
      <EmptyState message="No form templates found" style={{ paddingTop: 32, paddingBottom: 32 }} />
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
    <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 16 }}>
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)' }}>Linked invoices</h3>
        <button style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-primary)' }}>+ Link invoice</button>
      </div>
      <table style={{ width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }}>Invoice #</th>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }}>Client</th>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, textAlign: 'right' }}>Due</th>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4}>
              <EmptyState
                message='No invoices linked. Click "Link invoice" to apply this payment to outstanding invoices.'
                style={{ paddingTop: 24, paddingBottom: 24 }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};
