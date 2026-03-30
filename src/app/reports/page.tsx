"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { CalendarOutlined, DownOutlined, SettingOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { Avatar, Button, Card, Checkbox, ColorDot, Dropdown, FormInput, FormSelect } from "@/components/ds";
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
    <div style={{ position: 'relative' }} ref={ref}>
      <Button
        variant="secondary"
        size="sm"
        htmlType="button"
        onClick={() => setOpen(!open)}
        className="!rounded-full !border-primary !bg-primary/10 !font-medium !text-primary hover:!bg-primary/20"
      >
        <CalendarOutlined style={{ fontSize: 16 }} />
        {fmtShort(startDate)} &rarr; {fmtShort(endDate)}
        <DownOutlined style={{ fontSize: 14 }} />
      </Button>

      {open && (
        <div style={{ position: 'absolute', left: 0, top: '100%', zIndex: 30, marginTop: 4, width: 320, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          {/* Presets */}
          <div style={{ borderBottom: '1px solid var(--color-border)', padding: 8 }}>
            <p style={{ marginBottom: 6, paddingLeft: 8, paddingRight: 8, fontSize: 12, color: 'var(--color-text-secondary)' }}>Quick select</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {presets.map((p) => (
                <Button
                  key={p.label}
                  variant="ghost"
                  size="sm"
                  htmlType="button"
                  onClick={() => applyPreset(p)}
                  className="!justify-start !rounded-md !text-body-sm !text-text hover:!bg-primary/5 hover:!text-primary"
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom date inputs */}
          <div style={{ padding: 12 }}>
            <p style={{ marginBottom: 8, fontSize: 12, color: 'var(--color-text-secondary)' }}>Custom range</p>
            <Flex align="center" gap={8}>
              <FormInput
                type="date"
                value={toInputDate(startDate)}
                onChange={(e) => onChange(new Date(e.target.value), endDate)}
                className="!py-1.5 !text-body-sm"
              />
              <span style={{ color: 'var(--color-text-secondary)' }}>&rarr;</span>
              <FormInput
                type="date"
                value={toInputDate(endDate)}
                onChange={(e) => onChange(startDate, new Date(e.target.value))}
                className="!py-1.5 !text-body-sm"
              />
            </Flex>
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
  const [utilisationSettingsOpen, setUtilisationSettingsOpen] = useState(false);
  const [excludeBusyTime, setExcludeBusyTime] = useState(false);
  const [excludeDoNotInvoice, setExcludeDoNotInvoice] = useState(false);
  const [includeInvoicedCancellations, setIncludeInvoicedCancellations] = useState(false);
  const utilisationSettingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (utilisationSettingsRef.current && !utilisationSettingsRef.current.contains(e.target as Node)) {
        setUtilisationSettingsOpen(false);
      }
    }
    if (utilisationSettingsOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [utilisationSettingsOpen]);

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
      <Flex align="center" justify="space-between" style={{ marginBottom: 16 }}>
        <h1 className="text-display-lg">Performance overview</h1>
      </Flex>

      {/* Filter bar */}
      <Flex wrap="wrap" align="center" gap={8} style={{ marginBottom: 24 }}>
        <DateRangePicker
          startDate={dateStart}
          endDate={dateEnd}
          onChange={(s, e) => { setDateStart(s); setDateEnd(e); }}
        />
        <FormSelect
          options={frequencyOptions}
          value={frequency}
          onChange={setFrequency}
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
      </Flex>

      {/* Charts row */}
      <div style={{ marginBottom: 24, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
        {/* Utilisation card */}
        <Card>
          <div style={{ position: 'relative', marginBottom: 4 }} ref={utilisationSettingsRef}>
            <Flex align="center" justify="space-between">
              <h3 className="text-heading-sm" style={{ color: 'var(--color-text)' }}>Utilisation</h3>
              <Button
                variant="icon"
                size="sm"
                htmlType="button"
                onClick={() => setUtilisationSettingsOpen(!utilisationSettingsOpen)}
              >
                <SettingOutlined style={{ fontSize: 16, color: 'var(--color-text-secondary)' }} />
              </Button>
            </Flex>
            {utilisationSettingsOpen && (
              <div style={{ position: 'absolute', right: 0, top: '100%', zIndex: 30, marginTop: 4, width: 280, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'white', padding: 16, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                <h4 className="text-heading-sm" style={{ color: 'var(--color-text)' }}>Utilisation settings</h4>
                <p className="text-caption-md" style={{ marginBottom: 12, color: 'var(--color-text-secondary)' }}>
                  Adjust calculation settings for utilisation metrics.
                </p>
                <Flex vertical gap={12}>
                  <Checkbox
                    label="Exclude busy time"
                    checked={excludeBusyTime}
                    onChange={(e) => setExcludeBusyTime(e.target.checked)}
                  />
                  <Checkbox
                    label="Exclude do not invoice"
                    checked={excludeDoNotInvoice}
                    onChange={(e) => setExcludeDoNotInvoice(e.target.checked)}
                  />
                  <Checkbox
                    label="Include invoiced cancellations/DNAs"
                    checked={includeInvoicedCancellations}
                    onChange={(e) => setIncludeInvoicedCancellations(e.target.checked)}
                  />
                </Flex>
              </div>
            )}
          </div>
          <p className="text-caption-md" style={{ marginBottom: 8, color: 'var(--color-text-secondary)' }}>Percentage of available time utilised</p>
          <p className="text-metric-lg" style={{ marginBottom: 4, color: 'var(--color-text)' }}>{(totalUtilisation / sortedPractitioners.length).toFixed(2)}%</p>
          <p className="text-caption-md" style={{ marginBottom: 16, color: 'var(--color-text-secondary)' }}>{fmtDay(dateStart)} - {fmtDay(dateEnd)}</p>
          <div style={{ position: 'relative', height: 128 }}>
            <svg viewBox="0 0 280 100" style={{ height: '100%', width: '100%' }} preserveAspectRatio="none">
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
            <Flex vertical justify="space-between" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, marginLeft: -4 }} className="text-caption-sm text-text-secondary">
              {(() => { const max = Math.ceil(Math.max(...utilisationData) + 1); return [max, Math.round(max * 0.67), Math.round(max * 0.33), 0].map((v) => <span key={v}>{v}%</span>); })()}
            </Flex>
          </div>
          <Flex justify="space-between" style={{ marginTop: 4, paddingLeft: 8, paddingRight: 8 }} className="text-caption-sm text-text-secondary">
            {chartDays.map((d) => (<span key={d}>{d}</span>))}
          </Flex>
          <Flex align="center" justify="center" gap={4} style={{ marginTop: 8 }} className="text-caption-sm text-text-secondary">
            <ColorDot color="var(--color-primary)" size="xs" />
            {fmtDay(dateStart)} - {fmtDay(dateEnd)}
          </Flex>
        </Card>

        {/* Revenue card */}
        <Card>
          <Flex align="center" justify="space-between" style={{ marginBottom: 4 }}>
            <h3 className="text-heading-sm" style={{ color: 'var(--color-text)' }}>Revenue</h3>
          </Flex>
          <p className="text-caption-md" style={{ marginBottom: 8, color: 'var(--color-text-secondary)' }}>Total invoiced revenue from appointments and support activities (tax exclusive)</p>
          <p className="text-metric-lg" style={{ marginBottom: 4, color: 'var(--color-text)' }}>${totalRevenue >= 1000 ? (totalRevenue / 1000).toFixed(2) + "K" : totalRevenue.toFixed(2)}</p>
          <p className="text-caption-md" style={{ marginBottom: 16, color: 'var(--color-text-secondary)' }}>{fmtDay(dateStart)} - {fmtDay(dateEnd)}</p>
          <div style={{ position: 'relative', height: 128 }}>
            <Flex vertical justify="space-between" style={{ position: 'absolute', top: 0, bottom: 0, left: 0 }} className="text-caption-sm text-text-secondary">
              {(() => { const max = Math.ceil(Math.max(...revenueData) / 50) * 50; return [max, Math.round(max * 0.67), Math.round(max * 0.33), 0].map((v) => <span key={v}>${v}</span>); })()}
            </Flex>
            <Flex align="flex-end" gap={8} style={{ marginLeft: 32, height: '100%' }}>
              {revenueData.map((val, i) => (
                <Flex key={i} vertical align="center" gap={2} style={{ flex: 1 }}>
                  <div
                    style={{ width: '100%', borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: 'var(--color-primary)', height: `${(val / (Math.ceil(Math.max(...revenueData) / 50) * 50 || 1)) * 100}%`, minHeight: val > 0 ? 2 : 0 }}
                  />
                </Flex>
              ))}
            </Flex>
          </div>
          <Flex justify="space-between" style={{ marginTop: 4, marginLeft: 32 }} className="text-caption-sm text-text-secondary">
            {chartDays.map((d) => (<span key={d}>{d}</span>))}
          </Flex>
          <Flex align="center" justify="center" gap={4} style={{ marginTop: 8 }} className="text-caption-sm text-text-secondary">
            <ColorDot color="var(--color-primary)" size="xs" />
            {fmtDay(dateStart)} - {fmtDay(dateEnd)}
          </Flex>
        </Card>
      </div>

      {/* Practitioners table */}
      <Card padding="none">
        <Flex align="center" justify="space-between" style={{ borderBottom: '1px solid var(--color-border)', padding: '12px 16px' }}>
          <div>
            <h3 className="text-heading-sm" style={{ color: 'var(--color-text)' }}>Practitioners</h3>
            <p className="text-caption-md" style={{ color: 'var(--color-text-secondary)' }}>Breakdown of performance by individual practitioner</p>
          </div>
        </Flex>
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
                  <Flex align="center" gap={12}>
                    <Avatar name={p.name} color={p.color} size="sm" />
                    <span className="text-body-md" style={{ color: 'var(--color-text)' }}>{p.name}</span>
                  </Flex>
                </Td>
                <Td>
                  <Flex align="center" gap={8}>
                    <div style={{ height: 6, width: 64, borderRadius: 9999, backgroundColor: '#f3f4f6' }}>
                      <div
                        style={{ height: 6, borderRadius: 9999, backgroundColor: 'var(--color-primary)', width: `${Math.min(p.utilisation * 10, 100)}%` }}
                      />
                    </div>
                    <span className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>{p.utilisation.toFixed(2)}%</span>
                  </Flex>
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
