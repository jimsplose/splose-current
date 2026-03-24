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
  Command,
  Lightbulb,
  X,
  Clock,
  User,
  Users,
  MapPin,
  FileText,
  Calendar,
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
import { Button, Badge, Chip, FormInput, FormSelect, FormTextarea, Modal, Toggle, Avatar, ColorDot, Alert, Dropdown, Card, RadioGroup } from "@/components/ds";

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

/** Convert "HH:MM" to "h:mm am" format */
function formatTime12h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  const ampm = h >= 12 ? "pm" : "am";
  const mm = m === 0 ? "" : `:${m.toString().padStart(2, "0")}`;
  return `${h12}${mm} ${ampm}`;
}

/** Lighten a hex/rgb color for appointment block backgrounds */
function lightenColor(color: string, amount = 0.85): string {
  // Convert hex to RGB
  let r = 200, g = 200, b = 220;
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (color.startsWith("rgb")) {
    const match = color.match(/(\d+)/g);
    if (match) {
      r = parseInt(match[0]);
      g = parseInt(match[1]);
      b = parseInt(match[2]);
    }
  }
  // Lighten by mixing with white
  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);
  return `rgb(${lr}, ${lg}, ${lb})`;
}

/** Darken a color for text on light appointment backgrounds */
function darkenColor(color: string, amount = 0.4): string {
  let r = 100, g = 100, b = 120;
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (color.startsWith("rgb")) {
    const match = color.match(/(\d+)/g);
    if (match) {
      r = parseInt(match[0]);
      g = parseInt(match[1]);
      b = parseInt(match[2]);
    }
  }
  return `rgb(${Math.round(r * amount)}, ${Math.round(g * amount)}, ${Math.round(b * amount)})`;
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
  // Day-view shows full date; week/month show month+year
  const toolbarDateLabel =
    viewMode === "Day"
      ? today.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      : monthYear;

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
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Calendar toolbar */}
        <div className="relative z-20 flex h-[60px] shrink-0 items-center justify-between overflow-visible border-b border-[#eee] px-[10px]">
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="secondary" size="sm">
              Today
            </Button>
            <div className="flex items-center">
              <button className="flex h-[38px] w-[38px] items-center justify-center rounded-full text-text hover:bg-gray-100">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="flex h-[38px] w-[38px] items-center justify-center rounded-full text-text hover:bg-gray-100">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <h2 className="text-[16px] font-bold text-text">{toolbarDateLabel}</h2>
            <div className="ml-1 flex items-center gap-1 text-text-secondary">
              <Button variant="icon" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="icon" size="sm">
                <Settings2 className="h-4 w-4" />
              </Button>
              <Button variant="icon" size="sm">
                <Command className="h-4 w-4" />
              </Button>
              <Button variant="icon" size="sm">
                <Lightbulb className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {/* Location filter pill */}
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
              Hands Togeth...
            </Button>

            {/* Practitioner filter pill */}
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
              Practitioners(All)
            </Button>

            {/* Booking-for filter pill */}
            {bookingForFilter && (
              <Chip variant="yellow" className="hidden sm:inline-flex" onRemove={() => setBookingForFilter(null)}>
                Booking for <strong>{bookingForFilter}</strong>
              </Chip>
            )}

            {/* Calendar/Rooms dropdown */}
            <Dropdown
              trigger={
                <Button variant="secondary" size="sm">
                  {calendarMode} <span className="text-text-secondary">&#9662;</span>
                </Button>
              }
              items={[
                { label: "Calendar", value: "Calendar" },
                { label: "Rooms/resources", value: "Rooms/resources" },
              ]}
              onSelect={(v) => setCalendarMode(v as CalendarMode)}
              align="right"
            />

            {/* View mode dropdown */}
            <Dropdown
              trigger={
                <Button variant="secondary" size="sm">
                  {viewMode} <span className="text-text-secondary">&#9662;</span>
                </Button>
              }
              items={[
                { label: "Month", value: "Month" },
                { label: "Week", value: "Week" },
                { label: "Day", value: "Day" },
              ]}
              onSelect={(v) => setViewMode(v as ViewMode)}
              align="right"
            />
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
                  <div className="text-caption-md text-text-secondary">
                    {DAYS[new Date(weekDates.find((d) => d === todayStr) || weekDates[0] + "T00:00:00").getDay()]}
                  </div>
                  <div className="text-heading-lg text-primary">
                    {new Date((weekDates.find((d) => d === todayStr) || weekDates[0]) + "T00:00:00").getDate()}
                  </div>
                  <div className="text-caption-sm text-text-secondary">East Clinics</div>
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
                      <ColorDot color={p.color} size="xs" />
                      <span className="truncate text-label-md text-text">
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
                      <span className="-mt-1.5 text-caption-sm text-text-secondary">
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
                          className="relative cursor-pointer border-r border-b border-border bg-primary/5 last:border-r-0 hover:bg-gray-100/50"
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
                                <p className="truncate text-label-md">{appt.clientName}</p>
                                <p className="text-caption-sm opacity-80">
                                  {appt.startTime} – {appt.endTime.replace(/^0/, "")}
                                </p>
                                <p className="truncate text-caption-sm opacity-70">{appt.type}</p>
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

        {/* Week view — practitioner sub-columns per day, horizontally scrollable */}
        {viewMode === "Week" && (() => {
          const COL_W = 55; // px per practitioner column
          const dayWidth = practitioners.length * COL_W;
          const totalWidth = 48 + dayWidth * 7; // time-gutter + 7 days
          const gridCols = `48px repeat(7, ${dayWidth}px)`;
          return (
          <>
            {/* Sticky day + practitioner headers */}
            <div className="overflow-x-auto overflow-y-hidden" style={{ scrollbarWidth: "none" }}>
              <div style={{ width: totalWidth, display: "grid", gridTemplateColumns: gridCols }} className="border-b border-border">
                <div className="border-r border-border" />
                {weekDates.map((dateStr, i) => {
                  const date = new Date(dateStr + "T00:00:00");
                  const isToday = dateStr === todayStr;
                  return (
                    <div key={i} className={`border-r border-border last:border-r-0 ${isToday ? "bg-primary/5" : ""}`}>
                      <div className="px-2 pt-1 text-center">
                        <div className="text-caption-md text-text-secondary">{DAYS[i]}</div>
                        <div className={`text-heading-lg ${isToday ? "text-primary" : "text-text"}`}>{date.getDate()}</div>
                        <div className="truncate text-caption-sm text-text-secondary">Hands Together Ther...</div>
                      </div>
                      {/* Practitioner column headers */}
                      <div className="flex border-t border-border/50 px-px">
                        {practitioners.map((p) => (
                          <div key={p.id} className="flex flex-col items-center py-1" style={{ width: COL_W }}>
                            <ColorDot color={p.color} size="xs" className="mb-0.5" />
                            <span className="w-full truncate px-0.5 text-center text-caption-sm text-text-secondary">
                              {p.name.length > 6 ? p.name.slice(0, 5) + "..." : p.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scrollable time grid */}
            <div className="flex-1 overflow-auto">
              <div style={{ width: totalWidth, display: "grid", gridTemplateColumns: gridCols }}>
                {HOURS.map((hour) => (
                  <div key={hour} className="contents">
                    <div className="flex items-start justify-end border-r border-b border-border px-1 py-1" style={{ height: HOUR_HEIGHT }}>
                      <span className="-mt-1.5 text-caption-sm text-text-secondary">
                        {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                      </span>
                    </div>
                    {weekDates.map((dateStr, dayIdx) => {
                      const isToday = dateStr === todayStr;
                      return (
                        <div key={dayIdx} className={`relative border-r border-b border-border last:border-r-0 ${isToday ? "bg-primary/5" : ""}`} style={{ height: HOUR_HEIGHT }}>
                          {/* Practitioner sub-columns */}
                          <div className="absolute inset-0 flex">
                            {practitioners.map((prac, pIdx) => {
                              const hourAppts = appointments.filter(
                                (a) => a.date === dateStr && a.practitionerName === prac.name && parseInt(a.startTime.split(":")[0]) === hour,
                              );
                              return (
                                <div
                                  key={prac.id}
                                  className={`relative cursor-pointer hover:bg-gray-50/50 ${pIdx < practitioners.length - 1 ? "border-r border-border/20" : ""}`}
                                  style={{ width: COL_W }}
                                  onClick={(e) => handleCellClick(e, dateStr, hour)}
                                >
                                  {hourAppts.map((appt) => {
                                    const pos = getApptStyle(appt);
                                    return (
                                      <div
                                        key={appt.id}
                                        className="absolute inset-x-0.5 z-10 cursor-pointer overflow-hidden rounded border px-1 py-0.5 shadow-sm"
                                        style={{
                                          backgroundColor: lightenColor(appt.practitionerColor),
                                          borderColor: lightenColor(appt.practitionerColor, 0.6),
                                          color: darkenColor(appt.practitionerColor),
                                          opacity: appt.status === "Cancelled" ? 0.5 : 1,
                                          ...pos,
                                        }}
                                        onClick={(e) => { e.stopPropagation(); setSelectedAppt(appt); }}
                                      >
                                        <p className="truncate text-caption-sm font-medium">{appt.clientName}</p>
                                        <p className="text-caption-sm opacity-80">{formatTime12h(appt.startTime)}</p>
                                        <p className="truncate text-caption-sm opacity-70">{appt.type}</p>
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
        );
        })()}
      </div>

      {/* Rooms/Resources placeholder */}
      {calendarMode === "Rooms/resources" && viewMode !== "Month" && (
        <div className="absolute inset-0 top-12 z-10 flex items-center justify-center bg-white/80">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <LayoutGrid className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-body-md text-text-secondary">Rooms/Resources view</p>
            <p className="mt-1 text-caption-md text-text-secondary">Select rooms to display in the calendar</p>
          </div>
        </div>
      )}

      {/* Click-to-create popover */}
      {popover.visible && (
        <div
          ref={popoverRef}
          className="fixed z-30 w-52"
          style={{
            left: `${popover.x - 104}px`,
            top: `${popover.y - 180}px`,
          }}
        >
          <Card padding="none" className="shadow-lg">
            <div className="px-3 pt-3 pb-1">
              <p className="text-heading-sm text-text">{popover.time}</p>
            </div>
            <div className="py-1">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2.5 px-3 py-2"
                onClick={() => {
                  setPopover((prev) => ({ ...prev, visible: false }));
                  // Support activity - just close for now
                }}
              >
                <Clock className="h-4 w-4 text-text-secondary" />
                Support activity
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2.5 px-3 py-2"
                onClick={() => {
                  setPopover((prev) => ({ ...prev, visible: false }));
                  // Busy time - just close for now
                }}
              >
                <Ban className="h-4 w-4 text-text-secondary" />
                Busy time
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2.5 px-3 py-2"
                onClick={() => {
                  openCreateModal(popover.dateStr, popover.hour, popover.minute, popover.practitionerId);
                }}
              >
                <Calendar className="h-4 w-4 text-text-secondary" />
                Appointment
              </Button>
            </div>
            {/* Downward arrow */}
            <div className="flex justify-center pb-0">
              <div className="h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-white drop-shadow-sm" />
            </div>
          </Card>
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
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="New appointment"
        maxWidth="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowCreateModal(false)}>
              Create
            </Button>
          </>
        }
      >
            <div className="space-y-4">
              {/* Past date warning */}
              {createDate && isDateInPast(createDate) && (
                <Alert variant="warning" icon={<AlertTriangle className="h-4 w-4 text-yellow-600" />}>
                  This appointment is in the past. Are you sure you want to create it?
                </Alert>
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

              {/* Recent clients — quick-fill chips */}
              {!createClient && (
                <div>
                  <p className="mb-1.5 text-label-md text-text-secondary">Recent clients</p>
                  <div className="flex flex-wrap gap-2">
                    {["Sarah Johnson", "Marcus Lee", "Priya Patel", "Tom Nguyen"].map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setCreateClient(name)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-label-lg text-gray-700 transition-colors hover:border-primary hover:bg-purple-50 hover:text-primary"
                      >
                        <User className="h-3.5 w-3.5" />
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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

              {/* Conflict warning — demo: show when selected time is AM (before noon) */}
              {createTime && createTime.includes("AM") && (
                <Alert variant="warning" icon={<AlertTriangle className="h-4 w-4 text-yellow-600" />}>
                  <span className="font-medium">Scheduling conflict:</span> {createPractitioner ? practitioners.find(p => p.id === createPractitioner)?.name || "Practitioner" : "Practitioner"} already has an appointment at {createTime}. Double-check before confirming.
                </Alert>
              )}

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
                    <label className="mb-1 block text-label-lg text-text-secondary">Repeat on *</label>
                    <div className="flex gap-1">
                      {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                        <Button
                          key={d}
                          variant={d === "Mo" ? "primary" : "secondary"}
                          size="sm"
                          round
                          className="px-2.5 py-1 text-label-md"
                        >
                          {d}
                        </Button>
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
                <Button variant="ghost" size="sm" className="w-full justify-between text-label-lg text-text">
                  Waitlist matches (2)
                  <ChevronDown className="h-4 w-4 text-text-secondary" />
                </Button>
              </div>

              {/* Notes */}
              <FormTextarea
                label="Notes"
                value={createNotes}
                onChange={(e) => setCreateNotes(e.target.value)}
                placeholder="Add notes..."
                rows={3}
                className="resize-none"
              />
            </div>
      </Modal>

      {/* Edit appointment modal */}
      {showEditModal && selectedAppt && (
      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit appointment"
        maxWidth="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowEditModal(false)}>
              Save changes
            </Button>
          </>
        }
      >
            <div className="space-y-4">
              {/* Info banner */}
              <Alert variant="info" icon={<Info className="h-4 w-4 text-blue-600" />}>
                Client won&apos;t be notified of changes. To do this, use Reschedule.
              </Alert>

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
                    <label className="mb-1 block text-label-lg text-text-secondary">Repeat on *</label>
                    <div className="flex gap-1">
                      {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                        <Button
                          key={d}
                          variant={d === "Mo" ? "primary" : "secondary"}
                          size="sm"
                          round
                          className="px-2.5 py-1 text-label-md"
                        >
                          {d}
                        </Button>
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
              <RadioGroup
                name="applyTo"
                label="Apply to:"
                options={[
                  { value: "this", label: "This occurrence" },
                  { value: "following", label: "This and all following occurrences" },
                  { value: "all", label: "All occurrences" },
                ]}
                value={editApplyTo}
                onChange={(v) => setEditApplyTo(v as "this" | "following" | "all")}
              />

              {/* Notification preview */}
              <div className="rounded-lg border border-border bg-purple-50/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-label-lg text-text">Notification preview</span>
                </div>
                <p className="mb-3 text-body-sm text-text-secondary">
                  Client won&apos;t be notified of changes. To notify the client, use Reschedule instead.
                </p>
                <div className="rounded-lg bg-white p-3">
                  <p className="text-body-sm text-text-secondary">
                    If using Reschedule, the client will receive:
                  </p>
                  <div className="mt-2 rounded border border-border bg-gray-50 p-3">
                    <p className="text-body-sm text-text-secondary">Subject: <span className="text-text">Your appointment has been rescheduled</span></p>
                    <p className="mt-1 text-body-sm text-text-secondary">
                      Hi {selectedAppt.clientName.split(" ")[0]}, your appointment with {selectedAppt.practitionerName} has been moved to a new time. Please check your updated appointment details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Change log */}
              <div className="rounded-lg border border-border bg-gray-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <History className="h-4 w-4 text-text-secondary" />
                  <span className="text-label-lg text-text">Change log</span>
                </div>
                <div className="space-y-2">
                  {[
                    { date: "24 Mar 2026, 2:15 pm", user: "Hrishikesh Koli", action: "Created appointment" },
                    { date: "24 Mar 2026, 3:42 pm", user: "Sharon Tan", action: "Changed room from Green to Blue" },
                    { date: "25 Mar 2026, 9:10 am", user: "Hrishikesh Koli", action: "Updated service to Initial Consultation" },
                  ].map((log, i) => (
                    <div key={i} className="flex items-start gap-3 border-b border-border pb-2 last:border-0 last:pb-0">
                      <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="text-body-sm text-text">{log.action}</p>
                        <p className="text-caption-md text-text-secondary">{log.user} · {log.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
      </Modal>
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
          <div key={d} className="px-2 py-2 text-center text-label-md text-text-secondary">
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
                  className={`mb-1 ${
                    isToday
                      ? "text-label-lg inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white"
                      : cell.isCurrentMonth
                        ? "text-label-lg text-text"
                        : "text-body-md text-text-secondary/40"
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
                        className={`flex cursor-pointer items-center gap-0.5 rounded border px-1 py-0.5 text-caption-sm font-medium ${isCancelled ? "opacity-60" : ""}`}
                        style={{
                          backgroundColor: lightenColor(appt.practitionerColor),
                          borderColor: lightenColor(appt.practitionerColor, 0.6),
                          color: darkenColor(appt.practitionerColor),
                        }}
                        onClick={() => onApptClick(appt)}
                      >
                        <span className="truncate">
                          {formatTime12h(appt.startTime)} {appt.clientName}
                        </span>
                        {isCancelled && (
                          <span className="ml-auto flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm bg-red-500">
                            <X className="h-2.5 w-2.5 text-white" />
                          </span>
                        )}
                        {isGroup && !isCancelled && (
                          <span className="ml-auto shrink-0 rounded bg-white/30 px-1 text-caption-sm font-semibold">
                            0/10
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {dayAppts.length > 3 && (
                    <div className="px-1 text-caption-sm text-text-secondary">+{dayAppts.length - 3} more</div>
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
              <ColorDot color={appt.practitionerColor} size="sm" />
              <span className="text-heading-sm text-text">
                {appt.clientName} ({appt.type})
              </span>
            </div>
            <Button variant="icon" size="sm" onClick={onClose}>
              <X className="h-4 w-4 text-text-secondary" />
            </Button>
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
            <Button variant="link" className="mx-auto">
              <History className="h-3.5 w-3.5" />
              View change log
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function SingleAppointmentDetails({ appt }: { appt: Appointment }) {
  return (
    <div className="space-y-3 text-body-md">
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
        <span className="text-caption-md text-text-secondary">Repeating every 2 weeks on Monday for 6 times</span>
      </div>

      {/* Organiser */}
      <div className="flex items-center gap-2">
        <Avatar name={appt.practitionerName} color={appt.practitionerColor} size="sm" />
        <span className="text-text-secondary">{appt.practitionerName} (Organiser)</span>
      </div>

      {/* Note field */}
      <div className="mt-4">
        <label className="flex items-center gap-1 text-label-md text-text-secondary">
          <FileText className="h-3 w-3" /> Note
        </label>
        <FormTextarea
          className="mt-1 resize-none"
          rows={3}
          placeholder="Add a note..."
        />
      </div>
    </div>
  );
}

function GroupAppointmentDetails({ appt }: { appt: Appointment }) {
  return (
    <div className="space-y-3 text-body-md">
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
        <label className="flex items-center gap-1 text-label-md text-text-secondary">
          <FileText className="h-3 w-3" /> Note
        </label>
        <FormTextarea
          className="mt-1 resize-none"
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
