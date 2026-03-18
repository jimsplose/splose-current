"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Settings2,
  LayoutGrid,
  Search,
  X,
  Clock,
  User,
  MapPin,
  FileText,
  Calendar,
  Plus,
} from "lucide-react";
import { Button, Badge } from "@/components/ds";

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

const HOUR_HEIGHT = 80; // pixels per hour row
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getApptStyle(appt: { startTime: string; endTime: string }) {
  const startMins = parseTimeToMinutes(appt.startTime);
  const endMins = parseTimeToMinutes(appt.endTime);
  const durationMins = Math.max(endMins - startMins, 30);
  const minuteWithinHour = startMins % 60;
  const topPx = (minuteWithinHour / 60) * HOUR_HEIGHT;
  const heightPx = (durationMins / 60) * HOUR_HEIGHT - 2;
  return { top: `${topPx}px`, height: `${heightPx}px` };
}

const TIME_OPTIONS: string[] = [];
for (let h = 7; h <= 18; h++) {
  for (let m = 0; m < 60; m += 30) {
    TIME_OPTIONS.push(formatTime24to12(h, m));
  }
}

function formatTime24to12(hour: number, minute: number): string {
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const ampm = hour >= 12 ? "PM" : "AM";
  const mm = minute.toString().padStart(2, "0");
  return `${h}:${mm} ${ampm}`;
}

type ViewMode = "Week" | "Month" | "Day";
type CalendarMode = "Calendar" | "Rooms/resources";

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRepeat, setEditRepeat] = useState(false);
  const [editRoom, setEditRoom] = useState("");
  const [editApplyTo, setEditApplyTo] = useState<"this" | "following" | "all">("this");
  const [createTime, setCreateTime] = useState("");
  const [createEndTime, setCreateEndTime] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [createClient, setCreateClient] = useState("");
  const [createPractitioner, setCreatePractitioner] = useState("");
  const [createType, setCreateType] = useState("Follow Up");
  const [createNotes, setCreateNotes] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("Week");
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("Calendar");
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [showCalendarModeDropdown, setShowCalendarModeDropdown] = useState(false);

  // Dev Navigator: ?state= param wiring
  const searchParams = useSearchParams();
  const forcedState = searchParams.get("state");
  useEffect(() => {
    if (!forcedState) return;
    const actions: Record<string, () => void> = {
      "month-view": () => setViewMode("Month"),
      "day-view": () => setViewMode("Day"),
      "appointment-selected": () => {
        if (appointments.length > 0) setSelectedAppt(appointments[0]);
      },
      "new-appointment": () => setShowCreateModal(true),
      "edit-appointment": () => {
        if (appointments.length > 0) {
          setSelectedAppt(appointments[0]);
          setShowEditModal(true);
        }
      },
      "rooms-view": () => setCalendarMode("Rooms/resources"),
    };
    actions[forcedState]?.();
  }, [forcedState]);

  const today = new Date();
  const monthYear = today.toLocaleDateString("en-AU", { month: "long", year: "numeric" });

  function openCreateModal(dateStr?: string, hour?: number) {
    if (dateStr && hour !== undefined) {
      setCreateDate(dateStr);
      setCreateTime(formatTime24to12(hour, 0));
      setCreateEndTime(formatTime24to12(hour + 1, 0));
    } else {
      const now = new Date();
      const currentHour = now.getHours();
      setCreateDate(todayStr);
      setCreateTime(formatTime24to12(currentHour, 0));
      setCreateEndTime(formatTime24to12(currentHour + 1, 0));
    }
    setCreateClient("");
    setCreatePractitioner(practitioners[0]?.id || "");
    setCreateType("Follow Up");
    setCreateNotes("");
    setShowCreateModal(true);
  }

  function handleCellClick(dateStr: string, hour: number) {
    openCreateModal(dateStr, hour);
  }

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      <div className="flex flex-1 flex-col">
        {/* Calendar toolbar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto border-b border-border px-2 py-2 sm:px-4">
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Button variant="secondary" size="sm">
              Today
            </Button>
            <div className="flex items-center gap-1">
              <button className="rounded p-1 hover:bg-gray-100">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="rounded p-1 hover:bg-gray-100">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <h2 className="text-lg font-semibold text-text">{monthYear}</h2>
            <div className="ml-2 flex items-center gap-2 text-text-secondary">
              <button className="rounded p-1 hover:bg-gray-100">
                <Filter className="h-4 w-4" />
              </button>
              <button className="rounded p-1 hover:bg-gray-100">
                <Settings2 className="h-4 w-4" />
              </button>
              <button className="rounded p-1 hover:bg-gray-100">
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button className="rounded p-1 hover:bg-gray-100">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {/* Location filter pills */}
            <span className="hidden rounded-full border border-green-300 bg-green-50 px-3 py-1 text-sm font-medium text-green-700 sm:inline-flex">
              East Clinics
            </span>
            <span className="hidden rounded-full border border-purple-300 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700 sm:inline-flex">
              Physio
            </span>

            <button
              onClick={() => openCreateModal()}
              className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-dark"
            >
              <Plus className="h-4 w-4" />
            </button>

            {/* Calendar/Rooms dropdown */}
            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowCalendarModeDropdown(!showCalendarModeDropdown);
                  setShowViewDropdown(false);
                }}
              >
                {calendarMode} <span className="text-text-secondary">&#9662;</span>
              </Button>
              {showCalendarModeDropdown && (
                <div className="absolute top-full right-0 z-20 mt-1 w-44 rounded-lg border border-border bg-white py-1 shadow-lg">
                  {(["Calendar", "Rooms/resources"] as CalendarMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setCalendarMode(mode);
                        setShowCalendarModeDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${calendarMode === mode ? "bg-purple-50 font-semibold text-primary" : "text-text"}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View mode dropdown */}
            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowViewDropdown(!showViewDropdown);
                  setShowCalendarModeDropdown(false);
                }}
              >
                {viewMode} <span className="text-text-secondary">&#9662;</span>
              </Button>
              {showViewDropdown && (
                <div className="absolute top-full right-0 z-20 mt-1 w-32 rounded-lg border border-border bg-white py-1 shadow-lg">
                  {(["Month", "Week", "Day"] as ViewMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setViewMode(mode);
                        setShowViewDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${viewMode === mode ? "bg-purple-50 font-semibold text-primary" : "text-text"}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Month View */}
        {viewMode === "Month" && (
          <MonthView appointments={appointments} todayStr={todayStr} onApptClick={(appt) => setSelectedAppt(appt)} />
        )}

        {/* Week header + Time grid */}
        {viewMode !== "Month" && (
          <>
            <div className="overflow-x-auto">
              <div className="grid min-w-[700px] grid-cols-[60px_repeat(7,1fr)] border-b border-border">
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
                      <div className="mt-0.5 truncate text-[10px] text-text-secondary">Hands Togeth...</div>
                      <div className="flex justify-center gap-1 truncate text-[10px] text-text-secondary">
                        {practitioners.map((p) => (
                          <span key={p.id} className="truncate">
                            {p.name.split(" ")[0]} {p.name.split(" ")[1]?.[0]}.
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time grid */}
            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <div className="grid min-w-[700px] grid-cols-[60px_repeat(7,1fr)]">
                {HOURS.map((hour) => (
                  <div key={hour} className="contents">
                    <div
                      className="flex items-start justify-end border-r border-b border-border px-2 py-1"
                      style={{ height: `${HOUR_HEIGHT}px` }}
                    >
                      <span className="-mt-1.5 text-[11px] text-text-secondary">
                        {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                      </span>
                    </div>
                    {weekDates.map((dateStr, dayIdx) => {
                      const isToday = dateStr === todayStr;
                      const hourAppts = appointments.filter(
                        (a) => a.date === dateStr && parseInt(a.startTime.split(":")[0]) === hour,
                      );
                      return (
                        <div
                          key={dayIdx}
                          className={`relative cursor-pointer border-r border-b border-border last:border-r-0 hover:bg-gray-100/50 ${isToday ? "bg-purple-50/30" : ""}`}
                          style={{ height: `${HOUR_HEIGHT}px` }}
                          onClick={() => handleCellClick(dateStr, hour)}
                        >
                          {hourAppts.map((appt) => {
                            const pos = getApptStyle(appt);
                            return (
                              <div
                                key={appt.id}
                                className="absolute inset-x-1 z-10 cursor-pointer overflow-hidden rounded px-2 py-1.5 text-white shadow-sm"
                                style={{
                                  backgroundColor: appt.practitionerColor,
                                  opacity: appt.status === "Cancelled" ? 0.5 : 1,
                                  ...pos,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAppt(appt);
                                }}
                              >
                                <p className="truncate text-xs font-medium">{appt.clientName}</p>
                                <p className="text-[10px] opacity-80">
                                  {appt.startTime} – {appt.endTime.replace(/^0/, "")}
                                </p>
                                <p className="truncate text-[10px] opacity-70">{appt.type}</p>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Rooms/Resources placeholder */}
      {calendarMode === "Rooms/resources" && viewMode !== "Month" && (
        <div className="absolute inset-0 top-12 z-10 flex items-center justify-center bg-white/80">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <LayoutGrid className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-text-secondary">Rooms/Resources view</p>
            <p className="mt-1 text-xs text-text-secondary">Select rooms to display in the calendar</p>
          </div>
        </div>
      )}

      {/* Appointment detail flyout */}
      {selectedAppt && (
        <div className="animate-in slide-in-from-right absolute inset-0 z-20 w-full shrink-0 overflow-y-auto border-l border-border bg-white sm:relative sm:inset-auto sm:w-80">
          <div className="p-4">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: selectedAppt.practitionerColor }} />
                <span className="text-sm font-medium text-text">
                  {selectedAppt.type} (
                  {selectedAppt.endTime ? calcDuration(selectedAppt.startTime, selectedAppt.endTime) : "45 mins"})
                </span>
              </div>
              <button onClick={() => setSelectedAppt(null)} className="rounded p-1 hover:bg-gray-100">
                <X className="h-4 w-4 text-text-secondary" />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <User className="mt-0.5 h-4 w-4 text-text-secondary" />
                <div>
                  <span className="text-text">{selectedAppt.practitionerName}</span>
                  <span className="text-text-secondary"> at </span>
                  <span className="font-medium text-text">Hands Together Therapy (East)</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <User className="mt-0.5 h-4 w-4 text-text-secondary" />
                <span className="text-text">{selectedAppt.practitionerName}</span>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 text-text-secondary" />
                <span className="text-text">
                  {selectedAppt.startTime}, {formatDateLong(selectedAppt.date)} for{" "}
                  {calcDuration(selectedAppt.startTime, selectedAppt.endTime)}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <User className="mt-0.5 h-4 w-4 text-primary" />
                <span className="cursor-pointer text-primary hover:underline">{selectedAppt.clientName}</span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-text-secondary" />
                <span className="text-text-secondary">thyxueen@gmail.com</span>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="mt-0.5 h-4 w-4 text-text-secondary" />
                <span className="text-text-secondary">No status</span>
              </div>

              <div className="flex items-start gap-2">
                <FileText className="mt-0.5 h-4 w-4 text-primary" />
                <span className="cursor-pointer text-primary hover:underline">Create zoom meeting</span>
              </div>

              <div className="flex items-start gap-2">
                <FileText className="mt-0.5 h-4 w-4 text-primary" />
                <span className="cursor-pointer text-primary hover:underline">Add invoice</span>
                <Badge variant="blue" className="ml-1">Draft</Badge>
              </div>

              <div className="flex items-start gap-2">
                <FileText className="mt-0.5 h-4 w-4 text-primary" />
                <span className="cursor-pointer text-primary hover:underline">Add progress note</span>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 text-text-secondary" />
                <span className="text-xs text-text-secondary">Repeating every 2 weeks on Monday for 6 times</span>
              </div>

              <div className="flex items-start gap-2">
                <User className="mt-0.5 h-4 w-4 text-text-secondary" />
                <span className="text-text-secondary">{selectedAppt.practitionerName} (Organiser)</span>
              </div>

              {/* Note field */}
              <div className="mt-4">
                <label className="flex items-center gap-1 text-xs text-text-secondary">Note</label>
                <textarea
                  className="mt-1 w-full resize-none rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                  rows={3}
                  placeholder="Add a note..."
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex items-center gap-2">
              <Button variant="secondary" size="sm">
                Book another
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setShowEditModal(true)}>
                Edit
              </Button>
              <Button variant="secondary" size="sm">
                Reschedule
              </Button>
              <Button variant="danger" size="sm">
                Archive
              </Button>
            </div>

            <div className="mt-3 text-center">
              <button className="text-sm text-primary hover:underline">View change log</button>
            </div>
          </div>
        </div>
      )}

      {/* Create appointment modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-3 pt-4 pb-4 sm:px-0 sm:pt-12 sm:pb-12"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
        >
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-text">New appointment</h2>
              <button onClick={() => setShowCreateModal(false)} className="rounded p-1 hover:bg-gray-100">
                <X className="h-5 w-5 text-text-secondary" />
              </button>
            </div>
            <div className="space-y-4 px-6 py-5">
              {/* Client */}
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Client *</label>
                <input
                  type="text"
                  value={createClient}
                  onChange={(e) => setCreateClient(e.target.value)}
                  placeholder="Start typing to search client..."
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>

              {/* Practitioner */}
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Practitioner *</label>
                <select
                  value={createPractitioner}
                  onChange={(e) => setCreatePractitioner(e.target.value)}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                >
                  {practitioners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Date *</label>
                <input
                  type="date"
                  value={createDate}
                  onChange={(e) => setCreateDate(e.target.value)}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>

              {/* Start / End time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-secondary">Start time *</label>
                  <select
                    value={createTime}
                    onChange={(e) => setCreateTime(e.target.value)}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-secondary">End time *</label>
                  <select
                    value={createEndTime}
                    onChange={(e) => setCreateEndTime(e.target.value)}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Appointment type */}
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Appointment type *</label>
                <select
                  value={createType}
                  onChange={(e) => setCreateType(e.target.value)}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                >
                  <option value="Initial Assessment">Initial Assessment</option>
                  <option value="Follow Up">Follow Up</option>
                  <option value="Review">Review</option>
                  <option value="Group Session">Group Session</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Notes</label>
                <textarea
                  value={createNotes}
                  onChange={(e) => setCreateNotes(e.target.value)}
                  placeholder="Add notes..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setShowCreateModal(false)}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit appointment modal */}
      {showEditModal && selectedAppt && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-3 pt-4 pb-4 sm:px-0 sm:pt-12 sm:pb-12"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEditModal(false);
          }}
        >
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-text">Edit appointment</h2>
              <button onClick={() => setShowEditModal(false)} className="rounded p-1 hover:bg-gray-100">
                <X className="h-5 w-5 text-text-secondary" />
              </button>
            </div>
            <div className="space-y-4 px-6 py-5">
              {/* Service */}
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Service *</label>
                <input
                  type="text"
                  defaultValue={`${selectedAppt.clientName}`}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>

              {/* Case */}
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Case</label>
                <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20">
                  <option>Choose a case</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Date *</label>
                <input
                  type="date"
                  defaultValue={selectedAppt.date}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-secondary">Time *</label>
                  <input
                    type="text"
                    defaultValue={selectedAppt.startTime}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-secondary">&nbsp;</label>
                  <input
                    type="text"
                    defaultValue={selectedAppt.endTime}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Room/Resource */}
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Room/Resource</label>
                <select
                  value={editRoom}
                  onChange={(e) => setEditRoom(e.target.value)}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                >
                  <option value="">Choose a room/resource</option>
                  <optgroup label="Green room">
                    <option value="green">Green (1 available of 1)</option>
                  </optgroup>
                  <optgroup label="">
                    <option value="red">Red (1 available of 1)</option>
                    <option value="blue">Blue (2 available of 2)</option>
                  </optgroup>
                  <optgroup label="Car">
                    <option value="car">Car (1 available of 1)</option>
                  </optgroup>
                  <optgroup label="Rooms">
                    <option value="room1">Room 1 (1 available of 1)</option>
                  </optgroup>
                </select>
              </div>

              {/* Repeat toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditRepeat(!editRepeat)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editRepeat ? "bg-primary" : "bg-gray-200"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${editRepeat ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
                <span className="text-sm text-text">Repeat</span>
              </div>

              {editRepeat && (
                <div className="space-y-3 rounded-lg border border-border bg-gray-50 p-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-secondary">Repeat</label>
                    <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary">
                      <option>Every 2 weeks</option>
                      <option>Every week</option>
                      <option>Every 3 weeks</option>
                      <option>Every 4 weeks</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-secondary">Repeat on *</label>
                    <div className="flex gap-1">
                      {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                        <button
                          key={d}
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${d === "Mo" ? "bg-primary text-white" : "border border-border bg-white text-text hover:bg-gray-50"}`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-secondary">Ends</label>
                    <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary">
                      <option>After 6 times</option>
                      <option>After 4 times</option>
                      <option>After 8 times</option>
                      <option>After 12 times</option>
                      <option>On date</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Apply to */}
              <div>
                <label className="mb-2 block text-sm font-medium text-text-secondary">Apply to:</label>
                <div className="space-y-1.5">
                  {[
                    { value: "this" as const, label: "This occurrence" },
                    { value: "following" as const, label: "This and all following occurrences" },
                    { value: "all" as const, label: "All occurrences" },
                  ].map((opt) => (
                    <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm text-text">
                      <input
                        type="radio"
                        name="applyTo"
                        checked={editApplyTo === opt.value}
                        onChange={() => setEditApplyTo(opt.value)}
                        className="accent-primary"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setShowEditModal(false)}>
                Save changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Month View ──────────────────────────────────────────────────── */

function MonthView({
  appointments,
  todayStr,
  onApptClick,
}: {
  appointments: Appointment[];
  todayStr: string;
  onApptClick: (appt: Appointment) => void;
}) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // Build calendar grid
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = firstDay.getDay(); // 0=Sun
  const daysInMonth = lastDay.getDate();

  // Previous month fill
  const prevMonthLast = new Date(year, month, 0).getDate();
  const cells: { day: number; month: number; year: number; isCurrentMonth: boolean }[] = [];

  for (let i = startDow - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLast - i, month: month - 1, year, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month, year, isCurrentMonth: true });
  }
  // Fill to 42 cells (6 rows)
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, month: month + 1, year, isCurrentMonth: false });
  }

  const rows = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  function dateStr(cell: { day: number; month: number; year: number }) {
    const m = cell.month < 0 ? 11 : cell.month > 11 ? 0 : cell.month;
    const y = cell.month < 0 ? cell.year - 1 : cell.month > 11 ? cell.year + 1 : cell.year;
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`;
  }

  const DOW_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Day of week headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {DOW_LABELS.map((d) => (
          <div key={d} className="px-2 py-2 text-center text-xs font-medium text-text-secondary">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {rows.map((row, ri) => (
        <div key={ri} className="grid grid-cols-7 border-b border-border" style={{ minHeight: "100px" }}>
          {row.map((cell, ci) => {
            const ds = dateStr(cell);
            const isToday = ds === todayStr;
            const dayAppts = appointments.filter((a) => a.date === ds);

            return (
              <div
                key={ci}
                className={`border-r border-border p-1 last:border-r-0 ${!cell.isCurrentMonth ? "bg-gray-50/50" : ""}`}
              >
                <div
                  className={`mb-1 text-sm ${
                    isToday
                      ? "inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary font-bold text-white"
                      : cell.isCurrentMonth
                        ? "font-medium text-text"
                        : "text-text-secondary/40"
                  }`}
                >
                  {cell.day}
                </div>
                <div className="space-y-0.5">
                  {dayAppts.slice(0, 3).map((appt) => (
                    <div
                      key={appt.id}
                      className="cursor-pointer truncate rounded px-1 py-0.5 text-[10px] font-medium text-white"
                      style={{ backgroundColor: appt.practitionerColor }}
                      onClick={() => onApptClick(appt)}
                    >
                      {appt.startTime.replace(/^0/, "")} {appt.clientName}
                    </div>
                  ))}
                  {dayAppts.length > 3 && (
                    <div className="px-1 text-[10px] text-text-secondary">+{dayAppts.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
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
  const mins = eh * 60 + em - (sh * 60 + sm);
  if (mins <= 0) return "45 mins";
  return `${mins} minutes`;
}

function ToggleRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-5 w-9 rounded-full bg-gray-200 p-0.5">
        <div className="h-4 w-4 rounded-full bg-white shadow" />
      </div>
      <span className="text-sm text-text">{label}</span>
    </div>
  );
}

function formatDateLong(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}
