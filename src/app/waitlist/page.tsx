"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Filter,
  List,
  Map as MapIcon,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  MapPin,
} from "lucide-react";
import {
  Button,
  PageHeader,
  SearchBar,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  Pagination,
  Badge,
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

// Map pin locations (placeholder positions as percentages)
const mapPins = [
  { x: 15, y: 20, label: "Client A" },
  { x: 25, y: 45, label: "Client B" },
  { x: 40, y: 30, label: "Client C" },
  { x: 55, y: 55, label: "Client D" },
  { x: 70, y: 25, label: "Client E" },
  { x: 80, y: 60, label: "Client F" },
  { x: 35, y: 70, label: "Client G" },
  { x: 60, y: 40, label: "Client H" },
  { x: 10, y: 65, label: "Client I" },
  { x: 90, y: 35, label: "Client J" },
  { x: 48, y: 80, label: "Client K" },
  { x: 20, y: 85, label: "Client L" },
  { x: 75, y: 75, label: "Client M" },
  { x: 5, y: 40, label: "Client N" },
  { x: 65, y: 15, label: "Client O" },
];

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

  return (
    <div>
      {/* Main tabs: Screener / Waitlist */}
      <div className="flex items-center gap-4 border-b border-border px-6 pt-2">
        <button
          onClick={() => setMainTab("screener")}
          className={`border-b-2 px-1 pb-2 text-sm ${
            mainTab === "screener"
              ? "border-primary font-medium text-primary"
              : "border-transparent text-text-secondary hover:text-text"
          }`}
        >
          Screener
        </button>
        <button
          onClick={() => setMainTab("waitlist")}
          className={`border-b-2 px-1 pb-2 text-sm ${
            mainTab === "waitlist"
              ? "border-primary font-medium text-primary"
              : "border-transparent text-text-secondary hover:text-text"
          }`}
        >
          Waitlist
        </button>
      </div>

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
          <div className="mb-4 flex items-center gap-4">
            <button
              onClick={() => setScreenerSubTab("triage")}
              className={`border-b-2 pb-1 text-sm ${
                screenerSubTab === "triage"
                  ? "border-primary font-medium text-primary"
                  : "border-transparent text-text-secondary hover:text-text"
              }`}
            >
              Triage
            </button>
            <button
              onClick={() => setScreenerSubTab("rejected")}
              className={`border-b-2 pb-1 text-sm ${
                screenerSubTab === "rejected"
                  ? "border-primary font-medium text-primary"
                  : "border-transparent text-text-secondary hover:text-text"
              }`}
            >
              Rejected
            </button>
          </div>

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
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-text-secondary">
                      No screener entries found.
                    </td>
                  </tr>
                ) : (
                  filteredScreener.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <Td>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleTriage(idx, "yes")}
                            className={`!gap-0.5 !rounded !px-2 !py-1 !text-xs ${
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
                            className={`!gap-0.5 !rounded !px-2 !py-1 !text-xs ${
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
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-text-secondary">
                    No rejected entries.
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
            <button
              onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "map"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-white text-text hover:bg-gray-50"
              }`}
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
            </button>
            <Button variant="secondary" size="md">
              <Plus className="h-4 w-4" />
              Add client
            </Button>
          </PageHeader>

          {viewMode === "list" ? (
            <>
              {/* Active / Closed tabs */}
              <div className="mb-4 flex items-center gap-4">
                <button
                  onClick={() => setWaitlistSubTab("active")}
                  className={`border-b-2 pb-1 text-sm ${
                    waitlistSubTab === "active"
                      ? "border-primary font-medium text-primary"
                      : "border-transparent text-text-secondary hover:text-text"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setWaitlistSubTab("closed")}
                  className={`border-b-2 pb-1 text-sm ${
                    waitlistSubTab === "closed"
                      ? "border-primary font-medium text-primary"
                      : "border-transparent text-text-secondary hover:text-text"
                  }`}
                >
                  Closed
                </button>
              </div>

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
                      <td colSpan={7} className="px-4 py-8 text-center text-sm text-text-secondary">
                        No {waitlistSubTab} entries found.
                      </td>
                    </tr>
                  ) : (
                    filteredWaitlist.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <Td>
                          <div className="flex flex-wrap gap-1">
                            {row.tags.map((tag) =>
                              tag === "---" ? (
                                <span key={tag} className="text-sm text-text-secondary">
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
                      </tr>
                    ))
                  )}
                </TableBody>
              </DataTable>
              <Pagination currentPage={1} totalPages={1} totalItems={filteredWaitlist.length} itemsPerPage={10} />
            </>
          ) : (
            /* ===== MAP VIEW ===== */
            <div
              className="relative overflow-hidden rounded-lg border border-border"
              style={{ height: "calc(100vh - 180px)" }}
            >
              {/* Map background */}
              <div className="absolute inset-0 bg-[#e8e4d8]">
                {/* Road grid pattern */}
                <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="road-grid" width="120" height="120" patternUnits="userSpaceOnUse">
                      <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#d4d0c4" strokeWidth="1" />
                    </pattern>
                    <pattern id="road-major" width="360" height="360" patternUnits="userSpaceOnUse">
                      <path d="M 360 0 L 0 0 0 360" fill="none" stroke="#c8c4b8" strokeWidth="2" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#road-grid)" />
                  <rect width="100%" height="100%" fill="url(#road-major)" />
                  {/* Some diagonal roads */}
                  <line x1="0" y1="0" x2="100%" y2="100%" stroke="#d4d0c4" strokeWidth="1.5" />
                  <line x1="30%" y1="0" x2="80%" y2="100%" stroke="#c8c4b8" strokeWidth="2" />
                  <line x1="0" y1="40%" x2="100%" y2="60%" stroke="#d4d0c4" strokeWidth="1.5" />
                  {/* Green areas (parks) */}
                  <rect x="65%" y="20%" width="15%" height="12%" rx="8" fill="#c8dcc0" opacity="0.6" />
                  <rect x="10%" y="55%" width="12%" height="10%" rx="6" fill="#c8dcc0" opacity="0.5" />
                  <rect x="80%" y="70%" width="10%" height="15%" rx="6" fill="#c8dcc0" opacity="0.4" />
                </svg>

                {/* Place labels */}
                <div className="absolute top-[15%] left-[8%] text-[11px] font-medium text-gray-500">
                  Campbellfield
                </div>
                <div className="absolute top-[8%] left-[35%] text-[11px] font-medium text-gray-500">Thomastown</div>
                <div className="absolute top-[12%] left-[65%] text-[11px] font-medium text-gray-500">Bundoora</div>
                <div className="absolute top-[30%] left-[20%] text-[11px] font-medium text-gray-500">Fawkner</div>
                <div className="absolute top-[25%] left-[45%] text-[11px] font-medium text-gray-500">Reservoir</div>
                <div className="absolute top-[45%] left-[12%] text-[11px] font-medium text-gray-500">Coburg North</div>
                <div className="absolute top-[55%] left-[8%] text-[11px] font-medium text-gray-500">Pascoe Vale</div>
                <div className="absolute top-[50%] left-[30%] text-[11px] font-medium text-gray-500">Preston</div>
                <div className="absolute top-[35%] left-[55%] text-[11px] font-medium text-gray-500">Heidelberg</div>
                <div className="absolute top-[45%] left-[70%] text-[11px] font-medium text-gray-500">Bulleen</div>
                <div className="absolute top-[70%] left-[15%] text-[11px] font-medium text-gray-500">Brunswick</div>
                <div className="absolute top-[65%] left-[35%] text-[11px] font-medium text-gray-500">Northcote</div>
                <div className="absolute top-[75%] left-[50%] text-[11px] font-medium text-gray-500">Kew</div>
                <div className="absolute top-[88%] left-[40%] text-[10px] font-semibold text-gray-600">Melbourne</div>

                {/* Map pins */}
                {mapPins.map((pin, idx) => (
                  <div
                    key={idx}
                    className="group absolute"
                    style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: "translate(-50%, -100%)" }}
                  >
                    <MapPin className="h-6 w-6 text-gray-600 drop-shadow-sm" fill="#fff" strokeWidth={1.5} />
                    <div className="absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-[10px] whitespace-nowrap text-white group-hover:block">
                      {pin.label}
                    </div>
                  </div>
                ))}

                {/* Clustered pins (bottom-left area, matching screenshot) */}
                <div className="absolute" style={{ left: "8%", top: "60%", transform: "translate(-50%, -100%)" }}>
                  <div className="flex items-center gap-0.5">
                    <MapPin className="h-5 w-5 text-gray-600 drop-shadow-sm" fill="#fff" strokeWidth={1.5} />
                    <MapPin className="h-5 w-5 text-gray-600 drop-shadow-sm" fill="#fff" strokeWidth={1.5} />
                    <MapPin className="h-5 w-5 text-gray-600 drop-shadow-sm" fill="#fff" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Fullscreen button */}
                <button className="absolute top-3 right-3 rounded border border-border bg-white p-1.5 shadow-sm hover:bg-gray-50">
                  <svg
                    className="h-4 w-4 text-gray-600"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
