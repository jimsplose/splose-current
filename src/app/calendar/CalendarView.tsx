"use client";

import { useState, useRef, useEffect } from "react";
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
  Ban,
  ChevronDown,
} from "lucide-react";

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

// Hours from 7am to 6pm (matching the reference)
const HOURS = Array.from({ length: 12 }, (_, i) => i + 7);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatHourLabel(hour: number): string {
  if (hour === 12) return "12 PM";
  if (hour > 12) return `${hour - 12} PM`;
  return `${hour} AM`;
}

function formatTime12(timeStr: string): string {
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "pm" : "am";
  const hr = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hr}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function calcDuration(start: string, end: string): string {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  if (mins <= 0) return "45 mins";
  return `${mins} minutes`;
}

function calcDurationShort(start: string, end: string): string {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  if (mins <= 0) return "45 mins";
  return `${mins} mins`;
}

function formatDateLong(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatDateFull(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Calculate the top offset and height based on time
function getAppointmentPosition(startTime: string, endTime: string) {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;
  const firstHour = 7; // starting hour
  const pixelsPerHour = 60;
  const top = ((startMinutes - firstHour * 60) / 60) * pixelsPerHour;
  const height = Math.max(((endMinutes - startMinutes) / 60) * pixelsPerHour, 20);
  return { top, height };
}

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
  const [cellPopover, setCellPopover] = useState<{
    dateStr: string;
    hour: number;
    half: boolean;
    x: number;
    y: number;
  } | null>(null);
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const viewDropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const monthYear = today.toLocaleDateString("en-AU", {
    month: "long",
    year: "numeric",
  });

  // Auto-scroll to ~8am on mount
  useEffect(() => {
    if (scrollRef.current) {
      // 8am is 1 hour from start (7am), each hour is 60px
      scrollRef.current.scrollTop = 60;
    }
  }, []);

  // Close popover on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setCellPopover(null);
      }
      if (viewDropdownRef.current && !viewDropdownRef.current.contains(e.target as Node)) {
        setViewDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleCellClick(
    e: React.MouseEvent,
    dateStr: string,
    hour: number,
    half: boolean
  ) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setCellPopover({
      dateStr,
      hour,
      half,
      x: rect.left + rect.width / 2,
      y: half ? rect.top + rect.height / 2 + 30 : rect.top + 30,
    });
  }

  function handlePopoverAction(action: string) {
    if (!cellPopover) return;
    const { hour, half, dateStr } = cellPopover;
    const minutes = half ? 30 : 0;
    const h = hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? "pm" : "am";
    setCreateTime(
      `${h}:${minutes.toString().padStart(2, "0")}${ampm}`
    );
    setCreateDate(dateStr);
    setCellPopover(null);
    if (action === "appointment") {
      setShowCreateModal(true);
    }
  }

  function getPopoverTimeLabel() {
    if (!cellPopover) return "";
    const { hour, half } = cellPopover;
    const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const ampm = hour >= 12 ? "pm" : "am";
    const minutes = half ? "30" : "00";
    return `${h}:${minutes} ${ampm}`;
  }

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      <div className="flex flex-1 flex-col min-w-0">
        {/* Calendar toolbar - matches reference */}
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
              Today
            </button>
            <div className="flex items-center gap-0.5">
              <button className="rounded p-1 hover:bg-gray-100">
                <ChevronLeft className="h-4 w-4 text-text-secondary" />
              </button>
              <button className="rounded p-1 hover:bg-gray-100">
                <ChevronRight className="h-4 w-4 text-text-secondary" />
              </button>
            </div>
            <h2 className="text-lg font-semibold text-text">{monthYear}</h2>
            <div className="flex items-center gap-1.5 ml-2 text-text-secondary">
              <button className="rounded p-1.5 hover:bg-gray-100">
                <Filter className="h-4 w-4" />
              </button>
              <button className="rounded p-1.5 hover:bg-gray-100">
                <Settings2 className="h-4 w-4" />
              </button>
              <button className="rounded p-1.5 hover:bg-gray-100">
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button className="rounded p-1.5 hover:bg-gray-100">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Location pill */}
            <button className="flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
              <MapPin className="h-3.5 w-3.5 text-text-secondary" />
              <span className="truncate max-w-[120px]">Hands Togeth...</span>
            </button>
            {/* Practitioners pill */}
            <button className="flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
              <User className="h-3.5 w-3.5 text-text-secondary" />
              <span>Practitioners({practitioners.length})</span>
            </button>
            {/* Add button */}
            <button className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white hover:bg-primary-dark">
              <Plus className="h-4 w-4" />
            </button>
            {/* Calendar dropdown */}
            <button className="flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
              Calendar
              <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
            </button>
            {/* Week dropdown */}
            <div className="relative" ref={viewDropdownRef}>
              <button
                onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
                className="flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50"
              >
                Week
                <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
              </button>
              {viewDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 w-28 rounded-lg border border-border bg-white shadow-lg py-1">
                  <button className="w-full px-3 py-1.5 text-left text-sm text-text-secondary hover:bg-gray-50">
                    Month
                  </button>
                  <button className="w-full px-3 py-1.5 text-left text-sm font-medium text-text bg-gray-50">
                    Week
                  </button>
                  <button className="w-full px-3 py-1.5 text-left text-sm text-text-secondary hover:bg-gray-50">
                    Day
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Week header */}
        <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-border">
          <div className="border-r border-border" />
          {weekDates.map((dateStr, i) => {
            const date = new Date(dateStr + "T00:00:00");
            const isToday = dateStr === todayStr;
            return (
              <div
                key={i}
                className={`border-r border-border px-2 py-2 text-center last:border-r-0 ${
                  isToday ? "bg-purple-50" : ""
                }`}
              >
                <div className="text-xs font-medium text-text-secondary uppercase">
                  {DAYS[i]}
                </div>
                <div
                  className={`text-xl font-semibold ${
                    isToday ? "text-primary" : "text-text"
                  }`}
                >
                  {date.getDate()}
                </div>
                <div className="mt-0.5 text-[10px] text-text-secondary truncate">
                  Hands Together Therap...
                </div>
                <div className="flex justify-center gap-2 text-[10px] text-text-secondary">
                  {practitioners.map((p) => (
                    <span key={p.id} className="truncate">
                      {p.name.split(" ")[0]}{" "}
                      {p.name.split(" ")[1]?.[0]
                        ? p.name.split(" ")[1][0] + "..."
                        : ""}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="flex-1 overflow-y-auto relative" ref={scrollRef}>
          <div className="relative">
            {/* Hour rows */}
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="grid grid-cols-[56px_repeat(7,1fr)]"
                style={{ height: "60px" }}
              >
                {/* Time label */}
                <div className="relative border-r border-border">
                  <span className="absolute -top-2.5 right-2 text-[11px] text-text-secondary">
                    {formatHourLabel(hour)}
                  </span>
                </div>
                {/* Day cells */}
                {weekDates.map((dateStr, dayIdx) => {
                  const isToday = dateStr === todayStr;
                  return (
                    <div
                      key={dayIdx}
                      className={`border-r border-b border-border last:border-r-0 ${
                        isToday ? "bg-purple-50/30" : ""
                      }`}
                    >
                      {/* Top half (on the hour) */}
                      <div
                        className="h-[30px] border-b border-dashed border-gray-200 cursor-pointer hover:bg-gray-50/60"
                        onClick={(e) => handleCellClick(e, dateStr, hour, false)}
                      />
                      {/* Bottom half (half past) */}
                      <div
                        className="h-[30px] cursor-pointer hover:bg-gray-50/60"
                        onClick={(e) => handleCellClick(e, dateStr, hour, true)}
                      />
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Appointment blocks overlaid on the grid */}
            <div
              className="absolute top-0 left-[56px] right-0 pointer-events-none"
              style={{ height: `${HOURS.length * 60}px` }}
            >
              <div className="relative h-full grid grid-cols-7">
                {weekDates.map((dateStr, dayIdx) => {
                  const dayAppts = appointments.filter(
                    (a) => a.date === dateStr
                  );
                  return (
                    <div key={dayIdx} className="relative">
                      {dayAppts.map((appt) => {
                        const { top, height } = getAppointmentPosition(
                          appt.startTime,
                          appt.endTime
                        );
                        return (
                          <div
                            key={appt.id}
                            className="absolute left-1 right-1 rounded px-1.5 py-1 text-white shadow-sm pointer-events-auto cursor-pointer overflow-hidden"
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                              backgroundColor: appt.practitionerColor,
                              opacity:
                                appt.status === "Cancelled" ? 0.5 : 1,
                            }}
                            onClick={() => {
                              setSelectedAppt(appt);
                              setCellPopover(null);
                            }}
                          >
                            <p className="text-xs font-medium truncate leading-tight">
                              {appt.clientName}
                            </p>
                            <p className="text-[10px] opacity-90 leading-tight">
                              {formatTime12(appt.startTime)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cell click popover */}
          {cellPopover && (
            <div
              ref={popoverRef}
              className="fixed z-50"
              style={{
                left: `${cellPopover.x - 100}px`,
                top: `${cellPopover.y}px`,
              }}
            >
              <div className="w-[200px] rounded-xl bg-white shadow-xl border border-border py-2">
                <div className="px-4 py-2">
                  <span className="text-base font-bold text-text">
                    {getPopoverTimeLabel()}
                  </span>
                </div>
                <button
                  onClick={() => handlePopoverAction("support")}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-text hover:bg-gray-50"
                >
                  <Clock className="h-4 w-4 text-text-secondary" />
                  Support activity
                </button>
                <button
                  onClick={() => handlePopoverAction("busy")}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-text hover:bg-gray-50"
                >
                  <Ban className="h-4 w-4 text-text-secondary" />
                  Busy time
                </button>
                <button
                  onClick={() => handlePopoverAction("appointment")}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-text hover:bg-gray-50"
                >
                  <Calendar className="h-4 w-4 text-text-secondary" />
                  Appointment
                </button>
              </div>
              {/* Triangle pointer */}
              <div className="flex justify-center -mt-px">
                <div className="w-3 h-3 bg-white border-b border-r border-border rotate-45 -translate-y-1.5 shadow-sm" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appointment detail flyout - matches reference */}
      {selectedAppt && (
        <div className="w-80 shrink-0 border-l border-border bg-white overflow-y-auto">
          <div className="p-4">
            {/* Header with duration and close */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: selectedAppt.practitionerColor }}
                />
                <span className="text-sm font-medium text-text">
                  {calcDurationShort(
                    selectedAppt.startTime,
                    selectedAppt.endTime
                  )}{" "}
                  ({selectedAppt.type})
                </span>
              </div>
              <button
                onClick={() => setSelectedAppt(null)}
                className="rounded p-1 hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-text-secondary" />
              </button>
            </div>

            {/* Detail rows */}
            <div className="space-y-3 text-sm">
              {/* Practitioner at Location */}
              <div className="flex items-start gap-2">
                <Settings2 className="h-4 w-4 text-text-secondary mt-0.5 shrink-0" />
                <div>
                  <span className="text-text">
                    {selectedAppt.practitionerName}
                  </span>
                  <span className="text-text-secondary"> at </span>
                  <span className="text-text font-medium">
                    Hands Together Therapy (East)
                  </span>
                </div>
              </div>

              {/* Practitioner */}
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-text-secondary mt-0.5 shrink-0" />
                <span className="text-text">
                  {selectedAppt.practitionerName}
                </span>
              </div>

              {/* Date and time */}
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-text-secondary mt-0.5 shrink-0" />
                <span className="text-text">
                  {formatTime12(selectedAppt.startTime)},{" "}
                  {formatDateLong(selectedAppt.date)} for{" "}
                  {calcDuration(selectedAppt.startTime, selectedAppt.endTime)}
                </span>
              </div>

              {/* Client name */}
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-primary cursor-pointer hover:underline">
                  {selectedAppt.clientName}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-text-secondary mt-0.5 shrink-0" />
                <div className="flex items-center gap-1">
                  <span className="text-text-secondary">
                    {selectedAppt.status || "No status"}
                  </span>
                  <ChevronDown className="h-3 w-3 text-text-secondary" />
                </div>
              </div>

              {/* Invoice */}
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <span className="text-primary cursor-pointer hover:underline">
                    Add invoice
                  </span>
                  <span className="text-text-secondary mx-1">Mark as</span>
                  <span className="text-primary cursor-pointer hover:underline">
                    Do not invoice?
                  </span>
                </div>
              </div>

              {/* Progress note */}
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-primary cursor-pointer hover:underline">
                  Add progress note
                </span>
              </div>

              {/* Organiser */}
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-text-secondary mt-0.5 shrink-0" />
                <div>
                  <span className="text-text-secondary">David Brookso</span>
                  <span className="text-text-secondary ml-1">(Organiser)</span>
                </div>
              </div>

              {/* Note field */}
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-text-secondary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs text-text-secondary">Note</span>
                    <span className="text-text-secondary text-xs">&#9432;</span>
                  </div>
                  <textarea
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary resize-none"
                    rows={3}
                    placeholder="Add a note..."
                  />
                </div>
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
              <button className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100">
                Archive
              </button>
            </div>

            <div className="mt-3 text-center">
              <button className="text-sm text-primary hover:underline">
                View change log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create appointment modal - matches reference */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-12 overflow-y-auto pb-12">
          <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-lg font-semibold text-text">
                Create appointment
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-text-secondary" />
              </button>
            </div>
            <div className="space-y-4 px-6 pb-4">
              <ModalField
                label="Location"
                value="Hands Together Therapy (East)"
              />
              <ModalField
                label="Practitioner"
                value={practitioners[0]?.name || "Delvin khor"}
              />
              <ModalField
                label="Client"
                placeholder="Start typing to search client"
              />

              {/* Waitlist matches */}
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="text-sm text-text">2 waitlist matches</span>
                <ChevronRight className="ml-auto h-4 w-4 text-text-secondary" />
              </div>

              <ModalField label="Service" placeholder="Choose a service" />
              <ModalField label="Case" placeholder="Choose a case" />

              <div>
                <label className="text-sm text-text-secondary">Date *</label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text">
                    {formatDateFull(createDate)}
                  </div>
                  <button className="rounded p-1 text-text-secondary hover:bg-gray-100">
                    <Calendar className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
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

              <ModalField
                label="Room/Resource"
                placeholder="Choose a room/resource"
              />

              {/* Repeat toggle */}
              <div className="flex items-center gap-2">
                <div className="h-5 w-9 rounded-full bg-gray-200 p-0.5 cursor-pointer">
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

function ModalField({
  label,
  value,
  placeholder,
}: {
  label: string;
  value?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm text-text-secondary">{label} *</label>
      <div className="mt-1 flex items-center justify-between rounded-lg border border-border bg-white px-3 py-2 text-sm text-text">
        {value || (
          <span className="text-text-secondary">{placeholder}</span>
        )}
        <ChevronDown className="h-3.5 w-3.5 text-text-secondary shrink-0" />
      </div>
    </div>
  );
}
