"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Avatar, Button, Card, ColorDot, Dropdown, FormSelect } from "@/components/ds";
import { DataTable, TableHead, Th, TableBody, Tr, Td } from "@/components/ds";
import type { DropdownItem } from "@/components/ds";

/* ── Date helpers ─────────────────────────────────────────────── */

function fmtShort(d: Date) {
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "2-digit" });
}
function fmtDay(d: Date) {
  return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short" });
}
function toInputDate(d: Date) {
  return d.toISOString().split("T")[0];
}
function daysAgo(n: number) {
  return new Date(Date.now() - n * 86400000);
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function startOfLastMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() - 1, 1);
}
function endOfLastMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 0);
}

/* ── DateRangePicker with presets ─────────────────────────────── */

function DateRangePicker({
  startDate,
  endDate,
  onChange,
}: {
  startDate: Date;
  endDate: Date;
  onChange: (start: Date, end: Date) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const presets = [
    { label: "Last 7 days", start: daysAgo(7), end: new Date() },
    { label: "Last 14 days", start: daysAgo(14), end: new Date() },
    { label: "Last 30 days", start: daysAgo(30), end: new Date() },
    { label: "Last month", start: startOfLastMonth(), end: endOfLastMonth() },
    { label: "This month", start: startOfMonth(new Date()), end: new Date() },
    { label: "Last 3 months", start: daysAgo(90), end: new Date() },
    { label: "Last 6 months", start: daysAgo(180), end: new Date() },
    { label: "Year to date", start: new Date(new Date().getFullYear(), 0, 1), end: new Date() },
  ];

  function applyPreset(p: (typeof presets)[number]) {
    onChange(p.start, p.end);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-3 py-1.5 text-body-md font-medium text-primary transition-colors hover:bg-primary/20"
      >
        <Calendar className="h-4 w-4" />
        {fmtShort(startDate)} &rarr; {fmtShort(endDate)}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-80 rounded-lg border border-border bg-white shadow-lg">
          {/* Presets */}
          <div className="border-b border-border p-2">
            <p className="mb-1.5 px-2 text-label-md text-text-secondary">Quick select</p>
            <div className="grid grid-cols-2 gap-1">
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="rounded-md px-3 py-1.5 text-left text-body-sm text-text transition-colors hover:bg-primary/5 hover:text-primary"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom date inputs */}
          <div className="p-3">
            <p className="mb-2 text-label-md text-text-secondary">Custom range</p>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={toInputDate(startDate)}
                onChange={(e) => onChange(new Date(e.target.value), endDate)}
                className="flex-1 rounded-lg border border-border px-3 py-1.5 text-body-sm text-text focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              />
              <span className="text-text-secondary">&rarr;</span>
              <input
                type="date"
                value={toInputDate(endDate)}
                onChange={(e) => onChange(startDate, new Date(e.target.value))}
                className="flex-1 rounded-lg border border-border px-3 py-1.5 text-body-sm text-text focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

type SortKey = "name" | "utilisation" | "revenue";
type SortDir = "asc" | "desc";

export default function ReportsPage() {
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedPractitioner, setSelectedPractitioner] = useState("all");
  const [compareMode, setCompareMode] = useState(false);
  const [frequency, setFrequency] = useState("daily");
  const [dateStart, setDateStart] = useState(() => daysAgo(7));
  const [dateEnd, setDateEnd] = useState(() => new Date());
  const [sortKey, setSortKey] = useState<SortKey>("utilisation");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const locationItems: DropdownItem[] = [
    { label: "All locations", value: "all" },
    { label: "East Clinics", value: "east" },
    { label: "West Clinics", value: "west" },
    { label: "North Clinics", value: "north" },
    { label: "Telehealth", value: "telehealth" },
  ];

  const practitionerItems: DropdownItem[] = [
    { label: "All practitioners", value: "all" },
    { label: "Sophie Anderson", value: "sophie-anderson" },
    { label: "James Wilson", value: "james-wilson" },
    { label: "Priya Sharma", value: "priya-sharma" },
    { label: "Daniel O'Brien", value: "daniel-obrien" },
  ];

  const locationLabel = locationItems.find((i) => i.value === selectedLocation)?.label ?? "All locations";
  const practitionerLabel = practitionerItems.find((i) => i.value === selectedPractitioner)?.label ?? "All practitioners";

  const practitioners = [
    { name: "Ruvi R.", color: "#ef4444", utilisation: 10.09, revenue: 393.0 },
    { name: "Hung Yee Wong", color: "#8b5cf6", utilisation: 6.88, revenue: 289.5 },
    { name: "Dominica Barrett", color: "#06b6d4", utilisation: 5.0, revenue: 0.0 },
    { name: "Hrishikesh Koli", color: "#ec4899", utilisation: 4.87, revenue: 0.0 },
    { name: "Joseph Ge", color: "#22c55e", utilisation: 4.69, revenue: 0.0 },
    { name: "Sharon Tan", color: "#f59e0b", utilisation: 2.58, revenue: 193.0 },
    { name: "Hao Wang", color: "#3b82f6", utilisation: 2.5, revenue: 0.0 },
    { name: "Nghia Hoang", color: "#6366f1", utilisation: 2.29, revenue: 0.0 },
  ];

  const sortedPractitioners = useMemo(() => {
    return [...practitioners].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const chartDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(dateStart.getTime() + i * ((dateEnd.getTime() - dateStart.getTime()) / 6));
    return fmtDay(d);
  });

  // Chart data derived from practitioner table totals
  const totalUtilisation = sortedPractitioners.reduce((sum, p) => sum + p.utilisation, 0);
  const totalRevenue = sortedPractitioners.reduce((sum, p) => sum + p.revenue, 0);
  const utilisationData = [
    totalUtilisation * 0.08,
    totalUtilisation * 0.12,
    totalUtilisation * 0.15,
    totalUtilisation * 0.18,
    totalUtilisation * 0.14,
    totalUtilisation * 0.20,
    totalUtilisation * 0.13,
  ];
  const revenueData = [
    totalRevenue * 0.05,
    totalRevenue * 0.10,
    totalRevenue * 0.12,
    totalRevenue * 0.22,
    totalRevenue * 0.18,
    totalRevenue * 0.20,
    totalRevenue * 0.13,
  ];

  const frequencyOptions = [
    { value: "daily", label: "Frequency: Daily" },
    { value: "weekly", label: "Frequency: Weekly" },
    { value: "monthly", label: "Frequency: Monthly" },
    { value: "quarterly", label: "Frequency: Quarterly" },
    { value: "yearly", label: "Frequency: Yearly" },
  ];

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-display-lg text-text">Performance overview</h1>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <DateRangePicker
          startDate={dateStart}
          endDate={dateEnd}
          onChange={(s, e) => { setDateStart(s); setDateEnd(e); }}
        />
        <FormSelect
          options={frequencyOptions}
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="!w-auto cursor-pointer !rounded-full !border-primary !bg-primary/10 !font-medium !text-primary"
        />
        <Dropdown
          trigger={<Button variant="secondary" size="sm" className="rounded-full">{locationLabel}</Button>}
          items={locationItems}
          onSelect={setSelectedLocation}
        />
        <Dropdown
          trigger={<Button variant="secondary" size="sm" className="rounded-full">{practitionerLabel}</Button>}
          items={practitionerItems}
          onSelect={setSelectedPractitioner}
        />
        <Button
          variant={compareMode ? "primary" : "secondary"}
          size="sm"
          className="rounded-full"
          onClick={() => setCompareMode(!compareMode)}
        >
          Compare
        </Button>
      </div>

      {/* Charts row */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Utilisation card */}
        <Card>
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-heading-sm text-text">Utilisation</h3>
          </div>
          <p className="mb-2 text-caption-md text-text-secondary">Percentage of available time utilised</p>
          <p className="mb-1 text-metric-lg text-text">{(totalUtilisation / sortedPractitioners.length).toFixed(2)}%</p>
          <p className="mb-4 text-caption-md text-text-secondary">{fmtDay(dateStart)} - {fmtDay(dateEnd)}</p>
          <div className="relative h-32">
            <svg viewBox="0 0 280 100" className="h-full w-full" preserveAspectRatio="none">
              {[0, 25, 50, 75, 100].map((y) => (
                <line key={y} x1="0" y1={y} x2="280" y2={y} stroke="#f0f0f0" strokeWidth="0.5" />
              ))}
              <polyline
                fill="none"
                stroke="#7c3aed"
                strokeWidth="2"
                points={utilisationData.map((v, i) => { const max = Math.ceil(Math.max(...utilisationData) + 1); return `${i * 46.67},${100 - (v / max) * 100}`; }).join(" ")}
              />
              <polygon
                fill="rgba(124, 58, 237, 0.1)"
                points={`0,100 ${utilisationData.map((v, i) => { const max = Math.ceil(Math.max(...utilisationData) + 1); return `${i * 46.67},${100 - (v / max) * 100}`; }).join(" ")} 280,100`}
              />
              {utilisationData.map((v, i) => {
                const max = Math.ceil(Math.max(...utilisationData) + 1);
                return <circle key={i} cx={i * 46.67} cy={100 - (v / max) * 100} r="3" fill="#7c3aed" />;
              })}
            </svg>
            <div className="absolute top-0 bottom-0 left-0 -ml-1 flex flex-col justify-between text-caption-sm text-text-secondary">
              {(() => { const max = Math.ceil(Math.max(...utilisationData) + 1); return [max, Math.round(max * 0.67), Math.round(max * 0.33), 0].map((v) => <span key={v}>{v}%</span>); })()}
            </div>
          </div>
          <div className="mt-1 flex justify-between px-2 text-caption-sm text-text-secondary">
            {chartDays.map((d) => (<span key={d}>{d}</span>))}
          </div>
          <div className="mt-2 flex items-center justify-center gap-1 text-caption-sm text-text-secondary">
            <ColorDot color="var(--color-primary)" size="xs" />
            {fmtDay(dateStart)} - {fmtDay(dateEnd)}
          </div>
        </Card>

        {/* Revenue card */}
        <Card>
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-heading-sm text-text">Revenue</h3>
          </div>
          <p className="mb-2 text-caption-md text-text-secondary">Total invoiced revenue from appointments and support activities (tax exclusive)</p>
          <p className="mb-1 text-metric-lg text-text">${totalRevenue >= 1000 ? (totalRevenue / 1000).toFixed(2) + "K" : totalRevenue.toFixed(2)}</p>
          <p className="mb-4 text-caption-md text-text-secondary">{fmtDay(dateStart)} - {fmtDay(dateEnd)}</p>
          <div className="relative h-32">
            <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-between text-caption-sm text-text-secondary">
              {(() => { const max = Math.ceil(Math.max(...revenueData) / 50) * 50; return [max, Math.round(max * 0.67), Math.round(max * 0.33), 0].map((v) => <span key={v}>${v}</span>); })()}
            </div>
            <div className="ml-8 flex h-full items-end gap-2">
              {revenueData.map((val, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
                  <div
                    className="w-full rounded-t bg-primary"
                    style={{ height: `${(val / (Math.ceil(Math.max(...revenueData) / 50) * 50 || 1)) * 100}%`, minHeight: val > 0 ? "2px" : "0px" }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-1 ml-8 flex justify-between text-caption-sm text-text-secondary">
            {chartDays.map((d) => (<span key={d}>{d}</span>))}
          </div>
          <div className="mt-2 flex items-center justify-center gap-1 text-caption-sm text-text-secondary">
            <ColorDot color="var(--color-primary)" size="xs" />
            {fmtDay(dateStart)} - {fmtDay(dateEnd)}
          </div>
        </Card>
      </div>

      {/* Practitioners table */}
      <Card padding="none">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h3 className="text-heading-sm text-text">Practitioners</h3>
            <p className="text-caption-md text-text-secondary">Breakdown of performance by individual practitioner</p>
          </div>
        </div>
        <DataTable>
          <TableHead>
            <Th
              sortable
              sortDirection={sortKey === "name" ? sortDir : null}
              onSort={() => handleSort("name")}
            >
              Name
            </Th>
            <Th
              sortable
              sortDirection={sortKey === "utilisation" ? sortDir : null}
              onSort={() => handleSort("utilisation")}
            >
              Utilisation rate
            </Th>
            <Th
              sortable
              sortDirection={sortKey === "revenue" ? sortDir : null}
              onSort={() => handleSort("revenue")}
              align="right"
            >
              Revenue
            </Th>
          </TableHead>
          <TableBody>
            {sortedPractitioners.map((p) => (
              <Tr key={p.name} hover>
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={p.name} color={p.color} size="sm" />
                    <span className="text-body-md text-text">{p.name}</span>
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-gray-100">
                      <div
                        className="h-1.5 rounded-full bg-primary"
                        style={{ width: `${Math.min(p.utilisation * 10, 100)}%` }}
                      />
                    </div>
                    <span className="text-body-md text-text-secondary">{p.utilisation.toFixed(2)}%</span>
                  </div>
                </Td>
                <Td align="right">${p.revenue.toFixed(2)}</Td>
              </Tr>
            ))}
          </TableBody>
        </DataTable>
      </Card>
    </>
  );
}
