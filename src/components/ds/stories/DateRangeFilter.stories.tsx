"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import DateRangeFilter from "../DateRangeFilter";

const meta: Meta<typeof DateRangeFilter> = {
  title: "Forms/DateRangeFilter",
  component: DateRangeFilter,
  tags: ["extended"],
  argTypes: {
    startDate: { control: "text" },
    endDate: { control: "text" },
    className: { control: "text" },
  },
  parameters: {
    appPages: [
      { label: "Invoices — Batch invoice", vercel: "https://splose-current.vercel.app/invoices/batch-invoice", production: "https://acme.splose.com/invoices/batch-invoice" },
      { label: "Reports — Payments", vercel: "https://splose-current.vercel.app/reports/payments", production: "https://acme.splose.com/reports/payments" },
      { label: "Reports — Appointments", vercel: "https://splose-current.vercel.app/reports/appointments", production: "https://acme.splose.com/reports/appointments" },
      { label: "Reports — Waitlist", vercel: "https://splose-current.vercel.app/reports/waitlist", production: "https://acme.splose.com/reports/waitlist" },
    ],
    referenceUrl: "https://ant.design/components/date-picker",
  },
};

export default meta;
type Story = StoryObj<typeof DateRangeFilter>;

/* ── Playground ─────────────────────────────────────────────────────────── */

export const Playground: Story = {
  args: {
    startDate: "2026-03-01",
    endDate: "2026-03-23",
  },
};

/* ── Feature Stories ────────────────────────────────────────────────────── */

export const Default: Story = {
  args: {
    startDate: "2026-03-01",
    endDate: "2026-03-19",
  },
};

function CustomRangeDemo() {
  const [start, setStart] = useState("2026-01-01");
  const [end, setEnd] = useState("2026-03-31");

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DateRangeFilter
        startDate={start}
        endDate={end}
        onStartChange={setStart}
        onEndChange={setEnd}
      />
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        Range: {start} to {end}
      </p>
    </div>
  );
}

export const CustomRange: Story = {
  name: "Custom Range (interactive)",
  render: () => <CustomRangeDemo />,
};

/* ── Recipes ────────────────────────────────────────────────────────────── */

function ReportsDateRangeRecipe() {
  const [start, setStart] = useState("2026-03-11");
  const [end, setEnd] = useState("2026-03-11");

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>reports/appointments</code> — date range
        filter with label, used alongside report filters.
      </p>
      <div>
        <label style={{ color: 'var(--color-text-secondary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
          Date range *
        </label>
        <DateRangeFilter
          startDate={start}
          endDate={end}
          onStartChange={setStart}
          onEndChange={setEnd}
        />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <button style={{ borderRadius: 4, border: '1px solid var(--color-border)', borderColor: 'var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>
          Add filter
        </button>
        <button style={{ borderRadius: 4, border: '1px solid var(--color-border)', borderColor: 'var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>
          Save filters
        </button>
        <button style={{ borderRadius: 4, border: '1px solid var(--color-border)', borderColor: 'var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>
          Load filters
        </button>
        <button style={{ borderRadius: 4, paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6, color: '#fff', fontSize: 14, lineHeight: 1.57 }}>
          Run report
        </button>
      </div>
    </div>
  );
}

export const ReportsDateRange: Story = {
  name: "Recipe: Reports Date Range",
  render: () => <ReportsDateRangeRecipe />,
};

/* ------------------------------------------------------------------ */
/*  BatchInvoiceDateRange                                              */
/*  Pattern: Date range in a form with other selects, used for batch   */
/*  invoice generation. Shows wider date range and label-only style.   */
/*  Source: /invoices/batch-invoice — DateRangeFilter with label and   */
/*  practitioner/type selects                                          */
/* ------------------------------------------------------------------ */

export const BatchInvoiceDateRange: Story = {
  name: "Recipe: Batch Invoice Date Range",
  render: () => (
    <div style={{ maxWidth: 672, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>invoices/batch-invoice</code> — date range
        picker alongside practitioner and invoice type selects.
      </p>
      <div>
        <label style={{ color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block', fontSize: 12 }}>Date range *</label>
        <DateRangeFilter startDate="2026-03-01" endDate="2026-03-27" />
      </div>
      <div>
        <label style={{ color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block', fontSize: 12 }}>Practitioner</label>
        <select style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', borderColor: 'var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none', fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>
          <option>All practitioners</option>
          <option>Sarah Chen</option>
          <option>James Wilson</option>
        </select>
      </div>
      <div>
        <label style={{ color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block', fontSize: 12 }}>Invoice type</label>
        <select style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', borderColor: 'var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none', fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>
          <option>Standard</option>
          <option>NDIS</option>
          <option>Medicare</option>
        </select>
      </div>
      <button style={{ borderRadius: 8, paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, color: '#fff', fontSize: 14, fontWeight: 600, lineHeight: 1.57 }}>
        Preview
      </button>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  NdisBulkUploadDateRange                                            */
/*  Pattern: Date range with a summary count below, used for NDIS      */
/*  bulk upload creation. Shows helper text with item count.           */
/*  Source: /reports/ndis-bulk-upload/new — DateRangeFilter with a     */
/*  summary line counting support items in the selected range          */
/* ------------------------------------------------------------------ */

function NdisBulkUploadDateRangeRecipe() {
  const [start, setStart] = useState("2026-03-01");
  const [end, setEnd] = useState("2026-03-27");

  return (
    <div style={{ maxWidth: 672, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>reports/ndis-bulk-upload/new</code> — date
        range with a summary count of items in the range.
      </p>
      <div>
        <label style={{ color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block', fontSize: 12 }}>Date range *</label>
        <DateRangeFilter
          startDate={start}
          endDate={end}
          onStartChange={setStart}
          onEndChange={setEnd}
        />
        <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)', marginTop: 4 }}>
          12 support items from {start} to {end} at all practitioners
        </p>
      </div>
    </div>
  );
}

export const NdisBulkUploadDateRange: Story = {
  name: "Recipe: NDIS Bulk Upload Date Range",
  render: () => <NdisBulkUploadDateRangeRecipe />,
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  AgedDebtorsDateRange                                               */
/*  Pattern: Date range on a report page with aging summary cards.     */
/*  Shows how the filter sits above a result summary section.          */
/*  Source: /reports/aged-debtors — DateRangeFilter with Run report    */
/*  button and aging summary cards below                               */
/* ------------------------------------------------------------------ */

function AgedDebtorsDateRangeRecipe() {
  const [start, setStart] = useState("2026-03-11");
  const [end, setEnd] = useState("2026-03-11");
  const [showResults, setShowResults] = useState(false);

  const agingSummary = [
    { label: "Current", amount: "$2,450.00", color: "text-green-600" },
    { label: "30 days", amount: "$1,200.00", color: "text-yellow-600" },
    { label: "60 days", amount: "$800.00", color: "text-orange-600" },
    { label: "90+ days", amount: "$350.00", color: "text-red-600" },
  ];

  return (
    <div style={{ maxWidth: 768, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>reports/aged-debtors</code> — date range
        filter with &quot;Run report&quot; button revealing aging summary cards.
      </p>
      <div>
        <label style={{ color: 'var(--color-text-secondary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
          Date range *
        </label>
        <DateRangeFilter
          startDate={start}
          endDate={end}
          onStartChange={setStart}
          onEndChange={setEnd}
        />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <button style={{ borderRadius: 4, border: '1px solid var(--color-border)', borderColor: 'var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>
          Add filter
        </button>
        <button
          style={{ borderRadius: 4, paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6, color: '#fff', fontSize: 14, lineHeight: 1.57 }}
          onClick={() => setShowResults(true)}
        >
          Run report
        </button>
      </div>
      {showResults && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {agingSummary.map((item) => (
            <div key={item.label} style={{ borderRadius: 8, border: '1px solid var(--color-border)', padding: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>{item.label}</p>
              <p className={item.color} style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, marginTop: 4 }}>{item.amount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const AgedDebtorsDateRange: Story = {
  name: "Recipe: Aged Debtors Date Range",
  render: () => <AgedDebtorsDateRangeRecipe />,
  parameters: { layout: "padded" },
};
