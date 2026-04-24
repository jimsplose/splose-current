"use client";

import { useState } from "react";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Alert, Badge, Card, Dropdown, List, Modal, Toggle, DateRangeFilter, FormSelect, PageHeader } from "@/components/ds";

interface PerformanceRow {
  practitioner: string;
  available: number;
  booked: number;
  utilisation: number;
  revenue: number;
  avgPerAppt: number;
}

const mockPerformanceRows: PerformanceRow[] = [
  { practitioner: "Dr Emily Watson", available: 40, booked: 34, utilisation: 85, revenue: 7480, avgPerAppt: 220 },
  { practitioner: "Rachel Kim", available: 38, booked: 30, utilisation: 79, revenue: 5940, avgPerAppt: 198 },
  { practitioner: "Tom Bradley", available: 40, booked: 28, utilisation: 70, revenue: 5040, avgPerAppt: 180 },
  { practitioner: "Dr Anika Patel", available: 36, booked: 31, utilisation: 86, revenue: 6820, avgPerAppt: 220 },
  { practitioner: "Chris Lawson", available: 32, booked: 22, utilisation: 69, revenue: 3740, avgPerAppt: 170 },
  { practitioner: "Megan Torres", available: 38, booked: 33, utilisation: 87, revenue: 6270, avgPerAppt: 190 },
];

const exportItems = [
  { label: "Export as CSV", value: "csv" },
  { label: "Export as PDF", value: "pdf" },
];

const periodOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const columns: ColumnsType<PerformanceRow> = [
  {
    key: "practitioner",
    title: "Practitioner",
    dataIndex: "practitioner",
    render: (_, row) => <span style={{ color: 'var(--color-primary)' }}>{row.practitioner}</span>,
  },
  {
    key: "available",
    title: "Available hours",
    dataIndex: "available",
    align: "right",
    render: (_, row) => `${row.available}h`,
  },
  {
    key: "booked",
    title: "Booked hours",
    dataIndex: "booked",
    align: "right",
    render: (_, row) => `${row.booked}h`,
  },
  {
    key: "utilisation",
    title: "Utilisation %",
    dataIndex: "utilisation",
    align: "right",
    render: (_, row) => (
      <span style={{ fontWeight: row.utilisation >= 80 ? 600 : 400, color: row.utilisation >= 80 ? '#16a34a' : row.utilisation >= 70 ? '#ca8a04' : '#dc2626' }}>
        {row.utilisation}%
      </span>
    ),
  },
  {
    key: "revenue",
    title: "Revenue",
    dataIndex: "revenue",
    align: "right",
    render: (_, row) => `$${row.revenue.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`,
  },
  {
    key: "avgPerAppt",
    title: "Avg per appointment",
    dataIndex: "avgPerAppt",
    align: "right",
    render: (_, row) => `$${row.avgPerAppt.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`,
  },
];

export default function ReportsPerformancePage() {
  const [showResults, setShowResults] = useState(false);
  const [showDefinitions, setShowDefinitions] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [period, setPeriod] = useState("weekly");
  const [compareEnabled, setCompareEnabled] = useState(false);

  const handleExport = (value: string) => {
    if (value === "csv") {
      setToastMessage("Export started...");
      setTimeout(() => setToastMessage(null), 3000);
    } else if (value === "pdf") {
      setToastMessage("PDF export started...");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <>
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed right-4 top-4 z-50">
          <Alert variant="success">{toastMessage}</Alert>
        </div>
      )}

      <PageHeader title="Performance">
        <Dropdown
          trigger={<Button>Export</Button>}
          items={exportItems}
          onSelect={handleExport}
        />
        <Button onClick={() => setShowDefinitions(true)}>Definitions</Button>
      </PageHeader>

      {/* Toolbar: date pill, period toggle, compare toggle */}
      <Flex wrap="wrap" align="center" gap={12} style={{ marginBottom: 16 }}>
        <Badge variant="green" shape="pill">11 Mar 2026 – 11 Mar 2026</Badge>

        {/* Period selector pills */}
        <Flex style={{ borderRadius: 9999, border: '1px solid var(--color-border)', backgroundColor: 'white', padding: 2 }}>
          {periodOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              style={{
                borderRadius: 9999,
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 4,
                paddingBottom: 4,
                fontSize: 13,
                fontWeight: 500,
                lineHeight: 1.38,
                transition: 'color 0.2s',
                backgroundColor: period === opt.value ? 'var(--color-primary)' : 'transparent',
                color: period === opt.value ? 'white' : 'var(--color-text-secondary)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          ))}
        </Flex>

        <Toggle
          checked={compareEnabled}
          onChange={setCompareEnabled}
          label="Compare"
        />
        {compareEnabled && (
          <Badge variant="gray">vs 4 Mar – 4 Mar 2026</Badge>
        )}
      </Flex>

      {/* Filter buttons */}
      <Flex wrap="wrap" align="center" gap={8} style={{ marginBottom: 24 }}>
        <Button>Add filter</Button>
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button type="primary" onClick={() => setShowResults(true)}>Run report</Button>
      </Flex>

      {/* Configuration options */}
      <Flex vertical gap={12} style={{ fontSize: 12 }}>
        <Flex align="center" gap={16}>
          <span style={{ width: 320, color: 'var(--color-text)' }}>Identify as new client if no previous service:</span>
          <FormSelect
            options={[
              { value: "ever", label: "Ever" },
              { value: "12months", label: "Last 12 months" },
              { value: "6months", label: "Last 6 months" },
            ]}
            style={{ width: 'auto' }}
          />
        </Flex>
        <Flex align="center" gap={16}>
          <span style={{ width: 320, color: 'var(--color-text)' }}>Exclude busy time from utilisation calculation:</span>
          <FormSelect
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
            style={{ width: 'auto' }}
          />
        </Flex>
        <Flex align="center" gap={16}>
          <span style={{ width: 320, color: 'var(--color-text)' }}>
            Include all appointments regardless of status:
          </span>
          <FormSelect
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
            style={{ width: 'auto' }}
          />
        </Flex>
        <Flex align="center" gap={16}>
          <span style={{ width: 320, color: 'var(--color-text)' }}>
            Exclude items marked as do not invoice:
          </span>
          <FormSelect
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
            style={{ width: 'auto' }}
          />
        </Flex>
      </Flex>

      {showResults && (
        <Card padding="none" style={{ marginTop: 24, overflowX: 'auto' }}>
          <Table columns={columns} dataSource={mockPerformanceRows} rowKey={(_, index) => String(index)} pagination={false} />
        </Card>
      )}

      <Modal
        open={showDefinitions}
        onClose={() => setShowDefinitions(false)}
        title="Performance metric definitions"
        footer={<Button type="primary" onClick={() => setShowDefinitions(false)}>Close</Button>}
      >
        <List
          layout="stacked"
          items={[
            {
              label: "Available hours",
              value: "The total number of hours a practitioner has marked as available in their schedule during the selected date range, excluding blocked time and leave.",
            },
            {
              label: "Booked hours",
              value: "The total number of hours occupied by confirmed client appointments during the selected date range. Does not include cancelled or no-show appointments unless configured otherwise.",
            },
            {
              label: "Utilisation %",
              value: "The percentage of available hours that were booked with client appointments. Calculated as (Booked hours / Available hours) x 100. A higher percentage indicates more efficient use of available time.",
            },
            {
              label: "Revenue",
              value: "The total dollar value of services delivered by the practitioner during the selected date range, based on the service rates at the time of the appointment.",
            },
          ]}
        />
      </Modal>
    </>
  );
}
