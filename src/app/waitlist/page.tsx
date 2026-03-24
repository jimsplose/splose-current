"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import nextDynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const MapView = nextDynamic(() => import("@/components/MapView"), { ssr: false });
import type { MapMarker } from "@/components/MapView";
import {
  Plus,
  Filter,
  List,
  Map as MapIcon,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
} from "lucide-react";
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
    service: "First Appointment ()",
    status: "active" as const,
  },
  {
    tags: ["---"],
    client: "New client",
    dob: "---",
    address: "Adelaide 5000",
    dateAdded: "5 Mar 2026 (6 days)",
    service: "Copy of ...",
    status: "active" as const,
  },
  {
    tags: ["Admin to review"],
    client: "test test",
    dob: "---",
    address: "---",
    dateAdded: "19 Feb 2026 (20 days)",
    service: "1:1 Consultation",
    status: "active" as const,
  },
  {
    tags: ["---"],
    client: "Ella Thompson",
    dob: "18 Feb 2015",
    address: "Adelaide 5000",
    dateAdded: "3 Feb 2026 (36 days)",
    service: "First Appointment",
    status: "active" as const,
  },
  {
    tags: ["Admin to review"],
    client: "splose Ruvi",
    dob: "2 Feb 1998",
    address: "---",
    dateAdded: "19 Jan 2026 (51 days)",
    service: "1:1 Consultation",
    status: "active" as const,
  },
  {
    tags: ["Admin to review"],
    client: "test ruvi",
    dob: "2 Apr 2021",
    address: "---",
    dateAdded: "19 Jan 2026 (51 days)",
    service: "1:1 Consultation",
    status: "active" as const,
  },
  {
    tags: ["Low"],
    client: "Jenny Jenkins",
    dob: "2 Feb 2002",
    address: "---",
    dateAdded: "29 Dec 2025 (72 days)",
    service: "First Appointment",
    status: "active" as const,
  },
  {
    tags: ["Admin to review", "Medium", "NDIS referral"],
    client: "Harry James",
    dob: "5 Jul 1985",
    address: "Adelaide 5000",
    dateAdded: "22 Dec 2025 (79 days)",
    service: "Back Re-Alignment",
    status: "active" as const,
  },
  {
    tags: ["---"],
    client: "Closed Client A",
    dob: "12 Jan 1990",
    address: "Melbourne 3000",
    dateAdded: "10 Nov 2025 (120 days)",
    service: "1:1 Consultation",
    status: "closed" as const,
  },
  {
    tags: ["Low"],
    client: "Closed Client B",
    dob: "5 May 1988",
    address: "---",
    dateAdded: "1 Oct 2025 (160 days)",
    service: "First Appointment",
    status: "closed" as const,
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
  const [mainTab, setMainTab] = useState<"screener" | "waitlist">("screener");
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

  // Dev Navigator: ?state= param wiring
  const searchParams = useSearchParams();
  const forcedState = searchParams.get("state");
  useEffect(() => {
    if (!forcedState) return;
    const actions: Record<string, () => void> = {
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
        <div className="p-4 sm:p-6">
          <PageHeader title="Screener">
            <Button variant="secondary" size="sm">
              <HelpCircle className="h-4 w-4" />
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
                <div className="flex items-center gap-1">
                  Tags
                  <Filter className="h-3 w-3 text-text-secondary" />
                </div>
              </Th>
              <Th>
                <div className="flex items-center gap-1">
                  Client
                  <svg className="h-3 w-3 text-text-secondary" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 0L9 5H3L6 0ZM6 12L3 7H9L6 12Z" />
                  </svg>
                </div>
              </Th>
              <Th>Date of birth</Th>
              <Th>Address</Th>
              <Th>Form</Th>
              <Th>Date submitted</Th>
              <Th align="right">Actions</Th>
            </TableHead>
            <TableBody>
              {screenerSubTab === "triage" ? (
                filteredScreener.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <EmptyState message="No screener entries found." className="py-8" />
                    </td>
                  </tr>
                ) : (
                  filteredScreener.map((row, idx) => (
                    <Tr key={idx}>
                      <Td>
                        <div className="flex items-center gap-1">
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
                            <ThumbsUp className="h-3 w-3" />
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
                            <ThumbsDown className="h-3 w-3" />
                            <span>No</span>
                          </Button>
                        </div>
                      </Td>
                      <Td className="text-text-secondary">{row.tags}</Td>
                      <Td className="text-primary">{row.client}</Td>
                      <Td className="text-text-secondary">{row.dob}</Td>
                      <Td className="text-text-secondary">{row.address}</Td>
                      <Td className="text-primary">{row.form}</Td>
                      <Td className="text-text-secondary">
                        <div className="flex items-center gap-2">
                          {row.dateSubmitted}
                          {row.archived && <Badge variant="red">Archived</Badge>}
                        </div>
                      </Td>
                      <Td align="right">
                        <Button variant="ghost" size="sm" className="!px-1.5 !py-1">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </Td>
                    </Tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan={8}>
                    <EmptyState message="No rejected entries." className="py-8" />
                  </td>
                </tr>
              )}
            </TableBody>
          </DataTable>
        </div>
      )}

      {/* ===== WAITLIST TAB ===== */}
      {mainTab === "waitlist" && (
        <div className="p-4 sm:p-6">
          <PageHeader title="Waitlist">
            <Button variant="secondary" size="sm">
              <Filter className="h-4 w-4" />
              Reset all filters
            </Button>
            <Button variant="secondary" size="sm">
              <HelpCircle className="h-4 w-4" />
              Learn
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
                  <List className="h-4 w-4" />
                  List
                </>
              )}
            </Button>
            <Link href="/waitlist/new">
              <Button variant="secondary" size="md">
                <Plus className="h-4 w-4" />
                Add to waitlist
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
                    <div className="flex items-center gap-1">
                      Tags
                      <Filter className="h-3 w-3 text-text-secondary" />
                    </div>
                  </Th>
                  <Th>Client</Th>
                  <Th>Date of birth</Th>
                  <Th>Address</Th>
                  <Th>Date added</Th>
                  <Th>Service</Th>
                  <Th align="right">Actions</Th>
                </TableHead>
                <TableBody>
                  {filteredWaitlist.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <EmptyState message={`No ${waitlistSubTab} entries found.`} className="py-8" />
                      </td>
                    </tr>
                  ) : (
                    filteredWaitlist.map((row, idx) => (
                      <Tr key={idx}>
                        <Td>
                          <div className="flex flex-wrap gap-1">
                            {row.tags.map((tag) =>
                              tag === "---" ? (
                                <span key={tag} className="text-body-md text-text-secondary">
                                  ---
                                </span>
                              ) : (
                                <Badge key={tag} variant={tagBadgeVariant[tag] || "gray"} className="rounded">
                                  {tag}
                                </Badge>
                              ),
                            )}
                          </div>
                        </Td>
                        <Td className="text-primary">{row.client}</Td>
                        <Td className="text-text-secondary">{row.dob}</Td>
                        <Td className="text-text-secondary">{row.address}</Td>
                        <Td className="text-text-secondary">{row.dateAdded}</Td>
                        <Td className="text-text-secondary">{row.service}</Td>
                        <Td align="right">
                          <Button variant="ghost" size="sm" className="!px-1.5 !py-1">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </Td>
                      </Tr>
                    ))
                  )}
                </TableBody>
              </DataTable>
              <Pagination currentPage={1} totalPages={1} totalItems={filteredWaitlist.length} itemsPerPage={10} />
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
