"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { CalendarOutlined, DownOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Select, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Avatar, Card, Checkbox, ColorDot, Divider, Dropdown, Grid, PageHeader, ProgressBar, Text } from "@/components/ds";
import type { DropdownItem } from "@/components/ds";
import styles from "./Reports.module.css";

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
    <div className={styles.dateRangeWrap} ref={ref}>
      <Button
        size="small"
        htmlType="button"
        onClick={() => setOpen(!open)}
        shape="round"
        className={styles.dateRangeBtn}
      >
        <CalendarOutlined className={styles.dateRangeIcon} />
        {fmtShort(startDate)} &rarr; {fmtShort(endDate)}
        <DownOutlined className={styles.dateRangeIcon} />
      </Button>

      {open && (
        <div className={styles.dateRangePopover}>
          {/* Presets */}
          <div className={styles.presetSection}>
            <Text variant="body/sm" color="secondary" className={styles.presetLabel}>Quick select</Text>
            <Grid cols={2} gap="xs">
              {presets.map((p) => (
                <Button
                  key={p.label}
                  type="text"
                  size="small"
                  htmlType="button"
                  onClick={() => applyPreset(p)}
                  className={styles.presetBtn}
                >
                  {p.label}
                </Button>
              ))}
            </Grid>
          </div>
          <Divider spacing="none" />

          {/* Custom date inputs */}
          <div className={styles.customRangeSection}>
            <Text variant="body/sm" color="secondary" mb={8}>Custom range</Text>
            <Flex align="center" gap={8}>
              <Input
                type="date"
                value={toInputDate(startDate)}
                onChange={(e) => onChange(new Date(e.target.value), endDate)}
                className={styles.dateInput}
              />
              <Text variant="body/md" as="span" color="secondary">&rarr;</Text>
              <Input
                type="date"
                value={toInputDate(endDate)}
                onChange={(e) => onChange(startDate, new Date(e.target.value))}
                className={styles.dateInput}
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

interface Practitioner {
  name: string;
  color: string;
  utilisation: number;
  revenue: number;
}

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

  const practitioners: Practitioner[] = [
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

  const columns: ColumnsType<Practitioner> = [
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
      sorter: true,
      render: (_, p) => (
        <Flex align="center" gap={12}>
          <Avatar name={p.name} color={p.color} size="sm" />
          <Text variant="body/md" as="span" color="text">{p.name}</Text>
        </Flex>
      ),
    },
    {
      key: "utilisation",
      title: "Utilisation rate",
      dataIndex: "utilisation",
      sorter: true,
      render: (_, p) => (
        <Flex align="center" gap={8}>
          <ProgressBar value={Math.min(p.utilisation * 10, 100)} width={64} />
          <Text variant="body/md" as="span" color="secondary">{p.utilisation.toFixed(2)}%</Text>
        </Flex>
      ),
    },
    {
      key: "revenue",
      title: "Revenue",
      dataIndex: "revenue",
      sorter: true,
      align: "right",
      render: (_, p) => `$${p.revenue.toFixed(2)}`,
    },
  ];

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
      <PageHeader title="Performance overview" />

      {/* Filter bar */}
      <Flex wrap="wrap" align="center" gap={8} className={styles.filterBar}>
        <DateRangePicker
          startDate={dateStart}
          endDate={dateEnd}
          onChange={(s, e) => { setDateStart(s); setDateEnd(e); }}
        />
        <Select
          options={frequencyOptions}
          value={frequency}
          onChange={setFrequency}
          className={styles.frequencySelect}
        />
        <Dropdown
          trigger={<Button size="small" shape="round">{locationLabel}</Button>}
          items={locationItems}
          onSelect={setSelectedLocation}
        />
        <Dropdown
          trigger={<Button size="small" shape="round">{practitionerLabel}</Button>}
          items={practitionerItems}
          onSelect={setSelectedPractitioner}
        />
        <Button
          type={compareMode ? "primary" : "default"}
          size="small"
          shape="round"
          onClick={() => setCompareMode(!compareMode)}
        >
          Compare
        </Button>
      </Flex>

      {/* Charts row */}
      <Grid cols={2} gap="lg" className={styles.chartsRow}>
        {/* Utilisation card */}
        <Card>
          <div className={styles.cardHeaderWrap} ref={utilisationSettingsRef}>
            <Flex align="center" justify="space-between">
              <Text variant="display/sm" as="h3" color="text" className={styles.cardTitle}>Utilisation</Text>
              <Button
                type="text"
                size="small"
                htmlType="button"
                onClick={() => setUtilisationSettingsOpen(!utilisationSettingsOpen)}
              >
                <SettingOutlined className={styles.settingsIcon} />
              </Button>
            </Flex>
            {utilisationSettingsOpen && (
              <div className={styles.settingsPopover}>
                <Text variant="heading/sm" as="h4" color="text">Utilisation settings</Text>
                <Text variant="caption/md" color="secondary" className={styles.settingsDescription}>
                  Adjust calculation settings for utilisation metrics.
                </Text>
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
          <Text variant="caption/md" color="secondary" mb={8}>Percentage of available time utilised</Text>
          <Text variant="metric/lg" as="p" color="text" mb={4}>{(totalUtilisation / sortedPractitioners.length).toFixed(2)}%</Text>
          <Text variant="caption/md" color="secondary" mb={16}>{fmtDay(dateStart)} - {fmtDay(dateEnd)}</Text>
          <div className={styles.chartContainer}>
            <svg viewBox="0 0 280 100" className={styles.chartSvg} preserveAspectRatio="none">
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
            <Flex vertical justify="space-between" className={styles.chartYAxis}>
              {(() => { const max = Math.ceil(Math.max(...utilisationData) + 1); return [max, Math.round(max * 0.67), Math.round(max * 0.33), 0].map((v) => <Text variant="caption/sm" as="span" color="secondary" key={v}>{v}%</Text>); })()}
            </Flex>
          </div>
          <Flex justify="space-between" className={styles.chartXAxis}>
            {chartDays.map((d) => (<Text variant="caption/sm" as="span" color="secondary" key={d}>{d}</Text>))}
          </Flex>
          <Flex align="center" justify="center" gap={4} className={styles.chartLegend}>
            <ColorDot color="var(--color-primary)" size="xs" />
            <Text variant="caption/sm" as="span" color="secondary">{fmtDay(dateStart)} - {fmtDay(dateEnd)}</Text>
          </Flex>
        </Card>

        {/* Revenue card */}
        <Card>
          <Flex align="center" justify="space-between" className={styles.cardHeaderWrap}>
            <Text variant="display/sm" as="h3" color="text" className={styles.cardTitle}>Revenue</Text>
          </Flex>
          <Text variant="caption/md" color="secondary" mb={8}>Total invoiced revenue from appointments and support activities (tax exclusive)</Text>
          <Text variant="metric/lg" as="p" color="text" mb={4}>${totalRevenue >= 1000 ? (totalRevenue / 1000).toFixed(2) + "K" : totalRevenue.toFixed(2)}</Text>
          <Text variant="caption/md" color="secondary" mb={16}>{fmtDay(dateStart)} - {fmtDay(dateEnd)}</Text>
          <div className={styles.chartContainer}>
            <Flex vertical justify="space-between" className={styles.barChartYAxis}>
              {(() => { const max = Math.ceil(Math.max(...revenueData) / 50) * 50; return [max, Math.round(max * 0.67), Math.round(max * 0.33), 0].map((v) => <span key={v}>${v}</span>); })()}
            </Flex>
            <Flex align="flex-end" gap={8} className={styles.barChartArea}>
              {revenueData.map((val, i) => (
                <Flex key={i} vertical align="center" gap={2} className={styles.barChartBarCol}>
                  {/* ds-exempt: dynamic bar height computed from data */}
                  <div
                    className={styles.barChartBar}
                    style={{ height: `${(val / (Math.ceil(Math.max(...revenueData) / 50) * 50 || 1)) * 100}%`, minHeight: val > 0 ? 2 : 0 }}
                  />
                </Flex>
              ))}
            </Flex>
          </div>
          <Flex justify="space-between" className={styles.barChartXAxis}>
            {chartDays.map((d) => (<span key={d}>{d}</span>))}
          </Flex>
          <Flex align="center" justify="center" gap={4} className={styles.barChartLegend}>
            <ColorDot color="var(--color-primary)" size="xs" />
            {fmtDay(dateStart)} - {fmtDay(dateEnd)}
          </Flex>
        </Card>
      </Grid>

      {/* Practitioners table */}
      <Card padding="none">
        <Flex align="center" justify="space-between" className={styles.tableHeader}>
          <div>
            <Text variant="heading/sm" as="h3" color="text">Practitioners</Text>
            <Text variant="caption/md" color="secondary">Breakdown of performance by individual practitioner</Text>
          </div>
        </Flex>
        <Table
          columns={columns}
          dataSource={sortedPractitioners}
          rowKey="name"
          pagination={false}
          onChange={(_, __, sorter) => {
            const s = Array.isArray(sorter) ? sorter[0] : sorter;
            if (s && s.columnKey) {
              handleSort(s.columnKey as SortKey);
            }
          }}
        />
      </Card>
    </>
  );
}
