"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Filter,
  Settings2,
  LayoutGrid,
  X,
  Clock,
  User,
  Users,
  MapPin,
  FileText,
  Calendar,
  Plus,
  Video,
  Monitor,
  UserPlus,
  Ban,
  Mail,
  Repeat,
  History,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button, Badge, FormInput, FormSelect, Modal, Toggle, Avatar } from "@/components/ds";

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

type PopoverState = {
  visible: boolean;
  x: number;
  y: number;
  time: string;
  hour: number;
  minute: number;
  dateStr: string;
  practitionerName: string;
  practitionerId: string;
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

function formatTimeShort(hour: number, minute: number): string {
  const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const ampm = hour >= 12 ? "pm" : "am";
  const mm = minute === 0 ? "" : `:${minute.toString().padStart(2, "0")}`;
  return `${h12}${mm} ${ampm}`;
}

function isGroupAppointment(appt: Appointment): boolean {
  const t = appt.type.toLowerCase();
  return t.includes("group");
}

function isDateInPast(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + "T00:00:00");
  return d < today;
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
  const [createService, setCreateService] = useState("");
  const [createType, setCreateType] = useState("Initial Assessment");
  const [createCase, setCreateCase] = useState("");
  const [createLocation, setCreateLocation] = useState("Hands Together Therapy (East)");
  const [createRoom, setCreateRoom] = useState("");
  const [createRepeat, setCreateRepeat] = useState(false);
  const [createProviderTravel, setCreateProviderTravel] = useState(false);
  const [createProviderTravelNonLabour, setCreateProviderTravelNonLabour] = useState(false);
  const [createActivityTransport, setCreateActivityTransport] = useState(false);
  const [createNotes, setCreateNotes] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("Week");
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("Calendar");
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [showCalendarModeDropdown, setShowCalendarModeDropdown] = useState(false);
  const [bookingForFilter, setBookingForFilter] = useState<string | null>("a a");
  const [popover, setPopover] = useState<PopoverState>({
    visible: false,
    x: 0,
    y: 0,
    time: "",
    hour: 0,
    minute: 0,
    dateStr: "",
    practitionerName: "",
    practitionerId: "",
  });
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopover((prev) => ({ ...prev, visible: false }));
      }
    }
    if (popover.visible) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [popover.visible]);

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
  const monthYear = today.toLocaleDateString("en-AU", { month: "short", year: "numeric" });

  function openCreateModal(dateStr?: string, hour?: number, minute?: number, practitionerId?: string) {
    const m = minute ?? 0;
    if (dateStr && hour !== undefined) {
      setCreateDate(dateStr);
      setCreateTime(formatTime24to12(hour, m));
      // Default 30 min appointment
      const endMinute = m + 30;
      const endHour = hour + Math.floor(endMinute / 60);
      setCreateEndTime(formatTime24to12(endHour, endMinute % 60));
    } else {
      const now = new Date();
      const currentHour = now.getHours();
      setCreateDate(todayStr);
      setCreateTime(formatTime24to12(currentHour, 0));
      setCreateEndTime(formatTime24to12(currentHour + 1, 0));
    }
    setCreateClient("");
    setCreatePractitioner(practitionerId || practitioners[0]?.id || "");
    setCreateService("");
    setCreateCase("");
    setCreateLocation("Hands Together Therapy (East)");
    setCreateRoom("");
    setCreateRepeat(false);
    setCreateProviderTravel(false);
    setCreateProviderTravelNonLabour(false);
    setCreateActivityTransport(false);
    setCreateNotes("");
    setPopover((prev) => ({ ...prev, visible: false }));
    setShowCreateModal(true);
  }

  function handleDayCellClick(
    e: React.MouseEvent<HTMLDivElement>,
    dateStr: string,
    hour: number,
    prac: Practitioner,
  ) {
    // Calculate minute from click position within the cell
    const rect = e.currentTarget.getBoundingClientRect();
    const yOffset = e.clientY - rect.top;
    const minuteFraction = yOffset / HOUR_HEIGHT;
    const minute = Math.floor(minuteFraction * 60 / 30) * 30; // snap to 30-min
    const clampedMinute = Math.min(minute, 30);

    const timeLabel = formatTimeShort(hour, clampedMinute);

    // Position popover near click
    setPopover({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      time: timeLabel,
      hour,
      minute: clampedMinute,
      dateStr,
      practitionerName: prac.name,
      practitionerId: prac.id,
    });
  }

  function handleCellClick(
    e: React.MouseEvent<HTMLDivElement>,
    dateStr: string,
    hour: number,
  ) {
    const rect = e.currentTarget.getBoundingClientRect();
    const yOffset = e.clientY - rect.top;
    const minuteFraction = yOffset / HOUR_HEIGHT;
    const minute = Math.floor(minuteFraction * 60 / 30) * 30;
    const clampedMinute = Math.min(minute, 30);
    const timeLabel = formatTimeShort(hour, clampedMinute);

    setPopover({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      time: timeLabel,
      hour,
      minute: clampedMinute,
      dateStr,
      practitionerName: "",
      practitionerId: "",
    });
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
            <h2 className="text-xl font-bold text-text">{monthYear}</h2>
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
                <MapPin className="h-4 w-4" />
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

            {/* Booking-for filter pill */}
            {bookingForFilter && (
              <span className="hidden items-center gap-1.5 rounded-full border border-yellow-300 bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 sm:inline-flex">
                Booking for <strong>{bookingForFilter}</strong>
                <button
                  onClick={() => setBookingForFilter(null)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-yellow-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

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

        {/* Day view — one column per practitioner */}
        {viewMode === "Day" && (
          <>
            <div className="overflow-x-auto">
              <div
                className="grid min-w-[700px] border-b border-border"
                style={{ gridTemplateColumns: `60px repeat(${practitioners.length}, 1fr)` }}
              >
                {/* Top-left corner: empty */}
                <div className="border-r border-border" />
                {/* Day + date header spanning all practitioner columns */}
                <div
                  className="border-b border-border py-2 text-center"
                  style={{ gridColumn: `2 / span ${practitioners.length}` }}
                >
                  <div className="text-xs text-text-secondary">
                    {DAYS[new Date(weekDates.find((d) => d === todayStr) || weekDates[0] + "T00:00:00").getDay()]}
                  </div>
                  <div className="text-lg font-semibold text-primary">
                    {new Date((weekDates.find((d) => d === todayStr) || weekDates[0]) + "T00:00:00").getDate()}
                  </div>
                  <div className="text-[10px] text-text-secondary">East Clinics</div>
                </div>
              </div>
              {/* Practitioner name headers */}
              <div
                className="grid min-w-[700px] border-b border-border"
                style={{ gridTemplateColumns: `60px repeat(${practitioners.length}, 1fr)` }}
              >
                <div className="border-r border-border" />
                {practitioners.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`border-r border-border px-1 py-1.5 text-center last:border-r-0`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="truncate text-xs font-medium text-text">
                        {p.name.split(" ")[0]} {p.name.split(" ")[1]?.[0]}.
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time grid — Day view */}
            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <div
                className="grid min-w-[700px]"
                style={{ gridTemplateColumns: `60px repeat(${practitioners.length}, 1fr)` }}
              >
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
                    {practitioners.map((prac) => {
                      const currentDay = weekDates.find((d) => d === todayStr) || weekDates[0];
                      const hourAppts = appointments.filter(
                        (a) =>
                          a.date === currentDay &&
                          a.practitionerName === prac.name &&
                          parseInt(a.startTime.split(":")[0]) === hour,
                      );
                      return (
                        <div
                          key={prac.id}
                          className="relative cursor-pointer border-r border-b border-border bg-purple-50/30 last:border-r-0 hover:bg-gray-100/50"
                          style={{ height: `${HOUR_HEIGHT}px` }}
                          onClick={(e) => handleDayCellClick(e, currentDay, hour, prac)}
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

        {/* Week view — day columns with practitioner sub-columns */}
        {viewMode === "Week" && (
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
                      className={`border-r border-border px-1 py-2 text-center last:border-r-0 ${isToday ? "bg-purple-50" : ""}`}
                    >
                      <div className="text-xs text-text-secondary">{DAYS[i]}</div>
                      <div className={`text-lg font-semibold ${isToday ? "text-primary" : "text-text"}`}>
                        {date.getDate()}
                      </div>
                      <div className="mt-0.5 truncate text-[10px] text-text-secondary">Hands Togeth...</div>
                      {/* Practitioner sub-column headers */}
                      <div className="mt-0.5 flex justify-center gap-px">
                        {practitioners.map((p) => (
                          <div key={p.id} className="flex min-w-0 flex-1 flex-col items-center">
                            <div className="mb-0.5 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                            <span className="w-full truncate text-[9px] leading-tight text-text-secondary">
                              {p.name.split(" ")[0].length > 5 ? p.name.split(" ")[0].slice(0, 5) + "..." : p.name.split(" ")[0]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time grid — Week view with practitioner sub-columns */}
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
                      return (
                        <div
                          key={dayIdx}
                          className={`relative border-r border-b border-border last:border-r-0 ${isToday ? "bg-purple-50/30" : ""}`}
                          style={{ height: `${HOUR_HEIGHT}px` }}
                        >
                          {/* Practitioner sub-columns inside each day cell */}
                          <div className="absolute inset-0 flex">
                            {practitioners.map((prac, pIdx) => {
                              const hourAppts = appointments.filter(
                                (a) =>
                                  a.date === dateStr &&
                                  a.practitionerName === prac.name &&
                                  parseInt(a.startTime.split(":")[0]) === hour,
                              );
                              return (
                                <div
                                  key={prac.id}
                                  className={`relative flex-1 cursor-pointer hover:bg-gray-100/50 ${pIdx < practitioners.length - 1 ? "border-r border-border/30" : ""}`}
                                  onClick={(e) => handleCellClick(e, dateStr, hour)}
                                >
                                  {hourAppts.map((appt) => {
                                    const pos = getApptStyle(appt);
                                    return (
                                      <div
                                        key={appt.id}
                                        className="absolute inset-x-0.5 z-10 cursor-pointer overflow-hidden rounded px-1 py-0.5 text-white shadow-sm"
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
                                        <p className="truncate text-[9px] font-medium leading-tight">{appt.clientName}</p>
                                        <p className="text-[8px] opacity-80">
                                          {appt.startTime.replace(/^0/, "")}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
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

      {/* Click-to-create popover */}
      {popover.visible && (
        <div
          ref={popoverRef}
          className="fixed z-30 w-52 rounded-lg border border-border bg-white shadow-lg"
          style={{
            left: `${popover.x - 104}px`,
            top: `${popover.y - 180}px`,
          }}
        >
          <div className="px-3 pt-3 pb-1">
            <p className="text-sm font-semibold text-text">{popover.time}</p>
          </div>
          <div className="py-1">
            <button
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-text hover:bg-gray-50"
              onClick={() => {
                setPopover((prev) => ({ ...prev, visible: false }));
                // Support activity - just close for now
              }}
            >
              <Clock className="h-4 w-4 text-text-secondary" />
              Support activity
            </button>
            <button
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-text hover:bg-gray-50"
              onClick={() => {
                setPopover((prev) => ({ ...prev, visible: false }));
                // Busy time - just close for now
              }}
            >
              <Ban className="h-4 w-4 text-text-secondary" />
              Busy time
            </button>
            <button
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-text hover:bg-gray-50"
              onClick={() => {
                openCreateModal(popover.dateStr, popover.hour, popover.minute, popover.practitionerId);
              }}
            >
              <Calendar className="h-4 w-4 text-text-secondary" />
              Appointment
            </button>
          </div>
          {/* Downward arrow */}
          <div className="flex justify-center pb-0">
            <div className="h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-white drop-shadow-sm" />
          </div>
        </div>
      )}

      {/* Appointment detail side panel */}
      {selectedAppt && (
        <AppointmentSidePanel
          appt={selectedAppt}
          onClose={() => setSelectedAppt(null)}
          onEdit={() => setShowEditModal(true)}
          isMonthView={viewMode === "Month"}
        />
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
              {/* Past date warning */}
              {createDate && isDateInPast(createDate) && (
                <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2.5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    This appointment is in the past. Are you sure you want to create it?
                  </p>
                </div>
              )}

              {/* Location */}
              <FormSelect
                label="Location"
                value={createLocation}
                onChange={(e) => setCreateLocation(e.target.value)}
                options={[
                  { value: "Hands Together Therapy (East)", label: "Hands Together Therapy (East)" },
                  { value: "Hands Together Therapy (West)", label: "Hands Together Therapy (West)" },
                ]}
              />

              {/* Practitioner */}
              <FormSelect
                label="Practitioner *"
                value={createPractitioner}
                onChange={(e) => setCreatePractitioner(e.target.value)}
                options={practitioners.map((p) => ({
                  value: p.id,
                  label: p.name,
                }))}
              />

              {/* Client */}
              <FormInput
                label="Client *"
                type="text"
                value={createClient}
                onChange={(e) => setCreateClient(e.target.value)}
                placeholder="Start typing to search client..."
              />

              {/* Service */}
              <FormSelect
                label="Service *"
                value={createService}
                onChange={(e) => setCreateService(e.target.value)}
                options={[
                  { value: "", label: "Select a service" },
                  { value: "initial-assessment", label: "Initial Assessment" },
                  { value: "follow-up", label: "Follow Up" },
                  { value: "review", label: "Review" },
                  { value: "group-session", label: "Group Session" },
                  { value: "targeted-services", label: "Targeted Services (Goodstart)" },
                  { value: "capacity-building", label: "Capacity Building" },
                ]}
              />

              {/* Case */}
              <FormSelect
                label="Case"
                value={createCase}
                onChange={(e) => setCreateCase(e.target.value)}
                options={[
                  { value: "", label: "Choose a case" },
                ]}
              />

              {/* Date */}
              <FormInput
                label="Date *"
                type="date"
                value={createDate}
                onChange={(e) => setCreateDate(e.target.value)}
              />

              {/* Start / End time */}
              <div className="grid grid-cols-2 gap-3">
                <FormSelect
                  label="Start time *"
                  value={createTime}
                  onChange={(e) => setCreateTime(e.target.value)}
                  options={TIME_OPTIONS.map((t) => ({ value: t, label: t }))}
                />
                <FormSelect
                  label="End time *"
                  value={createEndTime}
                  onChange={(e) => setCreateEndTime(e.target.value)}
                  options={TIME_OPTIONS.map((t) => ({ value: t, label: t }))}
                />
              </div>

              {/* Room/Resource */}
              <FormSelect
                label="Room/Resource"
                value={createRoom}
                onChange={(e) => setCreateRoom(e.target.value)}
                options={[
                  { value: "", label: "Choose a room/resource" },
                  { value: "green", label: "Green (1 available of 1)" },
                  { value: "red", label: "Red (1 available of 1)" },
                  { value: "blue", label: "Blue (2 available of 2)" },
                  { value: "room1", label: "Room 1 (1 available of 1)" },
                ]}
              />

              {/* Toggles */}
              <Toggle
                checked={createProviderTravel}
                onChange={setCreateProviderTravel}
                label="Provider travel"
              />
              <Toggle
                checked={createProviderTravelNonLabour}
                onChange={setCreateProviderTravelNonLabour}
                label="Provider Travel - Non-Labour Costs"
              />
              <Toggle
                checked={createActivityTransport}
                onChange={setCreateActivityTransport}
                label="Activity Based Transport"
              />
              <Toggle
                checked={createRepeat}
                onChange={setCreateRepeat}
                label="Repeat"
              />

              {createRepeat && (
                <div className="space-y-3 rounded-lg border border-border bg-gray-50 p-4">
                  <FormSelect
                    label="Repeat"
                    options={[
                      { value: "weekly", label: "Every week" },
                      { value: "2weeks", label: "Every 2 weeks" },
                      { value: "3weeks", label: "Every 3 weeks" },
                      { value: "4weeks", label: "Every 4 weeks" },
                    ]}
                  />
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
                  <FormSelect
                    label="Ends"
                    options={[
                      { value: "6", label: "After 6 times" },
                      { value: "4", label: "After 4 times" },
                      { value: "8", label: "After 8 times" },
                      { value: "12", label: "After 12 times" },
                      { value: "date", label: "On date" },
                    ]}
                  />
                </div>
              )}

              {/* Waitlist matches */}
              <div className="rounded-lg border border-border bg-gray-50 p-3">
                <button className="flex w-full items-center justify-between text-sm font-medium text-text">
                  Waitlist matches (2)
                  <ChevronDown className="h-4 w-4 text-text-secondary" />
                </button>
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
              {/* Info banner */}
              <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <p className="text-sm text-blue-800">
                  Client won&apos;t be notified of changes. To do this, use Reschedule.
                </p>
              </div>

              {/* Location */}
              <FormSelect
                label="Location"
                defaultValue="Hands Together Therapy (East)"
                options={[
                  { value: "Hands Together Therapy (East)", label: "Hands Together Therapy (East)" },
                  { value: "Hands Together Therapy (West)", label: "Hands Together Therapy (West)" },
                ]}
              />

              {/* Practitioner */}
              <FormSelect
                label="Practitioner *"
                defaultValue={selectedAppt.practitionerName}
                options={practitioners.map((p) => ({
                  value: p.name,
                  label: p.name,
                }))}
              />

              {/* Client */}
              <FormInput
                label="Client *"
                type="text"
                defaultValue={selectedAppt.clientName}
              />

              {/* Service */}
              <FormInput
                label="Service *"
                type="text"
                defaultValue={selectedAppt.type}
              />

              {/* Case */}
              <FormSelect
                label="Case"
                options={[
                  { value: "", label: "Choose a case" },
                ]}
              />

              {/* Date */}
              <FormInput
                label="Date *"
                type="date"
                defaultValue={selectedAppt.date}
              />

              {/* Time */}
              <div className="grid grid-cols-2 gap-3">
                <FormSelect
                  label="Time *"
                  defaultValue={selectedAppt.startTime}
                  options={TIME_OPTIONS.map((t) => ({ value: t, label: t }))}
                />
                <FormSelect
                  label="&nbsp;"
                  defaultValue={selectedAppt.endTime}
                  options={TIME_OPTIONS.map((t) => ({ value: t, label: t }))}
                />
              </div>

              {/* Room/Resource */}
              <FormSelect
                label="Room/Resource"
                value={editRoom}
                onChange={(e) => setEditRoom(e.target.value)}
                options={[
                  { value: "", label: "Choose a room/resource" },
                  { value: "green", label: "Green (1 available of 1)" },
                  { value: "red", label: "Red (1 available of 1)" },
                  { value: "blue", label: "Blue (2 available of 2)" },
                  { value: "car", label: "Car (1 available of 1)" },
                  { value: "room1", label: "Room 1 (1 available of 1)" },
                ]}
              />

              {/* Repeat toggle */}
              <Toggle
                checked={editRepeat}
                onChange={setEditRepeat}
                label="Repeat"
              />

              {editRepeat && (
                <div className="space-y-3 rounded-lg border border-border bg-gray-50 p-4">
                  <FormSelect
                    label="Repeat"
                    options={[
                      { value: "2weeks", label: "Every 2 weeks" },
                      { value: "weekly", label: "Every week" },
                      { value: "3weeks", label: "Every 3 weeks" },
                      { value: "4weeks", label: "Every 4 weeks" },
                    ]}
                  />
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
                  <FormSelect
                    label="Ends"
                    options={[
                      { value: "6", label: "After 6 times" },
                      { value: "4", label: "After 4 times" },
                      { value: "8", label: "After 8 times" },
                      { value: "12", label: "After 12 times" },
                      { value: "date", label: "On date" },
                    ]}
                  />
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
                  {dayAppts.slice(0, 3).map((appt) => {
                    const isCancelled = appt.status === "Cancelled";
                    const isGroup = appt.type === "Group Session";
                    return (
                      <div
                        key={appt.id}
                        className={`flex cursor-pointer items-center gap-0.5 rounded px-1 py-0.5 text-[10px] font-medium text-white ${isCancelled ? "opacity-60" : ""}`}
                        style={{ backgroundColor: appt.practitionerColor }}
                        onClick={() => onApptClick(appt)}
                      >
                        <span className="truncate">
                          {appt.startTime.replace(/^0/, "")} {appt.clientName}
                        </span>
                        {isCancelled && (
                          <span className="ml-auto flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm bg-red-500">
                            <X className="h-2.5 w-2.5 text-white" />
                          </span>
                        )}
                        {isGroup && !isCancelled && (
                          <span className="ml-auto shrink-0 rounded bg-white/30 px-1 text-[9px] font-semibold">
                            0/10
                          </span>
                        )}
                      </div>
                    );
                  })}
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

/* ─── Appointment Side Panel ──────────────────────────────────────── */

function AppointmentSidePanel({
  appt,
  onClose,
  onEdit,
  isMonthView,
}: {
  appt: Appointment;
  onClose: () => void;
  onEdit: () => void;
  isMonthView: boolean;
}) {
  const isGroup = isGroupAppointment(appt);

  // For month view, render as a slide-in overlay on the right
  const panelClasses = isMonthView
    ? "fixed right-0 top-0 z-30 h-full w-[420px] animate-in slide-in-from-right border-l border-border bg-white shadow-xl overflow-y-auto"
    : "animate-in slide-in-from-right absolute inset-0 z-20 w-full shrink-0 overflow-y-auto border-l border-border bg-white sm:relative sm:inset-auto sm:w-[420px]";

  return (
    <>
      {/* Backdrop for month view — very subtle so calendar stays visible */}
      {isMonthView && (
        <div className="fixed inset-0 z-20" onClick={onClose} />
      )}
      <div className={panelClasses}>
        <div className="p-4">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: appt.practitionerColor }} />
              <span className="text-sm font-semibold text-text">
                {appt.clientName} ({appt.type})
              </span>
            </div>
            <button onClick={onClose} className="rounded p-1 hover:bg-gray-100">
              <X className="h-4 w-4 text-text-secondary" />
            </button>
          </div>

          {/* Details */}
          {isGroup ? (
            <GroupAppointmentDetails appt={appt} />
          ) : (
            <SingleAppointmentDetails appt={appt} />
          )}

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {!isGroup && (
              <Button variant="secondary" size="sm">
                Book another
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={onEdit}>
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
            <button className="flex items-center justify-center gap-1 text-sm text-primary hover:underline mx-auto">
              <History className="h-3.5 w-3.5" />
              View change log
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function SingleAppointmentDetails({ appt }: { appt: Appointment }) {
  return (
    <div className="space-y-3 text-sm">
      {/* Location */}
      <div className="flex items-start gap-2">
        <MapPin className="mt-0.5 h-4 w-4 text-text-secondary" />
        <div>
          <span className="text-text">{appt.practitionerName}</span>
          <span className="text-text-secondary"> at </span>
          <span className="font-medium text-text">East Clinics</span>
        </div>
      </div>

      {/* Practitioner */}
      <div className="flex items-center gap-2">
        <Avatar name={appt.practitionerName} color={appt.practitionerColor} size="sm" />
        <span className="text-text">{appt.practitionerName}</span>
      </div>

      {/* Time */}
      <div className="flex items-start gap-2">
        <Clock className="mt-0.5 h-4 w-4 text-text-secondary" />
        <span className="text-text">
          {appt.startTime}, {formatDateLong(appt.date)} for{" "}
          {calcDuration(appt.startTime, appt.endTime)}
        </span>
      </div>

      {/* Client name link */}
      <div className="flex items-start gap-2">
        <User className="mt-0.5 h-4 w-4 text-primary" />
        <span className="cursor-pointer font-medium text-primary hover:underline">{appt.clientName}</span>
      </div>

      {/* Email */}
      <div className="flex items-start gap-2">
        <Mail className="mt-0.5 h-4 w-4 text-text-secondary" />
        <span className="text-text-secondary">thyxueen@gmail.com</span>
      </div>

      {/* Status */}
      <div className="flex items-start gap-2">
        <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-gray-300" />
        <span className="text-text-secondary">No status</span>
      </div>

      {/* Zoom link */}
      <div className="flex items-start gap-2">
        <Video className="mt-0.5 h-4 w-4 text-primary" />
        <span className="cursor-pointer text-primary hover:underline">Create zoom meeting</span>
      </div>

      {/* Invoice */}
      <div className="flex items-center gap-2">
        <FileText className="mt-0.5 h-4 w-4 text-primary" />
        <span className="cursor-pointer text-primary hover:underline">TRR-005673</span>
        <Badge variant="blue">Draft</Badge>
      </div>

      {/* Progress note */}
      <div className="flex items-start gap-2">
        <FileText className="mt-0.5 h-4 w-4 text-primary" />
        <span className="cursor-pointer text-primary hover:underline">Add progress note</span>
      </div>

      {/* Repeating info */}
      <div className="flex items-start gap-2">
        <Repeat className="mt-0.5 h-4 w-4 text-text-secondary" />
        <span className="text-xs text-text-secondary">Repeating every 2 weeks on Monday for 6 times</span>
      </div>

      {/* Organiser */}
      <div className="flex items-center gap-2">
        <Avatar name={appt.practitionerName} color={appt.practitionerColor} size="sm" />
        <span className="text-text-secondary">{appt.practitionerName} (Organiser)</span>
      </div>

      {/* Note field */}
      <div className="mt-4">
        <label className="flex items-center gap-1 text-xs font-medium text-text-secondary">
          <FileText className="h-3 w-3" /> Note
        </label>
        <textarea
          className="mt-1 w-full resize-none rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
          rows={3}
          placeholder="Add a note..."
        />
      </div>
    </div>
  );
}

function GroupAppointmentDetails({ appt }: { appt: Appointment }) {
  return (
    <div className="space-y-3 text-sm">
      {/* Location */}
      <div className="flex items-start gap-2">
        <MapPin className="mt-0.5 h-4 w-4 text-text-secondary" />
        <div>
          <span className="text-text">{appt.practitionerName}</span>
          <span className="text-text-secondary"> at </span>
          <span className="font-medium text-text">East Clinics</span>
        </div>
      </div>

      {/* Practitioner */}
      <div className="flex items-center gap-2">
        <Avatar name={appt.practitionerName} color={appt.practitionerColor} size="sm" />
        <span className="text-text">{appt.practitionerName}</span>
      </div>

      {/* Time */}
      <div className="flex items-start gap-2">
        <Clock className="mt-0.5 h-4 w-4 text-text-secondary" />
        <span className="text-text">
          {appt.startTime}, {formatDateLong(appt.date)} for{" "}
          {calcDuration(appt.startTime, appt.endTime)}
        </span>
      </div>

      {/* Zoom */}
      <div className="flex items-start gap-2">
        <Video className="mt-0.5 h-4 w-4 text-primary" />
        <span className="cursor-pointer text-primary hover:underline">Create zoom meeting</span>
      </div>

      {/* Teams */}
      <div className="flex items-start gap-2">
        <Monitor className="mt-0.5 h-4 w-4 text-primary" />
        <span className="cursor-pointer text-primary hover:underline">Create Microsoft Teams meeting</span>
      </div>

      {/* Attendees section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-text-secondary" />
          <span className="text-text-secondary">1 of 6 clients attending</span>
        </div>
        <Button variant="secondary" size="sm">
          <UserPlus className="h-3 w-3" /> Client
        </Button>
      </div>

      {/* Attendee list */}
      <div className="ml-6 space-y-1">
        <div className="flex items-center gap-2 text-text">
          <Avatar name="elsa frozen" size="sm" />
          <span>elsa frozen</span>
        </div>
      </div>

      {/* Organiser */}
      <div className="flex items-center gap-2">
        <Avatar name="Meghna Damodaran" color={appt.practitionerColor} size="sm" />
        <span className="text-text-secondary">Meghna Damodaran (Organiser)</span>
      </div>

      {/* Note field */}
      <div className="mt-4">
        <label className="flex items-center gap-1 text-xs font-medium text-text-secondary">
          <FileText className="h-3 w-3" /> Note
        </label>
        <textarea
          className="mt-1 w-full resize-none rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
          rows={3}
          placeholder="Add a note..."
        />
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

function formatDateLong(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}
