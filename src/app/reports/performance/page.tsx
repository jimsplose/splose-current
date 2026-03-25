"use client";

import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Chip,
  Dropdown,
  Modal,
  Toggle,
  DateRangeFilter,
  FormSelect,
  PageHeader,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
} from "@/components/ds";

const mockPerformanceRows = [
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
        <div className="fixed right-4 top-4 z-50 animate-in fade-in slide-in-from-top-2">
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
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Chip variant="green">11 Mar 2026 – 11 Mar 2026</Chip>

        {/* Period selector pills */}
        <div className="flex rounded-full border border-border bg-white p-0.5">
          {periodOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`rounded-full px-3 py-1 text-label-md transition-colors ${
                period === opt.value
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <Toggle
          checked={compareEnabled}
          onChange={setCompareEnabled}
          label="Compare"
        />
        {compareEnabled && (
          <Badge variant="gray">vs 4 Mar – 4 Mar 2026</Badge>
        )}
      </div>

      {/* Filter buttons */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Button>Add filter</Button>
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button variant="primary" onClick={() => setShowResults(true)}>Run report</Button>
      </div>

      {/* Configuration options */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-4">
          <span className="w-80 text-text">Identify as new client if no previous service:</span>
          <FormSelect
            options={[
              { value: "ever", label: "Ever" },
              { value: "12months", label: "Last 12 months" },
              { value: "6months", label: "Last 6 months" },
            ]}
            className="!w-auto"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="w-80 text-text">Exclude busy time from utilisation calculation:</span>
          <FormSelect
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
            className="!w-auto"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="w-80 text-text">
            Include all appointments regardless of status:
          </span>
          <FormSelect
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
            className="!w-auto"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="w-80 text-text">
            Exclude items marked as do not invoice:
          </span>
          <FormSelect
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
            className="!w-auto"
          />
        </div>
      </div>

      {showResults && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <DataTable>
            <TableHead>
              <Th>Practitioner</Th>
              <Th align="right">Available hours</Th>
              <Th align="right">Booked hours</Th>
              <Th align="right">Utilisation %</Th>
              <Th align="right">Revenue</Th>
              <Th align="right">Avg per appointment</Th>
            </TableHead>
            <TableBody>
              {mockPerformanceRows.map((row, i) => (
                <Tr key={i}>
                  <Td className="text-primary">{row.practitioner}</Td>
                  <Td align="right">{row.available}h</Td>
                  <Td align="right">{row.booked}h</Td>
                  <Td align="right">
                    <span className={row.utilisation >= 80 ? "font-semibold text-green-600" : row.utilisation >= 70 ? "text-yellow-600" : "text-red-600"}>
                      {row.utilisation}%
                    </span>
                  </Td>
                  <Td align="right">${row.revenue.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</Td>
                  <Td align="right">${row.avgPerAppt.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</Td>
                </Tr>
              ))}
            </TableBody>
          </DataTable>
        </div>
      )}

      <Modal
        open={showDefinitions}
        onClose={() => setShowDefinitions(false)}
        title="Performance metric definitions"
        footer={<Button variant="primary" onClick={() => setShowDefinitions(false)}>Close</Button>}
      >
        <dl className="space-y-4">
          <div>
            <dt className="text-label-lg text-text">Available hours</dt>
            <dd className="mt-0.5 text-body-md text-text-secondary">
              The total number of hours a practitioner has marked as available in their schedule during the selected date range, excluding blocked time and leave.
            </dd>
          </div>
          <div>
            <dt className="text-label-lg text-text">Booked hours</dt>
            <dd className="mt-0.5 text-body-md text-text-secondary">
              The total number of hours occupied by confirmed client appointments during the selected date range. Does not include cancelled or no-show appointments unless configured otherwise.
            </dd>
          </div>
          <div>
            <dt className="text-label-lg text-text">Utilisation %</dt>
            <dd className="mt-0.5 text-body-md text-text-secondary">
              The percentage of available hours that were booked with client appointments. Calculated as (Booked hours / Available hours) x 100. A higher percentage indicates more efficient use of available time.
            </dd>
          </div>
          <div>
            <dt className="text-label-lg text-text">Revenue</dt>
            <dd className="mt-0.5 text-body-md text-text-secondary">
              The total dollar value of services delivered by the practitioner during the selected date range, based on the service rates at the time of the appointment.
            </dd>
          </div>
        </dl>
      </Modal>
    </>
  );
}
