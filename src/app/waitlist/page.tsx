"use client";

import { useState } from "react";
import { Plus, Filter, Eye, HelpCircle, ThumbsUp, ThumbsDown, MapPin, List, Map } from "lucide-react";

const screenerData = [
  { triage: { yes: false, no: false }, tags: "---", client: "DDDDDDD Hun", dob: "---", address: "---", form: "Test form saved in A jr", dateSubmitted: "6 Mar 2026 (5 days)" },
  { triage: { yes: false, no: false }, tags: "---", client: "Hao Wang", dob: "---", address: "---", form: "Test EMB", dateSubmitted: "25 Feb 2026 (14 days)" },
  { triage: { yes: false, no: false }, tags: "---", client: "Hao Wang", dob: "---", address: "---", form: "Test EMB", dateSubmitted: "25 Feb 2026 (14 days)" },
  { triage: { yes: false, no: false }, tags: "---", client: "de qwe", dob: "---", address: "---", form: "Untitled form", dateSubmitted: "19 Jan 2026 (51 days)" },
  { triage: { yes: false, no: false }, tags: "---", client: "hello qqq", dob: "---", address: "---", form: "Untitled form", dateSubmitted: "19 Jan 2026 (51 days)" },
];

const waitlistData = [
  { tags: ["To assign a unique ID"], client: "kai win", dob: "1 Mar 2022", address: "---", dateAdded: "5 Mar 2026 (6 days)", service: "First Appointment ()" },
  { tags: ["---"], client: "New client", dob: "---", address: "Adelaide 5000", dateAdded: "5 Mar 2026 (6 days)", service: "Copy of ..." },
  { tags: ["Admin to review"], client: "test test", dob: "---", address: "---", dateAdded: "19 Feb 2026 (20 days)", service: "1:1 Consultation" },
  { tags: ["---"], client: "Ella Thompson", dob: "18 Feb 2015", address: "Adelaide 5000", dateAdded: "3 Feb 2026 (36 days)", service: "First Appointment" },
  { tags: ["Admin to review"], client: "splose Ruvi", dob: "2 Feb 1998", address: "---", dateAdded: "19 Jan 2026 (51 days)", service: "1:1 Consultation" },
  { tags: ["Admin to review"], client: "test ruvi", dob: "2 Apr 2021", address: "---", dateAdded: "19 Jan 2026 (51 days)", service: "1:1 Consultation" },
  { tags: ["Low"], client: "Jenny Jenkins", dob: "2 Feb 2002", address: "---", dateAdded: "29 Dec 2025 (72 days)", service: "First Appointment" },
  { tags: ["Admin to review", "Medium", "NDIS referral"], client: "Harry James", dob: "5 Jul 1985", address: "Adelaide 5000", dateAdded: "22 Dec 2025 (79 days)", service: "Back Re-Alignment" },
];

const tagColors: Record<string, string> = {
  "To assign a unique ID": "bg-red-100 text-red-700",
  "Admin to review": "bg-yellow-100 text-yellow-700",
  "Low": "bg-green-100 text-green-700",
  "Medium": "bg-orange-100 text-orange-700",
  "NDIS referral": "bg-purple-100 text-purple-700",
};

// Placeholder map pin positions (percentage-based for the placeholder map)
const mapPins = [
  { top: "25%", left: "30%", label: "kai win" },
  { top: "40%", left: "55%", label: "New client" },
  { top: "60%", left: "40%", label: "Ella Thompson" },
  { top: "35%", left: "70%", label: "Harry James" },
  { top: "55%", left: "20%", label: "Jenny Jenkins" },
  { top: "70%", left: "60%", label: "splose Ruvi" },
];

export default function WaitlistPage() {
  const [activeTab, setActiveTab] = useState<"screener" | "waitlist">("waitlist");
  const [showMap, setShowMap] = useState(false);
  const [triageState, setTriageState] = useState(
    screenerData.map((item) => ({ yes: item.triage.yes, no: item.triage.no }))
  );

  const handleTriage = (index: number, action: "yes" | "no") => {
    setTriageState((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        if (action === "yes") {
          return { yes: !item.yes, no: false };
        } else {
          return { yes: false, no: !item.no };
        }
      })
    );
  };

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex items-center gap-4 border-b border-border px-6 pt-2">
        <button
          onClick={() => setActiveTab("screener")}
          className={`border-b-2 px-1 pb-2 text-sm ${
            activeTab === "screener"
              ? "border-primary font-medium text-primary"
              : "border-transparent text-text-secondary hover:text-text"
          }`}
        >
          Screener
        </button>
        <button
          onClick={() => setActiveTab("waitlist")}
          className={`border-b-2 px-1 pb-2 text-sm ${
            activeTab === "waitlist"
              ? "border-primary font-medium text-primary"
              : "border-transparent text-text-secondary hover:text-text"
          }`}
        >
          Waitlist
        </button>
      </div>

      {activeTab === "screener" && (
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-text">Screener</h1>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                Reset all filters
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
                <HelpCircle className="h-4 w-4" />
                Learn
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
                <Eye className="h-4 w-4" />
                Show/hide fields
              </button>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Search for client name"
              className="h-10 flex-1 rounded-lg border border-border bg-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
              Search
            </button>
          </div>

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
                  <th className="px-4 py-3 text-left text-sm font-medium text-text">Client</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text">Date of birth</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text">Address</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text">Form</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text">Date submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {screenerData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleTriage(idx, "yes")}
                          className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                            triageState[idx].yes
                              ? "bg-green-500 text-white"
                              : "border border-gray-300 text-gray-400 hover:border-green-400 hover:text-green-500"
                          }`}
                          title="Yes"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleTriage(idx, "no")}
                          className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                            triageState[idx].no
                              ? "bg-red-500 text-white"
                              : "border border-gray-300 text-gray-400 hover:border-red-400 hover:text-red-500"
                          }`}
                          title="No"
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{row.tags}</td>
                    <td className="px-4 py-3 text-sm text-primary">{row.client}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{row.dob}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{row.address}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{row.form}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{row.dateSubmitted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
              <span>1-5 of 5 items</span>
              <div className="ml-4 flex items-center gap-1">
                <span>&lt;</span>
                <button className="flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">1</button>
                <span>&gt;</span>
              </div>
              <span className="ml-4">10 / page</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "waitlist" && (
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
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
                <Eye className="h-4 w-4" />
                Show/hide fields
              </button>
              <button
                onClick={() => setShowMap(!showMap)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm ${
                  showMap
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-white text-text hover:bg-gray-50"
                }`}
              >
                {showMap ? <List className="h-4 w-4" /> : <Map className="h-4 w-4" />}
                {showMap ? "List" : "Map"}
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
                <Plus className="h-4 w-4" />
                Add client
              </button>
            </div>
          </div>

          {/* Active / Closed tabs */}
          <div className="mb-4 flex items-center gap-4">
            <button className="border-b-2 border-primary pb-1 text-sm font-medium text-primary">Active</button>
            <button className="border-b-2 border-transparent pb-1 text-sm text-text-secondary hover:text-text">Closed</button>
          </div>

          {showMap ? (
            /* Map view */
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="relative h-[500px] bg-gray-200">
                {/* Placeholder map background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
                  {/* Grid lines to simulate a map */}
                  <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#d1d5db" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    {/* Simulated roads */}
                    <line x1="0" y1="200" x2="100%" y2="200" stroke="#e5e7eb" strokeWidth="3" />
                    <line x1="0" y1="350" x2="100%" y2="350" stroke="#e5e7eb" strokeWidth="3" />
                    <line x1="300" y1="0" x2="300" y2="100%" stroke="#e5e7eb" strokeWidth="3" />
                    <line x1="600" y1="0" x2="600" y2="100%" stroke="#e5e7eb" strokeWidth="3" />
                    <line x1="100" y1="0" x2="500" y2="100%" stroke="#e5e7eb" strokeWidth="2" />
                  </svg>

                  {/* Map pins */}
                  {mapPins.map((pin, idx) => (
                    <div
                      key={idx}
                      className="absolute -translate-x-1/2 -translate-y-full"
                      style={{ top: pin.top, left: pin.left }}
                    >
                      <div className="group relative flex flex-col items-center">
                        <div className="mb-1 hidden rounded bg-gray-800 px-2 py-1 text-xs text-white shadow-lg group-hover:block">
                          {pin.label}
                        </div>
                        <MapPin className="h-8 w-8 text-primary drop-shadow-md" fill="#7c3aed" strokeWidth={1.5} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map overlay text */}
                <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-3 py-2 text-sm text-text-secondary shadow">
                  Showing {mapPins.length} clients on map
                </div>
              </div>
            </div>
          ) : (
            /* List view */
            <>
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search for client name"
                  className="h-10 flex-1 rounded-lg border border-border bg-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
                  Search
                </button>
              </div>

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
                    {waitlistData.map((row, idx) => (
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
                          <button className="text-text-secondary hover:text-text">...</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
                  <span>1-10 of 88 items</span>
                  <div className="ml-4 flex items-center gap-1">
                    <span>&lt;</span>
                    <button className="flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">1</button>
                    <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary">2</button>
                    <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary">3</button>
                    <span>...</span>
                    <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary">9</button>
                    <span>&gt;</span>
                  </div>
                  <span className="ml-4">10 / page</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
