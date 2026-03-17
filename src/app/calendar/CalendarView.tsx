"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Settings2, LayoutGrid, Search, X, Clock, User, MapPin, FileText, Calendar } from "lucide-react";

type Appointment = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  type: string;
  location: string | null;
  notes: string | null;
  clientName: string;
  practitionerName: string;
  practitionerColor: string;
};

type Practitioner = {
  id: string;
  name: string;
  color: string;
};

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarView({
  appointments,
  practitioners,
  todayStr,
  weekDates,
}: {
  appointments: Appointment[];
  practitioners: Practitioner[];
  todayStr: string;
  weekDates: string[];
}) {
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTime, setCreateTime] = useState("");
  const [createDate, setCreateDate] = useState("");

  const today = new Date();
  const monthYear = today.toLocaleDateString("en-AU", { month: "long", year: "numeric" });

  function handleCellClick(dateStr: string, hour: number) {
    const h = hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? "pm" : "am";
    setCreateTime(`${h}:00 ${ampm}`);
    setCreateDate(dateStr);
    setShowCreateModal(true);
  }

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      <div className="flex flex-1 flex-col">
        {/* Calendar toolbar */}
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
              Today
            </button>
            <div className="flex items-center gap-1">
              <button className="rounded p-1 hover:bg-gray-100">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="rounded p-1 hover:bg-gray-100">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <h2 className="text-lg font-semibold text-text">{monthYear}</h2>
            <div className="flex items-center gap-2 ml-2 text-text-secondary">
              <button className="rounded p-1 hover:bg-gray-100"><Filter className="h-4 w-4" /></button>
              <button className="rounded p-1 hover:bg-gray-100"><Settings2 className="h-4 w-4" /></button>
              <button className="rounded p-1 hover:bg-gray-100"><LayoutGrid className="h-4 w-4" /></button>
              <button className="rounded p-1 hover:bg-gray-100"><Search className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-border bg-white px-3 py-1 text-sm text-text">
              Practitioners({practitioners.length})
            </span>
            <span className="text-sm text-text-secondary">Calendar</span>
            <select className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text">
              <option>Week</option>
              <option>Month</option>
              <option>Day</option>
            </select>
          </div>
        </div>

        {/* Week header */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border">
          <div className="border-r border-border" />
          {weekDates.map((dateStr, i) => {
            const date = new Date(dateStr + "T00:00:00");
            const isToday = dateStr === todayStr;
            return (
              <div
                key={i}
                className={`border-r border-border px-2 py-2 text-center last:border-r-0 ${isToday ? "bg-purple-50" : ""}`}
              >
                <div className="text-xs text-text-secondary">{DAYS[i]}</div>
                <div className={`text-lg font-semibold ${isToday ? "text-primary" : "text-text"}`}>
                  {date.getDate()}
                </div>
                <div className="mt-0.5 text-[10px] text-text-secondary truncate">
                  Splose Demo Clinic
                </div>
                <div className="flex justify-center gap-1 text-[10px] text-text-secondary truncate">
                  {practitioners.map((p) => (
                    <span key={p.id} className="truncate">{p.name.split(" ")[0]} {p.name.split(" ")[1]?.[0]}.</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-[60px_repeat(7,1fr)]">
            {HOURS.map((hour) => (
              <div key={hour} className="contents">
                <div className="flex items-start justify-end border-b border-r border-border px-2 py-1" style={{ minHeight: "60px" }}>
                  <span className="text-[11px] text-text-secondary -mt-1.5">
                    {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                  </span>
                </div>
                {weekDates.map((dateStr, dayIdx) => {
                  const isToday = dateStr === todayStr;
                  const hourAppts = appointments.filter(
                    (a) => a.date === dateStr && parseInt(a.startTime.split(":")[0]) === hour
                  );
                  return (
                    <div
                      key={dayIdx}
                      className={`relative border-b border-r border-border last:border-r-0 cursor-pointer hover:bg-gray-50/50 ${isToday ? "bg-purple-50/30" : ""}`}
                      style={{ minHeight: "60px" }}
                      onClick={() => handleCellClick(dateStr, hour)}
                    >
                      {hourAppts.map((appt) => (
                        <div
                          key={appt.id}
                          className="absolute inset-x-1 top-1 cursor-pointer rounded px-1.5 py-1 text-white shadow-sm z-10"
                          style={{
                            backgroundColor: appt.practitionerColor,
                            opacity: appt.status === "Cancelled" ? 0.5 : 1,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppt(appt);
                          }}
                        >
                          <p className="text-xs font-medium truncate">{appt.clientName}</p>
                          <p className="text-[10px] opacity-80">{appt.startTime}</p>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment detail flyout */}
      {selectedAppt && (
        <div className="w-80 shrink-0 border-l border-border bg-white overflow-y-auto animate-in slide-in-from-right">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: selectedAppt.practitionerColor }}
                />
                <span className="text-sm font-medium text-text">
                  {selectedAppt.type} ({selectedAppt.endTime ? calcDuration(selectedAppt.startTime, selectedAppt.endTime) : "45 mins"})
                </span>
              </div>
              <button
                onClick={() => setSelectedAppt(null)}
                className="rounded p-1 hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-text-secondary" />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-text-secondary mt-0.5" />
                <div>
                  <span className="text-text">{selectedAppt.practitionerName}</span>
                  <span className="text-text-secondary"> at </span>
                  <span className="text-text font-medium">Splose Demo Clinic</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-text-secondary mt-0.5" />
                <span className="text-text">{selectedAppt.practitionerName}</span>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-text-secondary mt-0.5" />
                <span className="text-text">
                  {selectedAppt.startTime}, {formatDateLong(selectedAppt.date)} for {calcDuration(selectedAppt.startTime, selectedAppt.endTime)}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-primary cursor-pointer hover:underline">{selectedAppt.clientName}</span>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-text-secondary mt-0.5" />
                <span className="text-text-secondary">{selectedAppt.status}</span>
              </div>

              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-primary cursor-pointer hover:underline">Add invoice</span>
                <span className="text-text-secondary mx-1">Mark as</span>
                <span className="text-primary cursor-pointer hover:underline">Do not invoice?</span>
              </div>

              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-primary cursor-pointer hover:underline">Add progress note</span>
              </div>

              {/* Note field */}
              <div className="mt-4">
                <label className="text-xs text-text-secondary flex items-center gap-1">
                  Note
                </label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary resize-none"
                  rows={3}
                  placeholder="Add a note..."
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex items-center gap-2">
              <button className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
                Book another
              </button>
              <button className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
                Edit
              </button>
              <button className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
                Reschedule
              </button>
              <button className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
                Archive
              </button>
            </div>

            <div className="mt-3 text-center">
              <button className="text-sm text-primary hover:underline">View change log</button>
            </div>
          </div>
        </div>
      )}

      {/* Create appointment modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-text">Create appointment</h2>
              <button onClick={() => setShowCreateModal(false)} className="rounded p-1 hover:bg-gray-100">
                <X className="h-5 w-5 text-text-secondary" />
              </button>
            </div>
            <div className="space-y-4 px-6 py-4">
              <FormField label="Location" value="Splose Demo Clinic" />
              <FormField label="Practitioner" value={practitioners[0]?.name || "Select practitioner"} />
              <FormField label="Client" placeholder="Start typing to search client" />
              <FormField label="Service" placeholder="Choose a service" />
              <FormField label="Case" placeholder="Choose a case" />
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm text-text-secondary">Date *</label>
                  <div className="mt-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text">
                    {formatDateLong(createDate)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm text-text-secondary">Time *</label>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text">
                      {createTime}
                    </div>
                    <div className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-secondary">
                      End
                    </div>
                  </div>
                </div>
              </div>
              <FormField label="Room/Resource" placeholder="Choose a room/resource" />
              <div className="flex items-center gap-2">
                <div className="h-5 w-9 rounded-full bg-gray-200 p-0.5">
                  <div className="h-4 w-4 rounded-full bg-white shadow" />
                </div>
                <span className="text-sm text-text">Repeat</span>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Note :</label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, value, placeholder }: { label: string; value?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-sm text-text-secondary">{label} *</label>
      <div className="mt-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text">
        {value || <span className="text-text-secondary">{placeholder}</span>}
      </div>
    </div>
  );
}

function calcDuration(start: string, end: string): string {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins <= 0) return "45 mins";
  return `${mins} minutes`;
}

function formatDateLong(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}
