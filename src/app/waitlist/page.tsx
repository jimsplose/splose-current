"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import nextDynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const MapView = nextDynamic(() => import("@/components/MapView"), { ssr: false });
import type { MapMarker } from "@/components/MapView";
import {
  PlusOutlined,
  FilterOutlined,
  UnorderedListOutlined,
  QuestionCircleOutlined,
  LikeOutlined,
  DislikeOutlined,
  MoreOutlined,
  CloseOutlined,
  ColumnWidthOutlined,
} from "@ant-design/icons";
// Inline SVG icons for time-of-day indicators (no AntD equivalents)
const Sun = ({ style, className }: { style?: React.CSSProperties; className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} style={{ width: 16, height: 16, ...style }}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const Moon = ({ style, className }: { style?: React.CSSProperties; className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} style={{ width: 16, height: 16, ...style }}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const SunMedium = ({ style, className }: { style?: React.CSSProperties; className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} style={{ width: 16, height: 16, ...style }}><circle cx="12" cy="12" r="4"/><path d="M12 3v1"/><path d="M12 20v1"/><path d="M3 12h1"/><path d="M20 12h1"/><path d="m18.364 5.636-.707.707"/><path d="m6.343 17.657-.707.707"/><path d="m5.636 5.636.707.707"/><path d="m17.657 17.657.707.707"/></svg>;
const MapIcon = ({ style, className }: { style?: React.CSSProperties; className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} style={{ width: 16, height: 16, ...style }}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
import { Flex } from "antd";
import {
  Button,
  PageHeader,
  SearchBar,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
  Pagination,
  Badge,
  Tab,
  EmptyState,
  Modal,
  FormSelect,
  FormInput,
  FormTextarea,
} from "@/components/ds";

export const dynamic = "force-dynamic";

const screenerData = [
  {
    triage: { yes: false, no: false },
    tags: "---",
    client: "DDDDDDD Hun",
    dob: "---",
    address: "---",
    form: "Test form saved in A jr",
    dateSubmitted: "6 Mar 2026 (5 days)",
    archived: false,
  },
  {
    triage: { yes: false, no: false },
    tags: "---",
    client: "Hao Wang",
    dob: "---",
    address: "---",
    form: "Test EMB",
    dateSubmitted: "25 Feb 2026 (14 days)",
    archived: false,
  },
  {
    triage: { yes: false, no: false },
    tags: "---",
    client: "Hao Wang",
    dob: "---",
    address: "---",
    form: "Test EMB",
    dateSubmitted: "25 Feb 2026 (14 days)",
    archived: false,
  },
  {
    triage: { yes: false, no: false },
    tags: "---",
    client: "de qwe",
    dob: "---",
    address: "---",
    form: "Untitled form",
    dateSubmitted: "19 Jan 2026 (51 days)",
    archived: false,
  },
  {
    triage: { yes: false, no: false },
    tags: "---",
    client: "hello qqq",
    dob: "---",
    address: "---",
    form: "Untitled form",
    dateSubmitted: "19 Jan 2026 (51 days)",
    archived: false,
  },
  {
    triage: { yes: false, no: false },
    tags: "---",
    client: "Delete Test embeddable",
    dob: "---",
    address: "---",
    form: "Test Intake",
    dateSubmitted: "9 Dec 2025 (92 days)",
    archived: false,
  },
  {
    triage: { yes: false, no: false },
    tags: "---",
    client: "j jjj",
    dob: "---",
    address: "---",
    form: "Untitled form",
    dateSubmitted: "3 Dec 2025 (98 days)",
    archived: false,
  },
  {
    triage: { yes: false, no: false },
    tags: "---",
    client: "test embeddable scott",
    dob: "---",
    address: "---",
    form: "Untitled form",
    dateSubmitted: "3 Dec 2025 (98 days)",
    archived: false,
  },
  {
    triage: { yes: false, no: false },
    tags: "---",
    client: "ee ee",
    dob: "---",
    address: "---",
    form: "Untitled form",
    dateSubmitted: "1 Dec 2025 (100 days)",
    archived: false,
  },
  {
    triage: { yes: false, no: false },
    tags: "---",
    client: "Test Ruvi Emb",
    dob: "---",
    address: "---",
    form: "Untitled form",
    dateSubmitted: "18 Nov 2025 (113 days)",
    archived: true,
  },
];

const waitlistData = [
  {
    tags: ["To assign a unique ID"],
    client: "kai win",
    dob: "1 Mar 2022",
    address: "---",
    dateAdded: "5 Mar 2026 (6 days)",
    dateAddedRaw: "2026-03-05",
    service: "First Appointment ()",
    services: ["First Appointment ()"],
    status: "active" as const,
    location: "",
    practitioner: "jim",
    preferredDays: [false, true, false, true, false, true, false] as boolean[],
    preferredTime: { morning: true, afternoon: false, evening: false },
    note: "",
  },
  {
    tags: ["---"],
    client: "New client",
    dob: "---",
    address: "Adelaide 5000",
    dateAdded: "5 Mar 2026 (6 days)",
    dateAddedRaw: "2026-03-05",
    service: "Copy of ...",
    services: ["Copy of ..."],
    status: "active" as const,
    location: "",
    practitioner: "",
    preferredDays: [false, false, false, false, false, false, false] as boolean[],
    preferredTime: { morning: false, afternoon: false, evening: false },
    note: "",
  },
  {
    tags: ["Admin to review"],
    client: "test test",
    dob: "---",
    address: "---",
    dateAdded: "19 Feb 2026 (20 days)",
    dateAddedRaw: "2026-02-19",
    service: "1:1 Consultation",
    services: ["299dsdds3234 1:1 Consultation (1:1 Con...)"],
    status: "active" as const,
    location: "",
    practitioner: "jim",
    preferredDays: [false, true, true, true, true, true, false] as boolean[],
    preferredTime: { morning: true, afternoon: true, evening: false },
    note: "Prefers morning sessions. Contact via email.",
  },
  {
    tags: ["---"],
    client: "Ella Thompson",
    dob: "18 Feb 2015",
    address: "Adelaide 5000",
    dateAdded: "3 Feb 2026 (36 days)",
    dateAddedRaw: "2026-02-03",
    service: "First Appointment",
    services: ["First Appointment"],
    status: "active" as const,
    location: "adelaide",
    practitioner: "jim",
    preferredDays: [false, false, false, true, false, false, false] as boolean[],
    preferredTime: { morning: false, afternoon: true, evening: false },
    note: "",
  },
  {
    tags: ["Admin to review"],
    client: "splose Ruvi",
    dob: "2 Feb 1998",
    address: "---",
    dateAdded: "19 Jan 2026 (51 days)",
    dateAddedRaw: "2026-01-19",
    service: "1:1 Consultation",
    services: ["1:1 Consultation"],
    status: "active" as const,
    location: "",
    practitioner: "",
    preferredDays: [false, false, false, false, false, false, false] as boolean[],
    preferredTime: { morning: false, afternoon: false, evening: false },
    note: "",
  },
  {
    tags: ["Admin to review"],
    client: "test ruvi",
    dob: "2 Apr 2021",
    address: "---",
    dateAdded: "19 Jan 2026 (51 days)",
    dateAddedRaw: "2026-01-19",
    service: "1:1 Consultation",
    services: ["1:1 Consultation"],
    status: "active" as const,
    location: "",
    practitioner: "",
    preferredDays: [false, false, false, false, false, false, false] as boolean[],
    preferredTime: { morning: false, afternoon: false, evening: false },
    note: "",
  },
  {
    tags: ["Low"],
    client: "Jenny Jenkins",
    dob: "2 Feb 2002",
    address: "---",
    dateAdded: "29 Dec 2025 (72 days)",
    dateAddedRaw: "2025-12-29",
    service: "First Appointment",
    services: ["First Appointment"],
    status: "active" as const,
    location: "",
    practitioner: "jim",
    preferredDays: [false, false, true, false, true, false, false] as boolean[],
    preferredTime: { morning: true, afternoon: false, evening: false },
    note: "",
  },
  {
    tags: ["Admin to review", "Medium", "NDIS referral"],
    client: "Harry James",
    dob: "5 Jul 1985",
    address: "Adelaide 5000",
    dateAdded: "22 Dec 2025 (79 days)",
    dateAddedRaw: "2025-12-22",
    service: "Back Re-Alignment",
    services: ["Back Re-Alignment"],
    status: "active" as const,
    location: "adelaide",
    practitioner: "jim",
    preferredDays: [false, true, false, false, false, true, false] as boolean[],
    preferredTime: { morning: false, afternoon: true, evening: true },
    note: "NDIS funded. Requires plan manager approval.",
  },
  {
    tags: ["---"],
    client: "Closed Client A",
    dob: "12 Jan 1990",
    address: "Melbourne 3000",
    dateAdded: "10 Nov 2025 (120 days)",
    dateAddedRaw: "2025-11-10",
    service: "1:1 Consultation",
    services: ["1:1 Consultation"],
    status: "closed" as const,
    location: "",
    practitioner: "",
    preferredDays: [false, false, false, false, false, false, false] as boolean[],
    preferredTime: { morning: false, afternoon: false, evening: false },
    note: "",
  },
  {
    tags: ["Low"],
    client: "Closed Client B",
    dob: "5 May 1988",
    address: "---",
    dateAdded: "1 Oct 2025 (160 days)",
    dateAddedRaw: "2025-10-01",
    service: "First Appointment",
    services: ["First Appointment"],
    status: "closed" as const,
    location: "",
    practitioner: "",
    preferredDays: [false, false, false, false, false, false, false] as boolean[],
    preferredTime: { morning: false, afternoon: false, evening: false },
    note: "",
  },
];

type TagBadgeVariant = "green" | "red" | "blue" | "yellow" | "orange" | "gray" | "purple";

const tagBadgeVariant: Record<string, TagBadgeVariant> = {
  "To assign a unique ID": "red",
  "Admin to review": "yellow",
  Low: "green",
  Medium: "orange",
  "NDIS referral": "purple",
};


export default function WaitlistPage() {
  return (
    <Suspense>
      <WaitlistPageInner />
    </Suspense>
  );
}

function WaitlistPageInner() {
  const _initState = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("state") : null;
  const [mainTab, setMainTab] = useState<"screener" | "waitlist">(
    _initState === "default" || _initState === "waitlist" || _initState?.startsWith("waitlist-")
      ? "waitlist" : "screener"
  );
  const [screenerSubTab, setScreenerSubTab] = useState<"triage" | "rejected">("triage");
  const [waitlistSubTab, setWaitlistSubTab] = useState<"active" | "closed">("active");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [triageState, setTriageState] = useState<Record<number, "yes" | "no" | null>>(() => {
    const initial: Record<number, "yes" | "no" | null> = {};
    screenerData.forEach((_, i) => {
      initial[i] = null;
    });
    return initial;
  });
  const [screenerSearch, setScreenerSearch] = useState("");
  const [waitlistSearch, setWaitlistSearch] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingClient, setEditingClient] = useState<(typeof waitlistData)[number] | null>(null);

  // Update modal form state
  const [modalLocation, setModalLocation] = useState("");
  const [modalPractitioner, setModalPractitioner] = useState("");
  const [modalClient, setModalClient] = useState("");
  const [modalDateAdded, setModalDateAdded] = useState("");
  const [modalServices, setModalServices] = useState<string[]>([]);
  const [modalServiceSelect, setModalServiceSelect] = useState("");
  const [modalPreferredDays, setModalPreferredDays] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const [modalPreferredTime, setModalPreferredTime] = useState({ morning: false, afternoon: false, evening: false });
  const [modalNote, setModalNote] = useState("");
  const [modalTags, setModalTags] = useState<string[]>([]);
  const [modalTagSelect, setModalTagSelect] = useState("");

  const openUpdateModal = (entry: (typeof waitlistData)[number]) => {
    setEditingClient(entry);
    setModalLocation(entry.location);
    setModalPractitioner(entry.practitioner);
    setModalClient(entry.client);
    setModalDateAdded(entry.dateAddedRaw);
    setModalServices([...entry.services]);
    setModalServiceSelect("");
    setModalPreferredDays([...entry.preferredDays]);
    setModalPreferredTime({ ...entry.preferredTime });
    setModalNote(entry.note);
    setModalTags(entry.tags.filter((t) => t !== "---"));
    setModalTagSelect("");
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setEditingClient(null);
  };

  const addService = () => {
    if (modalServiceSelect && !modalServices.includes(modalServiceSelect)) {
      setModalServices([...modalServices, modalServiceSelect]);
      setModalServiceSelect("");
    }
  };

  const removeService = (service: string) => {
    setModalServices(modalServices.filter((s) => s !== service));
  };

  const addTag = () => {
    if (modalTagSelect && !modalTags.includes(modalTagSelect)) {
      setModalTags([...modalTags, modalTagSelect]);
      setModalTagSelect("");
    }
  };

  const removeTag = (tag: string) => {
    setModalTags(modalTags.filter((t) => t !== tag));
  };

  const toggleDay = (index: number) => {
    const updated = [...modalPreferredDays];
    updated[index] = !updated[index];
    setModalPreferredDays(updated);
  };

  const toggleTime = (key: "morning" | "afternoon" | "evening") => {
    setModalPreferredTime((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Dev Navigator: ?state= param wiring
  const searchParams = useSearchParams();
  const forcedState = searchParams.get("state");
  useEffect(() => {
    if (!forcedState) return;
    const actions: Record<string, () => void> = {
      default: () => {
        setMainTab("waitlist");
        setWaitlistSubTab("active");
        setViewMode("list");
      },
      waitlist: () => {
        setMainTab("waitlist");
        setWaitlistSubTab("active");
        setViewMode("list");
      },
      "waitlist-active": () => {
        setMainTab("waitlist");
        setWaitlistSubTab("active");
        setViewMode("list");
      },
      "waitlist-closed": () => {
        setMainTab("waitlist");
        setWaitlistSubTab("closed");
        setViewMode("list");
      },
      "screener-triage": () => {
        setMainTab("screener");
        setScreenerSubTab("triage");
      },
      "screener-rejected": () => {
        setMainTab("screener");
        setScreenerSubTab("rejected");
      },
      "waitlist-map": () => {
        setMainTab("waitlist");
        setViewMode("map");
      },
    };
    actions[forcedState]?.();
  }, [forcedState]);

  const handleTriage = (index: number, value: "yes" | "no") => {
    setTriageState((prev) => ({
      ...prev,
      [index]: prev[index] === value ? null : value,
    }));
  };

  const filteredWaitlist = waitlistData.filter((row) => {
    if (row.status !== waitlistSubTab) return false;
    if (waitlistSearch && !row.client.toLowerCase().includes(waitlistSearch.toLowerCase())) return false;
    return true;
  });

  const filteredScreener = screenerData.filter((row) => {
    if (screenerSearch && !row.client.toLowerCase().includes(screenerSearch.toLowerCase())) return false;
    return true;
  });

  const [screenerPage, setScreenerPage] = useState(1);
  const [waitlistPage, setWaitlistPage] = useState(1);
  const pageSize = 10;
  const screenerTotalPages = Math.ceil(filteredScreener.length / pageSize);
  const pagedScreener = filteredScreener.slice((screenerPage - 1) * pageSize, screenerPage * pageSize);
  const waitlistTotalPages = Math.ceil(filteredWaitlist.length / pageSize);
  const pagedWaitlist = filteredWaitlist.slice((waitlistPage - 1) * pageSize, waitlistPage * pageSize);

  // Marker colors cycle for map pins
  const markerColors = ["#7c3aed", "#2563eb", "#dc2626", "#059669", "#d97706", "#ec4899"];

  // Lat/lng offsets for each active waitlist client (simulated positions around Adelaide)
  const latLngOffsets: [number, number][] = [
    [-34.925, 138.600],
    [-34.932, 138.595],
    [-34.920, 138.590],
    [-34.935, 138.610],
    [-34.928, 138.615],
    [-34.940, 138.605],
    [-34.918, 138.608],
    [-34.930, 138.588],
  ];

  const mapMarkers: MapMarker[] = useMemo(() => {
    const activeEntries = waitlistData.filter((w) => w.status === "active");
    return activeEntries.map((entry, i) => ({
      name: entry.client,
      lat: latLngOffsets[i % latLngOffsets.length][0],
      lng: latLngOffsets[i % latLngOffsets.length][1],
      color: markerColors[i % markerColors.length],
      dob: entry.dob,
      address: entry.address,
      service: entry.service,
      dateAdded: entry.dateAdded,
      tags: entry.tags,
    }));
  }, []);

  return (
    <div>
      {/* Main tabs: Screener / Waitlist */}
      <Tab
        items={[
          { label: "Screener", value: "screener" },
          { label: "Waitlist", value: "waitlist" },
        ]}
        value={mainTab}
        onChange={(val) => setMainTab(val as "screener" | "waitlist")}
        className="px-6 pt-2"
      />

      {/* ===== SCREENER TAB ===== */}
      {mainTab === "screener" && (
        <div style={{ padding: '10px 22.5px' }}>
          <PageHeader title="Screener">
            <Button variant="secondary" size="sm">
              <QuestionCircleOutlined style={{ fontSize: 16 }} />
              Learn
            </Button>
          </PageHeader>

          {/* Search */}
          <SearchBar placeholder="Search for client name" onSearch={(query) => setScreenerSearch(query)} />

          {/* Triage / Rejected sub-tabs */}
          <Tab
            items={[
              { label: "Triage", value: "triage" },
              { label: "Rejected", value: "rejected" },
            ]}
            value={screenerSubTab}
            onChange={(val) => setScreenerSubTab(val as "triage" | "rejected")}
            className="mb-4"
          />

          {/* Screener table */}
          <DataTable minWidth="800px">
            <TableHead>
              <Th>Triage</Th>
              <Th>
                <Flex align="center" gap={4}>
                  Tags
                  <FilterOutlined style={{ fontSize: 12, color: 'var(--color-text-secondary)' }} />
                </Flex>
              </Th>
              <Th>
                <Flex align="center" gap={4}>
                  Client
                  <svg className="h-3 w-3" style={{ color: 'var(--color-text-secondary)' }} viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 0L9 5H3L6 0ZM6 12L3 7H9L6 12Z" />
                  </svg>
                </Flex>
              </Th>
              <Th>Date of birth</Th>
              <Th>Address</Th>
              <Th>Form</Th>
              <Th>Date submitted</Th>
              <Th align="right">Actions</Th>
            </TableHead>
            <TableBody>
              {screenerSubTab === "triage" ? (
                pagedScreener.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <EmptyState message="No screener entries found." style={{ padding: '32px 0' }} />
                    </td>
                  </tr>
                ) : (
                  pagedScreener.map((row, idx) => (
                    <Tr key={idx}>
                      <Td>
                        <Flex align="center" gap={4}>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleTriage(idx, "yes")}
                            className={`!gap-0.5 !rounded !px-2 !py-1 text-body-sm ${
                              triageState[idx] === "yes"
                                ? "!border-green-300 !bg-green-50 !text-green-700"
                                : "!text-text-secondary"
                            }`}
                          >
                            <LikeOutlined style={{ fontSize: 12 }} />
                            <span>Yes</span>
                          </Button>
                          <Button
                            variant={triageState[idx] === "no" ? "danger" : "secondary"}
                            size="sm"
                            onClick={() => handleTriage(idx, "no")}
                            className={`!gap-0.5 !rounded !px-2 !py-1 text-body-sm ${
                              triageState[idx] === "no"
                                ? "!bg-red-50"
                                : "!text-text-secondary"
                            }`}
                          >
                            <DislikeOutlined style={{ fontSize: 12 }} />
                            <span>No</span>
                          </Button>
                        </Flex>
                      </Td>
                      <Td style={{ color: 'var(--color-text-secondary)' }}>{row.tags}</Td>
                      <Td style={{ color: 'var(--color-primary)' }}>{row.client}</Td>
                      <Td style={{ color: 'var(--color-text-secondary)' }}>{row.dob}</Td>
                      <Td style={{ color: 'var(--color-text-secondary)' }}>{row.address}</Td>
                      <Td style={{ color: 'var(--color-primary)' }}>{row.form}</Td>
                      <Td style={{ color: 'var(--color-text-secondary)' }}>
                        <Flex align="center" gap={8}>
                          {row.dateSubmitted}
                          {row.archived && <Badge variant="red">Archived</Badge>}
                        </Flex>
                      </Td>
                      <Td align="right">
                        <Button variant="ghost" size="sm" className="!px-1.5 !py-1">
                          <MoreOutlined style={{ fontSize: 16 }} />
                        </Button>
                      </Td>
                    </Tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan={8}>
                    <EmptyState message="No rejected entries." style={{ padding: '32px 0' }} />
                  </td>
                </tr>
              )}
            </TableBody>
          </DataTable>
          <Pagination currentPage={screenerPage} totalPages={screenerTotalPages} totalItems={filteredScreener.length} itemsPerPage={pageSize} onPageChange={setScreenerPage} />
        </div>
      )}

      {/* ===== UPDATE CLIENT MODAL ===== */}
      <Modal
        open={showUpdateModal}
        onClose={closeUpdateModal}
        title="Update client"
        maxWidth="md"
        footer={
          <>
            <Button variant="secondary" size="md" onClick={closeUpdateModal}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={closeUpdateModal}>
              Update
            </Button>
          </>
        }
      >
        <Flex vertical gap={16}>
          {/* Location */}
          <FormSelect
            label="Location"
            value={modalLocation}
            onChange={setModalLocation}
            options={[
              { value: "", label: "Any location" },
              { value: "adelaide", label: "Adelaide" },
              { value: "melbourne", label: "Melbourne" },
              { value: "sydney", label: "Sydney" },
            ]}
          />

          {/* Practitioner */}
          <FormSelect
            label="Practitioner"
            value={modalPractitioner}
            onChange={setModalPractitioner}
            options={[
              { value: "", label: "Any practitioner" },
              { value: "jim", label: "Jim Yencken" },
              { value: "sarah", label: "Sarah Mitchell" },
              { value: "alex", label: "Alex Chen" },
            ]}
          />

          {/* Client (required) */}
          <FormSelect
            label="Client *"
            value={modalClient}
            onChange={setModalClient}
            options={[
              { value: "", label: "Select client" },
              ...waitlistData.map((w) => ({ value: w.client, label: w.client })),
            ]}
          />

          {/* Date added (required) */}
          <FormInput
            label="Date added *"
            type="date"
            value={modalDateAdded}
            onChange={(e) => setModalDateAdded(e.target.value)}
          />

          {/* Service (required) — chips + select to add */}
          <div>
            <label className="mb-1 block text-label-lg" style={{ color: 'var(--color-text-secondary)' }}>Service *</label>
            {modalServices.length > 0 && (
              <Flex wrap gap={6} style={{ marginBottom: 8 }}>
                {modalServices.map((service) => (
                  <Badge key={service} variant="blue" className="rounded-lg !py-1 !px-2.5 gap-1">
                    <span style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{service}</span>
                    <button
                      type="button"
                      onClick={() => removeService(service)}
                      style={{ marginLeft: 2, borderRadius: '50%', padding: 2 }}
                      className="hover:bg-blue-200"
                    >
                      <CloseOutlined style={{ fontSize: 12 }} />
                    </button>
                  </Badge>
                ))}
              </Flex>
            )}
            <Flex gap={8}>
              <FormSelect
                value={modalServiceSelect}
                onChange={setModalServiceSelect}
                options={[
                  { value: "", label: "Add a service..." },
                  { value: "1:1 Consultation", label: "1:1 Consultation" },
                  { value: "First Appointment", label: "First Appointment" },
                  { value: "Back Re-Alignment", label: "Back Re-Alignment" },
                  { value: "299dsdds3234 1:1 Consultation (1:1 Con...)", label: "299dsdds3234 1:1 Consultation (1:1 Con...)" },
                  { value: "Group Session", label: "Group Session" },
                ]}
              />
              <Button variant="secondary" size="sm" onClick={addService} style={{ flexShrink: 0 }}>
                <PlusOutlined style={{ fontSize: 16 }} />
              </Button>
            </Flex>
          </div>

          {/* Preferred days */}
          <div>
            <label className="mb-1.5 block text-label-lg" style={{ color: 'var(--color-text-secondary)' }}>Preferred days</label>
            <Flex gap={6}>
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className="text-label-md"
                  style={{
                    display: 'flex',
                    height: 36,
                    width: 36,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    transition: 'background-color 0.2s, color 0.2s',
                    ...(modalPreferredDays[i]
                      ? { backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none' }
                      : { border: '1px solid var(--color-border)', backgroundColor: '#fff', color: 'var(--color-text-secondary)' }),
                  }}
                >
                  {day}
                </button>
              ))}
            </Flex>
          </div>

          {/* Preferred time */}
          <div>
            <label className="mb-1.5 block text-label-lg" style={{ color: 'var(--color-text-secondary)' }}>Preferred time</label>
            <Flex gap={8}>
              <button
                type="button"
                onClick={() => toggleTime("morning")}
                className="text-label-md"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  borderRadius: 9999,
                  padding: '6px 12px',
                  transition: 'background-color 0.2s, color 0.2s',
                  ...(modalPreferredTime.morning
                    ? { backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none' }
                    : { border: '1px solid var(--color-border)', backgroundColor: '#fff', color: 'var(--color-text-secondary)' }),
                }}
              >
                <Sun className="h-4 w-4" />
                Morning
              </button>
              <button
                type="button"
                onClick={() => toggleTime("afternoon")}
                className="text-label-md"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  borderRadius: 9999,
                  padding: '6px 12px',
                  transition: 'background-color 0.2s, color 0.2s',
                  ...(modalPreferredTime.afternoon
                    ? { backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none' }
                    : { border: '1px solid var(--color-border)', backgroundColor: '#fff', color: 'var(--color-text-secondary)' }),
                }}
              >
                <SunMedium className="h-4 w-4" />
                Afternoon
              </button>
              <button
                type="button"
                onClick={() => toggleTime("evening")}
                className="text-label-md"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  borderRadius: 9999,
                  padding: '6px 12px',
                  transition: 'background-color 0.2s, color 0.2s',
                  ...(modalPreferredTime.evening
                    ? { backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none' }
                    : { border: '1px solid var(--color-border)', backgroundColor: '#fff', color: 'var(--color-text-secondary)' }),
                }}
              >
                <Moon className="h-4 w-4" />
                Evening
              </button>
            </Flex>
          </div>

          {/* Note */}
          <div>
            <FormTextarea
              label="Note"
              value={modalNote}
              onChange={(e) => {
                if (e.target.value.length <= 500) setModalNote(e.target.value);
              }}
              rows={3}
              placeholder="Add a note..."
            />
            <p className="text-caption-md" style={{ marginTop: 4, textAlign: 'right', color: 'var(--color-text-secondary)' }}>
              {modalNote.length} / 500
            </p>
          </div>

          {/* Waitlist tags */}
          <div>
            <label className="mb-1 block text-label-lg" style={{ color: 'var(--color-text-secondary)' }}>Waitlist tags</label>
            {modalTags.length > 0 && (
              <Flex wrap gap={6} style={{ marginBottom: 8 }}>
                {modalTags.map((tag) => (
                  <Badge key={tag} variant={tagBadgeVariant[tag] || "gray"} className="rounded-lg !py-1 !px-2.5 gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      style={{ marginLeft: 2, borderRadius: '50%', padding: 2 }}
                      className="hover:bg-black/10"
                    >
                      <CloseOutlined style={{ fontSize: 12 }} />
                    </button>
                  </Badge>
                ))}
              </Flex>
            )}
            <Flex gap={8}>
              <FormSelect
                value={modalTagSelect}
                onChange={setModalTagSelect}
                options={[
                  { value: "", label: "Add a tag..." },
                  { value: "Admin to review", label: "Admin to review" },
                  { value: "Low", label: "Low" },
                  { value: "Medium", label: "Medium" },
                  { value: "NDIS referral", label: "NDIS referral" },
                  { value: "To assign a unique ID", label: "To assign a unique ID" },
                ]}
              />
              <Button variant="secondary" size="sm" onClick={addTag} style={{ flexShrink: 0 }}>
                <PlusOutlined style={{ fontSize: 16 }} />
              </Button>
            </Flex>
          </div>
        </Flex>
      </Modal>

      {/* ===== WAITLIST TAB ===== */}
      {mainTab === "waitlist" && (
        <div style={{ padding: '10px 22.5px' }}>
          <PageHeader title="Waitlist">
            <Button variant="secondary" size="sm">
              <FilterOutlined style={{ fontSize: 16 }} />
              Reset all filters
            </Button>
            <Button variant="secondary" size="sm">
              <QuestionCircleOutlined style={{ fontSize: 16 }} />
              Learn
            </Button>
            <Button variant="secondary" size="sm">
              <ColumnWidthOutlined style={{ fontSize: 16 }} />
              Show/hide fields
            </Button>
            {/* Map / List toggle */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
              className={
                viewMode === "map"
                  ? "border-primary bg-primary/5 text-primary"
                  : ""
              }
            >
              {viewMode === "list" ? (
                <>
                  <MapIcon className="h-4 w-4" />
                  Map
                </>
              ) : (
                <>
                  <UnorderedListOutlined style={{ fontSize: 16 }} />
                  List
                </>
              )}
            </Button>
            <Link href="/waitlist/new">
              <Button variant="secondary" size="md">
                <PlusOutlined style={{ fontSize: 16 }} />
                Add client
              </Button>
            </Link>
          </PageHeader>

          {viewMode === "list" ? (
            <>
              {/* Active / Closed tabs */}
              <Tab
                items={[
                  { label: "Active", value: "active" },
                  { label: "Closed", value: "closed" },
                ]}
                value={waitlistSubTab}
                onChange={(val) => setWaitlistSubTab(val as "active" | "closed")}
                className="mb-4"
              />

              {/* Search */}
              <SearchBar placeholder="Search for client name" onSearch={(query) => setWaitlistSearch(query)} />

              {/* Waitlist table */}
              <DataTable minWidth="700px">
                <TableHead>
                  <Th>
                    <Flex align="center" gap={4}>
                      Tags
                      <FilterOutlined style={{ fontSize: 12, color: 'var(--color-text-secondary)' }} />
                    </Flex>
                  </Th>
                  <Th>Client</Th>
                  <Th>Date of birth</Th>
                  <Th>Address</Th>
                  <Th>Date added</Th>
                  <Th align="right">Actions</Th>
                </TableHead>
                <TableBody>
                  {pagedWaitlist.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <EmptyState message={`No ${waitlistSubTab} entries found.`} style={{ padding: '32px 0' }} />
                      </td>
                    </tr>
                  ) : (
                    pagedWaitlist.map((row, idx) => (
                      <Tr key={idx} onClick={() => openUpdateModal(row)} className="cursor-pointer">
                        <Td>
                          <Flex wrap gap={4}>
                            {row.tags.map((tag) =>
                              tag === "---" ? (
                                <span key={tag} className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>
                                  ---
                                </span>
                              ) : (
                                <Badge key={tag} variant={tagBadgeVariant[tag] || "gray"} className="rounded">
                                  {tag}
                                </Badge>
                              ),
                            )}
                          </Flex>
                        </Td>
                        <Td style={{ color: 'var(--color-primary)' }}>{row.client}</Td>
                        <Td style={{ color: 'var(--color-text-secondary)' }}>{row.dob}</Td>
                        <Td style={{ color: 'var(--color-text-secondary)' }}>{row.address}</Td>
                        <Td style={{ color: 'var(--color-text-secondary)' }}>{row.dateAdded}</Td>
                        <Td align="right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="!px-1.5 !py-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              openUpdateModal(row);
                            }}
                          >
                            <MoreOutlined style={{ fontSize: 16 }} />
                          </Button>
                        </Td>
                      </Tr>
                    ))
                  )}
                </TableBody>
              </DataTable>
              <Pagination currentPage={waitlistPage} totalPages={waitlistTotalPages} totalItems={filteredWaitlist.length} itemsPerPage={pageSize} onPageChange={setWaitlistPage} />
            </>
          ) : (
            /* ===== MAP VIEW (Leaflet) ===== */
            <div
              className="overflow-hidden rounded-lg border border-border"
              style={{ height: "calc(100vh - 180px)" }}
            >
              <MapView markers={mapMarkers} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
