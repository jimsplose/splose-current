"use client";

import { useState, useMemo } from "react";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Badge, DateRangeFilter, Dropdown, FormSelect, ListPage } from "@/components/ds";
import type { DropdownItem } from "@/components/ds";

interface Appointment {
  date: string;
  time: string;
  client: string;
  service: string;
  practitioner: string;
  location: string;
  status: string;
  invoice: string;
}

const mockAppointments: Appointment[] = [
  { date: "03/03/2026", time: "9:00 AM", client: "Liam Nguyen", service: "Initial Assessment", practitioner: "Dr Sarah Chen", location: "Melbourne CBD", status: "Completed", invoice: "Paid" },
  { date: "05/03/2026", time: "10:30 AM", client: "Olivia Smith", service: "Speech Therapy", practitioner: "Emma Williams", location: "Richmond", status: "Completed", invoice: "Paid" },
  { date: "08/03/2026", time: "2:00 PM", client: "Jack Thompson", service: "Occupational Therapy", practitioner: "Dr Sarah Chen", location: "Melbourne CBD", status: "No-show", invoice: "Unpaid" },
  { date: "10/03/2026", time: "11:00 AM", client: "Charlotte Brown", service: "Physiotherapy", practitioner: "James Anderson", location: "South Yarra", status: "Cancelled", invoice: "Voided" },
  { date: "12/03/2026", time: "3:30 PM", client: "Noah Wilson", service: "Psychology Session", practitioner: "Dr Lisa Park", location: "Melbourne CBD", status: "Completed", invoice: "Paid" },
  { date: "17/03/2026", time: "9:30 AM", client: "Amelia Davis", service: "Speech Therapy", practitioner: "Emma Williams", location: "Richmond", status: "Completed", invoice: "Unpaid" },
  { date: "20/03/2026", time: "1:00 PM", client: "Oliver Martin", service: "Exercise Physiology", practitioner: "James Anderson", location: "South Yarra", status: "Upcoming", invoice: "Pending" },
  { date: "24/03/2026", time: "4:00 PM", client: "Mia Taylor", service: "Initial Assessment", practitioner: "Dr Lisa Park", location: "Melbourne CBD", status: "Upcoming", invoice: "Pending" },
];

function statusVariantFor(status: string) {
  switch (status) {
    case "Completed": return "green" as const;
    case "Cancelled": return "red" as const;
    case "No-show": return "yellow" as const;
    case "Upcoming": return "blue" as const;
    default: return "gray" as const;
  }
}

type SortKey = keyof Appointment;
type SortDirection = "asc" | "desc" | null;

/** Parse AU date dd/mm/yyyy into sortable number */
function parseAuDate(d: string): number {
  const [day, month, year] = d.split("/");
  return Number(year) * 10000 + Number(month) * 100 + Number(day);
}

/** Parse time "9:00 AM" into minutes since midnight */
function parseTime(t: string): number {
  const match = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function compareValues(a: string, b: string, key: SortKey): number {
  if (key === "date") return parseAuDate(a) - parseAuDate(b);
  if (key === "time") return parseTime(a) - parseTime(b);
  return a.localeCompare(b);
}

const filterOptions: DropdownItem[] = [
  { label: "Status (Arrived, Did not arrive, Pending)", value: "status" },
  { label: "Service type", value: "service_type" },
  { label: "Location", value: "location" },
  { label: "Practitioner", value: "practitioner" },
];

const filterLabels: Record<string, string> = {
  status: "Status",
  service_type: "Service type",
  location: "Location",
  practitioner: "Practitioner",
};

export default function ReportsAppointmentsPage() {
  const [showResults, setShowResults] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleAddFilter = (value: string) => {
    if (!activeFilters.includes(value)) {
      setActiveFilters((prev) => [...prev, value]);
    }
  };

  const handleRemoveFilter = (value: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== value));
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // Cycle: asc -> desc -> null
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") { setSortKey(null); setSortDir(null); }
      else { setSortDir("asc"); }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedAppointments = useMemo(() => {
    if (!sortKey || !sortDir) return mockAppointments;
    return [...mockAppointments].sort((a, b) => {
      const cmp = compareValues(a[sortKey], b[sortKey], sortKey);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [sortKey, sortDir]);

  const columnDefs: { key: SortKey; label: string }[] = [
    { key: "date", label: "Date" },
    { key: "time", label: "Time" },
    { key: "client", label: "Client" },
    { key: "service", label: "Service" },
    { key: "practitioner", label: "Practitioner" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status" },
    { key: "invoice", label: "Invoice status" },
  ];

  const columns: ColumnsType<Appointment> = columnDefs.map((col) => {
    if (col.key === "status") {
      return {
        key: col.key,
        title: col.label,
        dataIndex: col.key,
        sorter: true,
        render: (_, row) => <Badge variant={statusVariantFor(row.status)}>{row.status}</Badge>,
      };
    }
    return {
      key: col.key,
      title: col.label,
      dataIndex: col.key,
      sorter: true,
    };
  });

  return (
    <ListPage
      title="Appointments"
      actions={
        <>
          <Button>Export</Button>
          <Button>Learn about this report</Button>
        </>
      }
      cardWrap={false}
    >
      {/* Date range */}
      <div style={{ marginBottom: 16 }}>
        <Flex align="center" gap={4} style={{ marginBottom: 4, fontSize: 12, color: 'var(--color-text-secondary)' }}>
          <span>&#128197;</span> Date range *
        </Flex>
        <DateRangeFilter startDate="2026-03-11" endDate="2026-03-11" />
      </div>

      {/* Contains note filter */}
      <div style={{ marginBottom: 16 }}>
        <Flex align="center" gap={4} style={{ marginBottom: 4, fontSize: 12, color: 'var(--color-text-secondary)' }}>
          <span>&#128196;</span> Contains note
          <Button type="text" size="small" style={{ marginLeft: 4, color: '#f87171' }}>&#10005;</Button>
        </Flex>
        <FormSelect
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          style={{ width: 192 }}
        />
      </div>

      {/* Filter buttons */}
      <Flex wrap="wrap" align="center" gap={8} style={{ marginBottom: 16 }}>
        <Dropdown
          trigger={<Button>Add filter</Button>}
          items={filterOptions.filter((o) => !activeFilters.includes(o.value))}
          onSelect={handleAddFilter}
        />
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button type="primary" onClick={() => setShowResults(true)}>Run report</Button>
      </Flex>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <Flex wrap="wrap" align="center" gap={8} style={{ marginBottom: 32 }}>
          {activeFilters.map((f) => (
            <Badge key={f} variant="blue" shape="pill" onRemove={() => handleRemoveFilter(f)}>
              {filterLabels[f]}
            </Badge>
          ))}
        </Flex>
      )}

      {showResults && (
        <>
          <p style={{ fontSize: 14, lineHeight: 1.57, margin: '16px 0', color: 'var(--color-text-secondary)' }}>{sortedAppointments.length} items found.</p>
          <Table
            columns={columns}
            dataSource={sortedAppointments}
            rowKey={(_, index) => String(index)}
            pagination={false}
            onChange={(_, __, sorter) => {
              const s = Array.isArray(sorter) ? sorter[0] : sorter;
              if (s && s.columnKey) {
                handleSort(s.columnKey as SortKey);
              }
            }}
          />
        </>
      )}
    </ListPage>
  );
}
