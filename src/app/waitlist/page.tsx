"use client";

import { useState } from "react";
import { Plus, Filter, List, Map as MapIcon, HelpCircle, ThumbsUp, ThumbsDown, MoreHorizontal, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

const screenerData = [
  { triage: { yes: false, no: false }, tags: "---", client: "DDDDDDD Hun", dob: "---", address: "---", form: "Test form saved in A jr", dateSubmitted: "6 Mar 2026 (5 days)", archived: false },
  { triage: { yes: false, no: false }, tags: "---", client: "Hao Wang", dob: "---", address: "---", form: "Test EMB", dateSubmitted: "25 Feb 2026 (14 days)", archived: false },
  { triage: { yes: false, no: false }, tags: "---", client: "Hao Wang", dob: "---", address: "---", form: "Test EMB", dateSubmitted: "25 Feb 2026 (14 days)", archived: false },
  { triage: { yes: false, no: false }, tags: "---", client: "de qwe", dob: "---", address: "---", form: "Untitled form", dateSubmitted: "19 Jan 2026 (51 days)", archived: false },
  { triage: { yes: false, no: false }, tags: "---", client: "hello qqq", dob: "---", address: "---", form: "Untitled form", dateSubmitted: "19 Jan 2026 (51 days)", archived: false },
  { triage: { yes: false, no: false }, tags: "---", client: "Delete Test embeddable", dob: "---", address: "---", form: "Test Intake", dateSubmitted: "9 Dec 2025 (92 days)", archived: false },
  { triage: { yes: false, no: false }, tags: "---", client: "j jjj", dob: "---", address: "---", form: "Untitled form", dateSubmitted: "3 Dec 2025 (98 days)", archived: false },
  { triage: { yes: false, no: false }, tags: "---", client: "test embeddable scott", dob: "---", address: "---", form: "Untitled form", dateSubmitted: "3 Dec 2025 (98 days)", archived: false },
  { triage: { yes: false, no: false }, tags: "---", client: "ee ee", dob: "---", address: "---", form: "Untitled form", dateSubmitted: "1 Dec 2025 (100 days)", archived: false },
  { triage: { yes: false, no: false }, tags: "---", client: "Test Ruvi Emb", dob: "---", address: "---", form: "Untitled form", dateSubmitted: "18 Nov 2025 (113 days)", archived: true },
];

const waitlistData = [
  { tags: ["To assign a unique ID"], client: "kai win", dob: "1 Mar 2022", address: "---", dateAdded: "5 Mar 2026 (6 days)", service: "First Appointment ()", status: "active" as const },
  { tags: ["---"], client: "New client", dob: "---", address: "Adelaide 5000", dateAdded: "5 Mar 2026 (6 days)", service: "Copy of ...", status: "active" as const },
  { tags: ["Admin to review"], client: "test test", dob: "---", address: "---", dateAdded: "19 Feb 2026 (20 days)", service: "1:1 Consultation", status: "active" as const },
  { tags: ["---"], client: "Ella Thompson", dob: "18 Feb 2015", address: "Adelaide 5000", dateAdded: "3 Feb 2026 (36 days)", service: "First Appointment", status: "active" as const },
  { tags: ["Admin to review"], client: "splose Ruvi", dob: "2 Feb 1998", address: "---", dateAdded: "19 Jan 2026 (51 days)", service: "1:1 Consultation", status: "active" as const },
  { tags: ["Admin to review"], client: "test ruvi", dob: "2 Apr 2021", address: "---", dateAdded: "19 Jan 2026 (51 days)", service: "1:1 Consultation", status: "active" as const },
  { tags: ["Low"], client: "Jenny Jenkins", dob: "2 Feb 2002", address: "---", dateAdded: "29 Dec 2025 (72 days)", service: "First Appointment", status: "active" as const },
  { tags: ["Admin to review", "Medium", "NDIS referral"], client: "Harry James", dob: "5 Jul 1985", address: "Adelaide 5000", dateAdded: "22 Dec 2025 (79 days)", service: "Back Re-Alignment", status: "active" as const },
  { tags: ["---"], client: "Closed Client A", dob: "12 Jan 1990", address: "Melbourne 3000", dateAdded: "10 Nov 2025 (120 days)", service: "1:1 Consultation", status: "closed" as const },
  { tags: ["Low"], client: "Closed Client B", dob: "5 May 1988", address: "---", dateAdded: "1 Oct 2025 (160 days)", service: "First Appointment", status: "closed" as const },
];

const tagColors: Record<string, string> = {
  "To assign a unique ID": "bg-red-100 text-red-700",
  "Admin to review": "bg-yellow-100 text-yellow-700",
  "Low": "bg-green-100 text-green-700",
  "Medium": "bg-orange-100 text-orange-700",
  "NDIS referral": "bg-purple-100 text-purple-700",
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
  const [mainTab, setMainTab] = useState<"screener" | "waitlist">("screener");
  const [screenerSubTab, setScreenerSubTab] = useState<"triage" | "rejected">("triage");
  const [waitlistSubTab, setWaitlistSubTab] = useState<"active" | "closed">("active");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [triageState, setTriageState] = useState<Record<number, "yes" | "no" | null>>(
    () => {
      const initial: Record<number, "yes" | "no" | null> = {};
      screenerData.forEach((_, i) => { initial[i] = null; });
      return initial;
    }
  );
  const [screenerSearch, setScreenerSearch] = useState("");
  const [waitlistSearch, setWaitlistSearch] = useState("");

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
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-text">Screener</h1>
            <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
              <HelpCircle className="h-4 w-4" />
              Learn
            </button>
          </div>

          {/* Search */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Search for client name"
              value={screenerSearch}
              onChange={(e) => setScreenerSearch(e.target.value)}
              className="h-10 flex-1 rounded-lg border border-border bg-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
              Search
            </button>
          </div>

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
          <div className="overflow-hidden rounded-lg border border-border bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-purple-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-text">Triage</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text">
                    <div className="flex items-center gap-1">
                      Tags
                      <Filter className="h-3 w-3 text-text-secondary" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text">
                    <div className="flex items-center gap-1">
                      Client
                      <svg className="h-3 w-3 text-text-secondary" viewBox="0 0 12 12" fill="currentColor"><path d="M6 0L9 5H3L6 0ZM6 12L3 7H9L6 12Z" /></svg>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text">Date of birth</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text">Address</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text">Form</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text">Date submitted</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-text">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
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
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleTriage(idx, "yes")}
                              className={`flex items-center gap-0.5 rounded border px-2 py-1 text-xs ${
                                triageState[idx] === "yes"
                                  ? "border-green-300 bg-green-50 text-green-700"
                                  : "border-border bg-white text-text-secondary hover:bg-gray-50"
                              }`}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span>Yes</span>
                            </button>
                            <button
                              onClick={() => handleTriage(idx, "no")}
                              className={`flex items-center gap-0.5 rounded border px-2 py-1 text-xs ${
                                triageState[idx] === "no"
                                  ? "border-red-300 bg-red-50 text-red-700"
                                  : "border-border bg-white text-text-secondary hover:bg-gray-50"
                              }`}
                            >
                              <ThumbsDown className="h-3 w-3" />
                              <span>No</span>
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-text-secondary">{row.tags}</td>
                        <td className="px-4 py-3 text-sm text-primary">{row.client}</td>
                        <td className="px-4 py-3 text-sm text-text-secondary">{row.dob}</td>
                        <td className="px-4 py-3 text-sm text-text-secondary">{row.address}</td>
                        <td className="px-4 py-3 text-sm text-primary">{row.form}</td>
                        <td className="px-4 py-3 text-sm text-text-secondary">
                          <div className="flex items-center gap-2">
                            {row.dateSubmitted}
                            {row.archived && (
                              <span className="rounded bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">
                                Archived
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-text-secondary hover:text-text">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </td>
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
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== WAITLIST TAB ===== */}
      {mainTab === "waitlist" && (
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-text">Waitlist</h1>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                Reset all filters
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
                <HelpCircle className="h-4 w-4" />
                Learn
              </button>
              {/* Map / List toggle */}
              <button
                onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm ${
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
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
                <Plus className="h-4 w-4" />
                Add client
              </button>
            </div>
          </div>

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
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search for client name"
                  value={waitlistSearch}
                  onChange={(e) => setWaitlistSearch(e.target.value)}
                  className="h-10 flex-1 rounded-lg border border-border bg-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
                  Search
                </button>
              </div>

              {/* Waitlist table */}
              <div className="overflow-hidden rounded-lg border border-border bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-purple-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-text">
                        <div className="flex items-center gap-1">
                          Tags
                          <Filter className="h-3 w-3 text-text-secondary" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text">Client</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text">Date of birth</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text">Address</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text">Date added</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text">Service</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-text">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredWaitlist.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-sm text-text-secondary">
                          No {waitlistSubTab} entries found.
                        </td>
                      </tr>
                    ) : (
                      filteredWaitlist.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {row.tags.map((tag) =>
                                tag === "---" ? (
                                  <span key={tag} className="text-sm text-text-secondary">---</span>
                                ) : (
                                  <span
                                    key={tag}
                                    className={`rounded px-2 py-0.5 text-[11px] font-medium ${tagColors[tag] || "bg-gray-100 text-gray-700"}`}
                                  >
                                    {tag}
                                  </span>
                                )
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-primary">{row.client}</td>
                          <td className="px-4 py-3 text-sm text-text-secondary">{row.dob}</td>
                          <td className="px-4 py-3 text-sm text-text-secondary">{row.address}</td>
                          <td className="px-4 py-3 text-sm text-text-secondary">{row.dateAdded}</td>
                          <td className="px-4 py-3 text-sm text-text-secondary">{row.service}</td>
                          <td className="px-4 py-3 text-right">
                            <button className="text-text-secondary hover:text-text">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
                  <span>1-{filteredWaitlist.length} of {filteredWaitlist.length} items</span>
                  <div className="ml-4 flex items-center gap-1">
                    <span className="cursor-pointer text-text-secondary hover:text-text">&lt;</span>
                    <button className="flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">1</button>
                    <span className="cursor-pointer text-text-secondary hover:text-text">&gt;</span>
                  </div>
                  <span className="ml-4">10 / page</span>
                </div>
              </div>
            </>
          ) : (
            /* ===== MAP VIEW ===== */
            <div className="relative overflow-hidden rounded-lg border border-border" style={{ height: "calc(100vh - 180px)" }}>
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
                <div className="absolute left-[8%] top-[15%] text-[11px] font-medium text-gray-500">Campbellfield</div>
                <div className="absolute left-[35%] top-[8%] text-[11px] font-medium text-gray-500">Thomastown</div>
                <div className="absolute left-[65%] top-[12%] text-[11px] font-medium text-gray-500">Bundoora</div>
                <div className="absolute left-[20%] top-[30%] text-[11px] font-medium text-gray-500">Fawkner</div>
                <div className="absolute left-[45%] top-[25%] text-[11px] font-medium text-gray-500">Reservoir</div>
                <div className="absolute left-[12%] top-[45%] text-[11px] font-medium text-gray-500">Coburg North</div>
                <div className="absolute left-[8%] top-[55%] text-[11px] font-medium text-gray-500">Pascoe Vale</div>
                <div className="absolute left-[30%] top-[50%] text-[11px] font-medium text-gray-500">Preston</div>
                <div className="absolute left-[55%] top-[35%] text-[11px] font-medium text-gray-500">Heidelberg</div>
                <div className="absolute left-[70%] top-[45%] text-[11px] font-medium text-gray-500">Bulleen</div>
                <div className="absolute left-[15%] top-[70%] text-[11px] font-medium text-gray-500">Brunswick</div>
                <div className="absolute left-[35%] top-[65%] text-[11px] font-medium text-gray-500">Northcote</div>
                <div className="absolute left-[50%] top-[75%] text-[11px] font-medium text-gray-500">Kew</div>
                <div className="absolute left-[40%] top-[88%] text-[10px] font-semibold text-gray-600">Melbourne</div>

                {/* Map pins */}
                {mapPins.map((pin, idx) => (
                  <div
                    key={idx}
                    className="group absolute"
                    style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: "translate(-50%, -100%)" }}
                  >
                    <MapPin className="h-6 w-6 text-gray-600 drop-shadow-sm" fill="#fff" strokeWidth={1.5} />
                    <div className="absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-[10px] text-white group-hover:block">
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
                <button className="absolute right-3 top-3 rounded border border-border bg-white p-1.5 shadow-sm hover:bg-gray-50">
                  <svg className="h-4 w-4 text-gray-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
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
