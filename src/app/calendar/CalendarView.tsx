"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useRegisterCommands } from "@/hooks/useRegisterCommands";
import { Button, Flex, Form, Input, Select } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  DownOutlined,
  FilterOutlined,
  SettingOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  BulbOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  DesktopOutlined,
  UserAddOutlined,
  StopOutlined,
  MailOutlined,
  SyncOutlined,
  HistoryOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { Badge, Modal, Toggle, Avatar, ColorDot, Alert, Card, RadioGroup, Text, AppointmentCard, SegmentedControl, ContextMenu, HoverCard, Drawer } from "@/components/ds";
import type { AppointmentStatus } from "@/components/ds";
import AiChatPanel from "@/components/AiChatPanel";
import styles from "./CalendarView.module.css";

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

type PractitionerWithLocation = Practitioner & { location: string };

const LOCATION_NAMES = ["East Clinics", "Splose OT", "Tasks"];
function assignLocations(practitioners: Practitioner[]): PractitionerWithLocation[] {
  return practitioners.map((p, i) => ({
    ...p,
    location: LOCATION_NAMES[i % LOCATION_NAMES.length],
  }));
}

type LocationGroup = { name: string; practitioners: PractitionerWithLocation[] };
function groupByLocation(practitioners: PractitionerWithLocation[]): LocationGroup[] {
  const map = new Map<string, PractitionerWithLocation[]>();
  for (const p of practitioners) {
    const arr = map.get(p.location) || [];
    arr.push(p);
    map.set(p.location, arr);
  }
  return Array.from(map.entries()).map(([name, pracs]) => ({ name, practitioners: pracs }));
}

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

const HOUR_HEIGHT = 80;
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

function formatTime12h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  const ampm = h >= 12 ? "pm" : "am";
  const mm = m === 0 ? "" : `:${m.toString().padStart(2, "0")}`;
  return `${h12}${mm} ${ampm}`;
}

function lightenColor(color: string, amount = 0.85): string {
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
  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);
  return `rgb(${lr}, ${lg}, ${lb})`;
}

function getStatusIcons(appt: Appointment): string {
  const icons: string[] = [];
  if (appt.status === "Confirmed") icons.push("✅");
  if (appt.notes) icons.push("📋");
  if (appt.status === "Pending" || appt.status === "No Show") icons.push("⚠️");
  if (appt.type.includes("NDIS") || appt.type.includes("DVA")) icons.push("💰");
  return icons.join("");
}

function getContrastText(color: string): string {
  let r = 128, g = 128, b = 128;
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (color.startsWith("rgb")) {
    const match = color.match(/(\d+)/g);
    if (match) { r = parseInt(match[0]); g = parseInt(match[1]); b = parseInt(match[2]); }
  }
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "rgb(30, 30, 30)" : "rgb(255, 255, 255)";
}

function isGroupAppointment(appt: Appointment): boolean {
  return appt.type.toLowerCase().includes("group");
}

function mapApptStatus(status: string): AppointmentStatus {
  switch (status.toLowerCase()) {
    case "confirmed": return "confirmed";
    case "no show": return "no-show";
    case "cancelled": return "cancelled";
    case "completed": return "completed";
    default: return "scheduled";
  }
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
  const [showAISidebar, setShowAISidebar] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [practitionerDropdownOpen, setPractitionerDropdownOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [practitionerSearchQuery, setPractitionerSearchQuery] = useState("");
  const calendarRouter = useRouter();
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const practitionerDropdownRef = useRef<HTMLDivElement>(null);

  useRegisterCommands([
    { id: "calendar-new-appointment", label: "New appointment", group: "Actions", onSelect: () => setShowCreateModal(true) },
    { id: "calendar-go-today", label: "Go to today", group: "Actions", onSelect: () => calendarRouter.push("/calendar") },
  ]);

  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [practitionerFilter, setPractitionerFilter] = useState<string>("all");
  const [bookingForFilter, setBookingForFilter] = useState<string | null>(null);

  const locatedPractitioners = assignLocations(practitioners);
  const uniqueLocations = [...new Set(locatedPractitioners.map(p => p.location))];

  const filteredLocatedPractitioners = locatedPractitioners.filter((p) => {
    if (locationFilter !== "all" && p.location !== locationFilter) return false;
    if (practitionerFilter !== "all" && p.id !== practitionerFilter) return false;
    return true;
  });
  const filteredPractitioners = filteredLocatedPractitioners as Practitioner[];

  const filteredAppointments = appointments.filter(appt =>
    filteredLocatedPractitioners.some(p => p.name === appt.practitionerName)
  );

  const locationLabel = locationFilter === "all"
    ? `Locations(All)`
    : locationFilter.length > 12 ? locationFilter.slice(0, 12) + "..." : locationFilter;
  const practitionerLabel = practitionerFilter === "all"
    ? `Practitioners(All)`
    : (practitioners.find(p => p.id === practitionerFilter)?.name.split(" ")[0] || "—");

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

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(e.target as Node)) {
        setLocationDropdownOpen(false);
      }
      if (practitionerDropdownRef.current && !practitionerDropdownRef.current.contains(e.target as Node)) {
        setPractitionerDropdownOpen(false);
      }
    }
    if (locationDropdownOpen || practitionerDropdownOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [locationDropdownOpen, practitionerDropdownOpen]);

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
      "booking-for": () => setBookingForFilter("a a"),
    };
    actions[forcedState]?.();
  }, [forcedState]);

  const today = new Date();
  const monthYear = today.toLocaleDateString("en-AU", { month: "short", year: "numeric" });
  const toolbarDateLabel = monthYear;

  function openCreateModal(dateStr?: string, hour?: number, minute?: number, practitionerId?: string) {
    const m = minute ?? 0;
    if (dateStr && hour !== undefined) {
      setCreateDate(dateStr);
      setCreateTime(formatTime24to12(hour, m));
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
    <div className={styles.root}>
      <div className={styles.mainContent}>
        {/* Calendar toolbar */}
        <div className={styles.toolbar}>
          <button className={styles.todayBtn}>Today</button>
          <button className={styles.iconBtn}>
            <LeftOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
          </button>
          <button className={styles.iconBtn}>
            <RightOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
          </button>
          <span className={styles.dateLabel}>{toolbarDateLabel}</span>
          <button className={styles.iconBtnSecondary}>
            <FilterOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
          </button>
          <button className={styles.iconBtnSecondary}>
            <SettingOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
          </button>
          <button className={styles.iconBtnSecondary}>
            <CalendarOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
          </button>
          <button className={styles.iconBtnSecondary}>
            <BulbOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
          </button>

          {/* Location + Practitioner filter buttons */}
          <div className={styles.filterGroup}>
            {/* Location dropdown */}
            <div style={{ position: "relative" }} ref={locationDropdownRef}>
              <button
                className={styles.filterTrigger}
                onClick={() => { setLocationDropdownOpen(prev => !prev); setPractitionerDropdownOpen(false); setLocationSearchQuery(""); }}
              >
                {locationLabel}
              </button>
              {locationDropdownOpen && (
                <div className={styles.filterDropdown}>
                  <div className={styles.filterSearchBox}>
                    <div className={styles.filterSearchInput}>
                      <SearchOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
                      <input
                        type="text"
                        placeholder="Search locations..."
                        className={styles.filterSearchField}
                        value={locationSearchQuery}
                        onChange={(e) => setLocationSearchQuery(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className={styles.filterList}>
                    <button
                      className={styles.filterOption}
                      onClick={() => { setLocationFilter("all"); setLocationDropdownOpen(false); }}
                    >
                      <div className={locationFilter === "all" ? styles.filterCheckboxChecked : styles.filterCheckbox}>
                        {locationFilter === "all" && <CheckOutlined style={{ fontSize: 12, color: '#FFFFFF' }} />}
                      </div>
                      <Text variant="label/lg" as="span" color="text">Select all</Text>
                    </button>
                    {uniqueLocations
                      .filter(loc => loc.toLowerCase().includes(locationSearchQuery.toLowerCase()))
                      .map(loc => (
                        <button
                          key={loc}
                          className={styles.filterOption}
                          onClick={() => { setLocationFilter(loc); setLocationDropdownOpen(false); }}
                        >
                          <div className={locationFilter === loc ? styles.filterCheckboxChecked : styles.filterCheckbox}>
                            {locationFilter === loc && <CheckOutlined style={{ fontSize: 12, color: '#FFFFFF' }} />}
                          </div>
                          <span>{loc}</span>
                        </button>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>

            {/* Practitioner dropdown */}
            <div style={{ position: "relative" }} ref={practitionerDropdownRef}>
              <button
                className={styles.filterTrigger}
                onClick={() => { setPractitionerDropdownOpen(prev => !prev); setLocationDropdownOpen(false); setPractitionerSearchQuery(""); }}
              >
                {practitionerLabel}
              </button>
              {practitionerDropdownOpen && (
                <div className={styles.filterDropdownWide}>
                  <div className={styles.filterSearchBox}>
                    <div className={styles.filterSearchInput}>
                      <SearchOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
                      <input
                        type="text"
                        placeholder="Search practitioners..."
                        className={styles.filterSearchField}
                        value={practitionerSearchQuery}
                        onChange={(e) => setPractitionerSearchQuery(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className={styles.filterListTall}>
                    <button
                      className={styles.filterOption}
                      onClick={() => { setPractitionerFilter("all"); setPractitionerDropdownOpen(false); }}
                    >
                      <div className={practitionerFilter === "all" ? styles.filterCheckboxChecked : styles.filterCheckbox}>
                        {practitionerFilter === "all" && <CheckOutlined style={{ fontSize: 12, color: '#FFFFFF' }} />}
                      </div>
                      <Text variant="label/lg" as="span" color="text">All practitioners</Text>
                    </button>
                    {groupByLocation(locatedPractitioners).map(group => {
                      const filteredPracs = group.practitioners.filter(p =>
                        p.name.toLowerCase().includes(practitionerSearchQuery.toLowerCase())
                      );
                      if (filteredPracs.length === 0) return null;
                      return (
                        <div key={group.name}>
                          <div className={styles.filterGroupLabel}>{group.name}</div>
                          {filteredPracs.map(p => (
                            <button
                              key={p.id}
                              className={styles.filterOption}
                              onClick={() => { setPractitionerFilter(p.id); setPractitionerDropdownOpen(false); }}
                            >
                              <div className={practitionerFilter === p.id ? styles.filterCheckboxChecked : styles.filterCheckbox}>
                                {practitionerFilter === p.id && <CheckOutlined style={{ fontSize: 12, color: '#FFFFFF' }} />}
                              </div>
                              <ColorDot color={p.color} size="sm" />
                              <span>{p.name}</span>
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking-for filter pill */}
          {bookingForFilter && (
            <Badge variant="yellow" shape="pill" className={styles.bookingChip} onRemove={() => setBookingForFilter(null)}>
              Booking for <strong>{bookingForFilter}</strong>
            </Badge>
          )}

          <div className={styles.toolbarSpacer} />

          {/* Right group: sparkle, Calendar, Week */}
          <div className={styles.toolbarRight}>
            <button
              className={showAISidebar ? styles.sparkleBtnActive : styles.sparkleBtn}
              onClick={() => setShowAISidebar(prev => !prev)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 3C16 3 16.5 6.5 17 8C17.5 9.5 19 10.5 21 11C19 11.5 17.5 12.5 17 14C16.5 15.5 16 19 16 19C16 19 15.5 15.5 15 14C14.5 12.5 13 11.5 11 11C13 10.5 14.5 9.5 15 8C15.5 6.5 16 3 16 3Z" fill="currentColor"/>
                <path d="M8 14C8 14 8.3 15.8 8.6 16.7C8.9 17.6 9.6 18.3 10.8 18.7C9.6 19.1 8.9 19.8 8.6 20.7C8.3 21.6 8 23.4 8 23.4C8 23.4 7.7 21.6 7.4 20.7C7.1 19.8 6.4 19.1 5.2 18.7C6.4 18.3 7.1 17.6 7.4 16.7C7.7 15.8 8 14 8 14Z" fill="currentColor"/>
                <path d="M5 7C5 7 5.15 7.9 5.3 8.3C5.45 8.7 5.8 9 6.4 9.2C5.8 9.4 5.45 9.7 5.3 10.1C5.15 10.5 5 11.4 5 11.4C5 11.4 4.85 10.5 4.7 10.1C4.55 9.7 4.2 9.4 3.6 9.2C4.2 9 4.55 8.7 4.7 8.3C4.85 7.9 5 7 5 7Z" fill="currentColor"/>
              </svg>
            </button>

            <SegmentedControl
              options={[
                { value: "Calendar", label: "Calendar" },
                { value: "Rooms/resources", label: "Rooms" },
              ]}
              value={calendarMode}
              onChange={(v) => setCalendarMode(v as CalendarMode)}
              aria-label="Calendar or Rooms view"
            />

            <SegmentedControl
              options={[
                { value: "Week", label: "Week" },
                { value: "Day", label: "Day" },
                { value: "Month", label: "Month" },
              ]}
              value={viewMode}
              onChange={(v) => setViewMode(v as ViewMode)}
              aria-label="Calendar view"
            />
          </div>
        </div>

        {/* Month View */}
        {viewMode === "Month" && (
          <MonthView appointments={appointments} todayStr={todayStr} onApptClick={(appt) => setSelectedAppt(appt)} />
        )}

        {/* Day view */}
        {viewMode === "Day" && (
          <>
            <div className={styles.dayViewScroll}>
              <div
                className={styles.dayViewHeaderGrid}
                style={{ gridTemplateColumns: `60px repeat(${filteredPractitioners.length}, 1fr)` }}
              >
                <div className={styles.dayViewGutter} />
                {filteredPractitioners.map((p) => (
                  <div key={p.id} className={styles.dayViewPracHeader}>
                    <div className={styles.dayViewPracName}>
                      <span className={styles.dayViewPracNameText}>{p.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.dayViewGrid}>
              <div
                className={styles.dayViewGridInner}
                style={{ gridTemplateColumns: `60px repeat(${filteredPractitioners.length}, 1fr)` }}
              >
                {HOURS.map((hour) => {
                  const locGroups = groupByLocation(filteredLocatedPractitioners);
                  return (
                    <div key={hour} style={{ display: "contents" }}>
                      <div className={styles.dayViewTimeLabelCell} style={{ height: HOUR_HEIGHT }}>
                        <span className={styles.timeLabel}>
                          {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                        </span>
                      </div>
                      {(() => {
                        let pracIdx = 0;
                        return locGroups.map((group, gi) =>
                          group.practitioners.map((prac) => {
                            const currentDay = weekDates.find((d) => d === todayStr) || weekDates[0];
                            const hourAppts = filteredAppointments.filter(
                              (a) =>
                                a.date === currentDay &&
                                a.practitionerName === prac.name &&
                                parseInt(a.startTime.split(":")[0]) === hour,
                            );
                            const pracAvailStart = 8 + (pracIdx % 3);
                            const pracAvailEnd = 15 + (pracIdx % 4);
                            const isUnavailable = hour < pracAvailStart || hour >= pracAvailEnd;
                            pracIdx++;
                            return (
                              <ContextMenu
                                key={prac.id}
                                items={[
                                  { id: "new-appt", label: "New appointment", onSelect: () => openCreateModal(currentDay, hour, 0, prac.id) },
                                  { id: "new-busy", label: "New busy time", divider: true },
                                  { id: "new-activity", label: "New support activity" },
                                ]}
                              >
                                <div
                                  className={styles.dayViewPracCell}
                                  style={{
                                    height: HOUR_HEIGHT,
                                    // eslint-disable-next-line no-restricted-syntax -- dynamic grid cell shading (unavailable / alternating)
                                    backgroundColor: isUnavailable ? "#f0f0f0" : gi % 2 === 0 ? "#f3f4f6" : "#ffffff",
                                  }}
                                  onClick={(e) => handleDayCellClick(e, currentDay, hour, prac)}
                                >
                                  <div className={styles.subdivisionLines}>
                                    <div className={styles.subdivisionLine25} />
                                    <div className={styles.subdivisionLine50} />
                                    <div className={styles.subdivisionLine75} />
                                  </div>
                                  {hourAppts.map((appt) => {
                                    const pos = getApptStyle(appt);
                                    return (
                                      <ContextMenu
                                        key={appt.id}
                                        items={[
                                          { id: "edit", label: "Edit", onSelect: () => { setSelectedAppt(appt); setShowEditModal(true); } },
                                          { id: "duplicate", label: "Duplicate" },
                                          { id: "reschedule", label: "Reschedule", divider: true },
                                          { id: "cancel", label: "Cancel", tone: "danger" },
                                        ]}
                                      >
                                        <HoverCard
                                          content={
                                            <div>
                                              <Text variant="label/lg" as="div" color="text">{appt.clientName}</Text>
                                              <Text variant="body/sm" as="div" color="secondary">{formatTime12h(appt.startTime)} – {formatTime12h(appt.endTime)}</Text>
                                              <Text variant="body/sm" as="div" color="secondary">{appt.type}</Text>
                                              <Text variant="body/sm" as="div" color="secondary">{appt.practitionerName}</Text>
                                            </div>
                                          }
                                          side="right"
                                        >
                                          <AppointmentCard
                                            time={`${formatTime12h(appt.startTime)} – ${formatTime12h(appt.endTime)}`}
                                            patientName={appt.clientName}
                                            service={appt.type}
                                            practitioner={appt.practitionerName}
                                            status={mapApptStatus(appt.status)}
                                            tone={lightenColor(appt.practitionerColor, 0.7)}
                                            density="standard"
                                            onClick={(e) => { e.stopPropagation(); setSelectedAppt(appt); }}
                                            style={{ position: "absolute", left: 2, right: 2, ...pos }}
                                          />
                                        </HoverCard>
                                      </ContextMenu>
                                    );
                                  })}
                                </div>
                              </ContextMenu>
                            );
                          })
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Week view */}
        {viewMode === "Week" && (() => {
          const COL_W = 55;
          const naturalDayWidth = filteredPractitioners.length * COL_W;
          const useFlexible = naturalDayWidth * 7 + 48 < 900;
          const totalWidth = useFlexible ? "100%" : `${48 + naturalDayWidth * 7}px`;
          const gridCols = useFlexible ? `48px repeat(7, 1fr)` : `48px repeat(7, ${naturalDayWidth}px)`;
          return (
            <>
              <div className={styles.weekContainer}>
                <div className={styles.weekStickyHeader}>
                  {/* Day name + number row */}
                  <div style={{ width: totalWidth, display: "grid", gridTemplateColumns: gridCols }}>
                    <div />
                    {weekDates.map((dateStr, i) => {
                      const date = new Date(dateStr + "T00:00:00");
                      const isToday = dateStr === todayStr;
                      return (
                        <div key={i} className={styles.dayHeader}>
                          <div className={isToday ? styles.dayOfWeekToday : styles.dayOfWeek}>{DAYS[i]}</div>
                          {isToday ? (
                            <div className={styles.dayNumberToday}>{date.getDate()}</div>
                          ) : (
                            <div className={styles.dayNumber}>{date.getDate()}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Location groups + practitioner names */}
                  <div style={{ width: totalWidth, display: "grid", gridTemplateColumns: gridCols }} className={styles.weekSubHeader}>
                    <div className={styles.weekSubHeaderGutter} />
                    {weekDates.map((dateStr, i) => (
                      <div key={i} className={styles.daySubColumn}>
                        <Flex>
                          {groupByLocation(filteredLocatedPractitioners).map((group, gi) => (
                            <div
                              key={group.name}
                              className={`${styles.locationGroupHeader} ${gi > 0 ? styles.locationGroupBorder : ""}`}
                              style={useFlexible ? { flex: group.practitioners.length } : { width: group.practitioners.length * COL_W }}
                            >
                              {group.name}
                            </div>
                          ))}
                        </Flex>
                        <div className={styles.practitionerHeaderRow}>
                          {groupByLocation(filteredLocatedPractitioners).map((group, gi) => (
                            <Flex key={group.name} className={gi > 0 ? styles.locationGroupBorder : undefined}>
                              {group.practitioners.map((p) => (
                                <div key={p.id} className={styles.practitionerName} style={useFlexible ? { flex: 1 } : { width: COL_W }}>
                                  <span className={styles.practitionerNameText}>
                                    {p.name.length > 6 ? p.name.slice(0, 5) + "..." : p.name}
                                  </span>
                                </div>
                              ))}
                            </Flex>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time grid */}
                <div style={{ width: totalWidth, display: "grid", gridTemplateColumns: gridCols }}>
                  {HOURS.map((hour) => (
                    <div key={hour} style={{ display: "contents" }}>
                      <div className={styles.timeLabelCell} style={{ height: HOUR_HEIGHT }}>
                        <span className={styles.timeLabel}>
                          {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                        </span>
                      </div>
                      {weekDates.map((dateStr, dayIdx) => (
                        <div key={dayIdx} className={styles.hourCell} style={{ height: HOUR_HEIGHT }}>
                          <div className={styles.subdivisionLines}>
                            <div className={styles.subdivisionLine25} />
                            <div className={styles.subdivisionLine50} />
                            <div className={styles.subdivisionLine75} />
                          </div>
                          <Flex style={{ position: "absolute", inset: 0 }}>
                            {(() => {
                              const locGroups = groupByLocation(filteredLocatedPractitioners);
                              let colIndex = 0;
                              return locGroups.map((group, gi) =>
                                group.practitioners.map((prac) => {
                                  const hourAppts = filteredAppointments.filter(
                                    (a) => a.date === dateStr && a.practitionerName === prac.name && parseInt(a.startTime.split(":")[0]) === hour,
                                  );
                                  const pracAvailStart = 8 + (colIndex % 3);
                                  const pracAvailEnd = 15 + (colIndex % 4);
                                  const isUnavailable = hour < pracAvailStart || hour >= pracAvailEnd;
                                  colIndex++;
                                  return (
                                    <ContextMenu
                                      key={prac.id}
                                      items={[
                                        { id: "new-appt", label: "New appointment", onSelect: () => openCreateModal(dateStr, hour, 0, prac.id) },
                                        { id: "new-busy", label: "New busy time", divider: true },
                                        { id: "new-activity", label: "New support activity" },
                                      ]}
                                    >
                                      <div
                                        className={styles.pracSubCol}
                                        style={{
                                          ...(useFlexible ? { flex: 1 } : { width: COL_W }),
                                          // eslint-disable-next-line no-restricted-syntax -- dynamic grid cell shading (unavailable / alternating)
                                          backgroundColor: isUnavailable ? "#f0f0f0" : gi % 2 === 0 ? "#f3f4f6" : "#ffffff",
                                        }}
                                        onClick={(e) => handleCellClick(e, dateStr, hour)}
                                      >
                                        {hourAppts.map((appt) => {
                                          const pos = getApptStyle(appt);
                                          return (
                                            <ContextMenu
                                              key={appt.id}
                                              items={[
                                                { id: "edit", label: "Edit", onSelect: () => { setSelectedAppt(appt); setShowEditModal(true); } },
                                                { id: "duplicate", label: "Duplicate" },
                                                { id: "reschedule", label: "Reschedule", divider: true },
                                                { id: "cancel", label: "Cancel", tone: "danger" },
                                              ]}
                                            >
                                              <HoverCard
                                                content={
                                                  <div>
                                                    <Text variant="label/lg" as="div" color="text">{appt.clientName}</Text>
                                                    <Text variant="body/sm" as="div" color="secondary">{formatTime12h(appt.startTime)}</Text>
                                                    <Text variant="body/sm" as="div" color="secondary">{appt.type}</Text>
                                                    <Text variant="body/sm" as="div" color="secondary">{appt.practitionerName}</Text>
                                                  </div>
                                                }
                                                side="right"
                                              >
                                                <AppointmentCard
                                                  time={formatTime12h(appt.startTime)}
                                                  patientName={appt.clientName}
                                                  service={appt.type}
                                                  practitioner={appt.practitionerName}
                                                  status={mapApptStatus(appt.status)}
                                                  tone={lightenColor(appt.practitionerColor, 0.7)}
                                                  density="compact"
                                                  onClick={(e) => { e.stopPropagation(); setSelectedAppt(appt); }}
                                                  style={{ position: "absolute", left: 1, right: 1, ...pos }}
                                                />
                                              </HoverCard>
                                            </ContextMenu>
                                          );
                                        })}
                                      </div>
                                    </ContextMenu>
                                  );
                                })
                              );
                            })()}
                          </Flex>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </>
          );
        })()}
      </div>

      {/* AI Sidebar Panel */}
      <div
        className={styles.aiSidebar}
        style={{
          width: showAISidebar ? 360 : 0,
          minWidth: showAISidebar ? 360 : 0,
          opacity: showAISidebar ? 1 : 0,
          overflow: showAISidebar ? "visible" : "hidden",
        }}
      >
        {showAISidebar && (
          <AiChatPanel onClose={() => setShowAISidebar(false)} variant="calendar" />
        )}
      </div>

      {/* Rooms/Resources placeholder */}
      {calendarMode === "Rooms/resources" && viewMode !== "Month" && (
        <div className={styles.roomsOverlay}>
          <div className={styles.roomsOverlayContent}>
            <div className={styles.roomsOverlayIcon}>
              <AppstoreOutlined style={{ fontSize: 32, color: 'var(--ant-color-text-tertiary, #b8bcc0)' }} />
            </div>
            <Text variant="body/md" as="p" color="secondary">Rooms/Resources view</Text>
            <Text variant="caption/md" as="p" color="secondary" style={{ marginTop: 4 }}>Select rooms to display in the calendar</Text>
          </div>
        </div>
      )}

      {/* Click-to-create popover */}
      {popover.visible && (
        <div
          ref={popoverRef}
          className={styles.popover}
          style={{ left: popover.x - 104, top: popover.y - 180 }}
        >
          <Card
            padding="none"
            // eslint-disable-next-line no-restricted-syntax -- floating popover shadow (larger than Card's subtle shadow)
            style={{ boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)' }}
          >
            <div style={{ padding: "12px 12px 4px" }}>
              <Text variant="heading/sm" as="p" color="text">{popover.time}</Text>
            </div>
            <div style={{ padding: "4px 0" }}>
              <Button
                type="text"
                style={{ width: '100%', justifyContent: 'flex-start', gap: 10, paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12 }}
                onClick={() => setPopover((prev) => ({ ...prev, visible: false }))}
              >
                <ClockCircleOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
                Support activity
              </Button>
              <Button
                type="text"
                style={{ width: '100%', justifyContent: 'flex-start', gap: 10, paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12 }}
                onClick={() => setPopover((prev) => ({ ...prev, visible: false }))}
              >
                <StopOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
                Busy time
              </Button>
              <Button
                type="text"
                style={{ width: '100%', justifyContent: 'flex-start', gap: 10, paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12 }}
                onClick={() => openCreateModal(popover.dateStr, popover.hour, popover.minute, popover.practitionerId)}
              >
                <CalendarOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
                Appointment
              </Button>
              <Button
                type="text"
                style={{ width: '100%', justifyContent: 'flex-start', gap: 10, paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12 }}
                onClick={() => setPopover((prev) => ({ ...prev, visible: false }))}
              >
                <CheckOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
                Availability
              </Button>
            </div>
            <div className={styles.popoverArrow}>
              <div className={styles.popoverArrowShape} />
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
        title="Create appointment"
        maxWidth="lg"
        footer={
          <>
            <Button onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button type="primary" onClick={() => setShowCreateModal(false)}>Create</Button>
          </>
        }
      >
        <div className={styles.formStack}>
          {createDate && isDateInPast(createDate) && (
            <Alert variant="warning" icon={<WarningOutlined style={{ fontSize: 16, color: 'var(--ant-color-warning, #FFD232)' }} />}>{/* icon color matches Alert warning tone */}
              This appointment is in the past. Are you sure you want to create it?
            </Alert>
          )}
          <div className={styles.formRow}>
            <span className={styles.formRowLabel}>Location *</span>
            <Select value={createLocation} onChange={setCreateLocation} options={[
              { value: "Hands Together Therapy (East)", label: "Hands Together Therapy (East)" },
              { value: "Hands Together Therapy (West)", label: "Hands Together Therapy (West)" },
            ]} style={{ width: "100%" }} />
          </div>
          <div className={styles.formRow}>
            <span className={styles.formRowLabel}>Practitioner *</span>
            <Select value={createPractitioner} onChange={setCreatePractitioner} options={practitioners.map((p) => ({ value: p.id, label: p.name }))} style={{ width: "100%" }} />
          </div>
          <div className={styles.formRow}>
            <span className={styles.formRowLabel}>Client *</span>
            <Input type="text" value={createClient} onChange={(e) => setCreateClient(e.target.value)} placeholder="Start typing to search client..." />
          </div>
          {!createClient && (
            <div
              // eslint-disable-next-line no-restricted-syntax -- mustard waitlist callout, one-off
              style={{ borderLeft: '3px solid #ca8a04', backgroundColor: '#fefce8', borderRadius: 4, padding: '8px 12px', marginLeft: 152 }}
            >
              <Text variant="label/lg" as="span" color="text">2 waitlist matches</Text>
              <DownOutlined style={{ fontSize: 12, color: 'var(--ant-color-text-secondary, #6E6E64)', marginLeft: 8 }} />
            </div>
          )}
          <div className={styles.formRow}>
            <span className={styles.formRowLabel}>Service *</span>
            <Select value={createService} onChange={setCreateService} options={[
              { value: "", label: "Select a service" },
              { value: "initial-assessment", label: "Initial Assessment" },
              { value: "follow-up", label: "Follow Up" },
              { value: "review", label: "Review" },
              { value: "group-session", label: "Group Session" },
              { value: "targeted-services", label: "Targeted Services (Goodstart)" },
              { value: "capacity-building", label: "Capacity Building" },
            ]} style={{ width: "100%" }} />
          </div>
          <div className={styles.formRow}>
            <span className={styles.formRowLabel}>Case</span>
            <Select value={createCase} onChange={setCreateCase} options={[{ value: "", label: "Choose a case" }]} style={{ width: "100%" }} />
          </div>
          <div className={styles.formRow}>
            <span className={styles.formRowLabel}>Date *</span>
            <Input type="date" value={createDate} onChange={(e) => setCreateDate(e.target.value)} />
          </div>
          <div className={styles.timeRow}>
            <span className={styles.formRowLabel}>Time *</span>
            <Select value={createTime} onChange={setCreateTime} options={TIME_OPTIONS.map((t) => ({ value: t, label: t }))} style={{ width: "100%" }} />
            <Select value={createEndTime} onChange={setCreateEndTime} options={TIME_OPTIONS.map((t) => ({ value: t, label: t }))} style={{ width: "100%" }} />
          </div>
          {createTime && createTime.includes("AM") && (
            <Alert variant="warning" icon={<WarningOutlined style={{ fontSize: 16, color: 'var(--ant-color-warning, #FFD232)' }} />}>
              <Text variant="label/lg" as="span" color="text">Scheduling conflict:</Text> {createPractitioner ? practitioners.find(p => p.id === createPractitioner)?.name || "Practitioner" : "Practitioner"} already has an appointment at {createTime}. Double-check before confirming.
            </Alert>
          )}
          <div className={styles.formRow}>
            <span className={styles.formRowLabel}>Room/Resource</span>
            <Select value={createRoom} onChange={setCreateRoom} options={[
              { value: "", label: "Choose a room/resource" },
              { value: "green", label: "Green (1 available of 1)" },
              { value: "red", label: "Red (1 available of 1)" },
              { value: "blue", label: "Blue (2 available of 2)" },
              { value: "room1", label: "Room 1 (1 available of 1)" },
            ]} style={{ width: "100%" }} />
          </div>
          <div className={styles.formRow}>
            <span className={styles.formRowLabel}>Provider travel</span>
            <Toggle checked={createProviderTravel} onChange={setCreateProviderTravel} />
          </div>
          <div className={styles.formRow}>
            <span className={styles.formRowLabel}>Non-Labour Costs</span>
            <Toggle checked={createProviderTravelNonLabour} onChange={setCreateProviderTravelNonLabour} />
          </div>
          <div className={styles.formRow}>
            <span className={styles.formRowLabel}>Transport</span>
            <Toggle checked={createActivityTransport} onChange={setCreateActivityTransport} />
          </div>
          <div className={styles.formRow}>
            <span className={styles.formRowLabel}>Repeat</span>
            <Toggle checked={createRepeat} onChange={setCreateRepeat} />
          </div>
          {createRepeat && (
            <div className={styles.repeatSection}>
              <Form layout="vertical">
                <Form.Item label="Repeat">
                  <Select options={[
                    { value: "weekly", label: "Every week" },
                    { value: "2weeks", label: "Every 2 weeks" },
                    { value: "3weeks", label: "Every 3 weeks" },
                    { value: "4weeks", label: "Every 4 weeks" },
                  ]} style={{ width: "100%" }} />
                </Form.Item>
              </Form>
              <div>
                <label className={styles.sectionLabel}>Repeat on *</label>
                <div className={styles.dayPicker}>
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                    <Button key={d} type={d === "Mo" ? "primary" : "default"} size="small" shape="circle">{d}</Button>
                  ))}
                </div>
              </div>
              <Form layout="vertical">
                <Form.Item label="Ends">
                  <Select options={[
                    { value: "6", label: "After 6 times" },
                    { value: "4", label: "After 4 times" },
                    { value: "8", label: "After 8 times" },
                    { value: "12", label: "After 12 times" },
                    { value: "date", label: "On date" },
                  ]} style={{ width: "100%" }} />
                </Form.Item>
              </Form>
            </div>
          )}
          <div className={styles.formRow}>
            <span className={styles.formRowLabel}>Notes</span>
            <Input.TextArea value={createNotes} onChange={(e) => setCreateNotes(e.target.value)} placeholder="Add notes..." rows={3} />
          </div>
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
              <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button type="primary" onClick={() => setShowEditModal(false)}>Save changes</Button>
            </>
          }
        >
          <div className={styles.formStack}>
            <Alert
              variant="info"
              icon={
                <InfoCircleOutlined
                  // eslint-disable-next-line no-restricted-syntax -- blue-600 icon color matches info Alert semantic (not purple primary tone)
                  style={{ fontSize: 16, color: "#2563eb" }}
                />
              }
            >
              Client won&apos;t be notified of changes. To do this, use Reschedule.
            </Alert>
            <Form layout="vertical">
              <Form.Item label="Location">
                <Select defaultValue="Hands Together Therapy (East)" options={[
                  { value: "Hands Together Therapy (East)", label: "Hands Together Therapy (East)" },
                  { value: "Hands Together Therapy (West)", label: "Hands Together Therapy (West)" },
                ]} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item label="Practitioner *">
                <Select defaultValue={selectedAppt.practitionerName} options={practitioners.map((p) => ({ value: p.name, label: p.name }))} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item label="Client *">
                <Input type="text" defaultValue={selectedAppt.clientName} />
              </Form.Item>
              <Form.Item label="Service *">
                <Input type="text" defaultValue={selectedAppt.type} />
              </Form.Item>
              <Form.Item label="Case">
                <Select options={[{ value: "", label: "Choose a case" }]} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item label="Date *">
                <Input type="date" defaultValue={selectedAppt.date} />
              </Form.Item>
              <div className={styles.formGrid2}>
                <Form.Item label="Time *">
                  <Select defaultValue={selectedAppt.startTime} options={TIME_OPTIONS.map((t) => ({ value: t, label: t }))} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="&nbsp;">
                  <Select defaultValue={selectedAppt.endTime} options={TIME_OPTIONS.map((t) => ({ value: t, label: t }))} style={{ width: "100%" }} />
                </Form.Item>
              </div>
              <Form.Item label="Room/Resource">
                <Select value={editRoom} onChange={setEditRoom} options={[
                  { value: "", label: "Choose a room/resource" },
                  { value: "green", label: "Green (1 available of 1)" },
                  { value: "red", label: "Red (1 available of 1)" },
                  { value: "blue", label: "Blue (2 available of 2)" },
                  { value: "car", label: "Car (1 available of 1)" },
                  { value: "room1", label: "Room 1 (1 available of 1)" },
                ]} style={{ width: "100%" }} />
              </Form.Item>
            </Form>
            <Toggle checked={editRepeat} onChange={setEditRepeat} label="Repeat" />
            {editRepeat && (
              <div className={styles.repeatSection}>
                <Form layout="vertical">
                  <Form.Item label="Repeat">
                    <Select options={[
                      { value: "2weeks", label: "Every 2 weeks" },
                      { value: "weekly", label: "Every week" },
                      { value: "3weeks", label: "Every 3 weeks" },
                      { value: "4weeks", label: "Every 4 weeks" },
                    ]} style={{ width: "100%" }} />
                  </Form.Item>
                </Form>
                <div>
                  <label className={styles.sectionLabel}>Repeat on *</label>
                  <div className={styles.dayPicker}>
                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                      <Button key={d} type={d === "Mo" ? "primary" : "default"} size="small" shape="circle">{d}</Button>
                    ))}
                  </div>
                </div>
                <Form layout="vertical">
                  <Form.Item label="Ends">
                    <Select options={[
                      { value: "6", label: "After 6 times" },
                      { value: "4", label: "After 4 times" },
                      { value: "8", label: "After 8 times" },
                      { value: "12", label: "After 12 times" },
                      { value: "date", label: "On date" },
                    ]} style={{ width: "100%" }} />
                  </Form.Item>
                </Form>
              </div>
            )}
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
            <div className={styles.notificationBox}>
              <div className={styles.notificationHeader}>
                <MailOutlined style={{ fontSize: 16, color: 'var(--ant-color-primary, #8250FF)' }} />
                <Text variant="label/lg" as="span" color="text">Notification preview</Text>
              </div>
              <Text variant="body/sm" as="p" color="secondary" style={{ marginBottom: 12 }}>
                Client won&apos;t be notified of changes. To notify the client, use Reschedule instead.
              </Text>
              <div className={styles.notificationPreview}>
                <Text variant="body/sm" as="p" color="secondary">If using Reschedule, the client will receive:</Text>
                <div className={styles.emailPreview}>
                  <Text variant="body/sm" as="p" color="secondary">Subject: <Text as="span" color="text">Your appointment has been rescheduled</Text></Text>
                  <Text variant="body/sm" as="p" color="secondary" style={{ marginTop: 4 }}>
                    Hi {selectedAppt.clientName.split(" ")[0]}, your appointment with {selectedAppt.practitionerName} has been moved to a new time. Please check your updated appointment details.
                  </Text>
                </div>
              </div>
            </div>
            <div className={styles.changeLogSection}>
              <div className={styles.changeLogHeader}>
                <HistoryOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
                <Text variant="label/lg" as="span" color="text">Change log</Text>
              </div>
              <div className={styles.changeLogEntries}>
                {[
                  { date: "24 Mar 2026, 2:15 pm", user: "Hrishikesh Koli", action: "Created appointment" },
                  { date: "24 Mar 2026, 3:42 pm", user: "Sharon Tan", action: "Changed room from Green to Blue" },
                  { date: "25 Mar 2026, 9:10 am", user: "Hrishikesh Koli", action: "Updated service to Initial Consultation" },
                ].map((log, i) => (
                  <div key={i} className={styles.changeLogEntry}>
                    <div className={styles.logDot} />
                    <div className={styles.changeLogEntryContent}>
                      <Text variant="body/sm" as="p" color="text">{log.action}</Text>
                      <Text variant="caption/md" as="p" color="secondary">{log.user} · {log.date}</Text>
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

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const prevMonthLast = new Date(year, month, 0).getDate();
  const cells: { day: number; month: number; year: number; isCurrentMonth: boolean }[] = [];

  for (let i = startDow - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLast - i, month: month - 1, year, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month, year, isCurrentMonth: true });
  }
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
    <div className={styles.monthContainer}>
      <div className={styles.monthDowRow}>
        {DOW_LABELS.map((d) => (
          <div key={d} className={styles.monthDowLabel}>{d}</div>
        ))}
      </div>

      {rows.map((row, ri) => (
        <div key={ri} className={styles.monthWeekRow}>
          {row.map((cell, ci) => {
            const ds = dateStr(cell);
            const isToday = ds === todayStr;
            const dayAppts = appointments.filter((a) => a.date === ds);

            return (
              <div key={ci} className={cell.isCurrentMonth ? styles.monthDayCell : styles.monthDayCellOther}>
                {isToday ? (
                  <div className={styles.monthTodayBadge}>{cell.day}</div>
                ) : (
                  <div className={cell.isCurrentMonth ? styles.monthDayNumber : styles.monthDayNumberOther}>{cell.day}</div>
                )}
                <div className={styles.monthAppts}>
                  {dayAppts.slice(0, 3).map((appt) => {
                    const isCancelled = appt.status === "Cancelled";
                    const isGroup = appt.type === "Group Session";
                    return (
                      <div
                        key={appt.id}
                        className={isCancelled ? styles.monthApptChipCancelled : styles.monthApptChip}
                        // eslint-disable-next-line no-restricted-syntax -- per-appointment practitioner color (dynamic)
                        style={{ backgroundColor: lightenColor(appt.practitionerColor, 0.7) }}
                        onClick={() => onApptClick(appt)}
                      >
                        <span className={styles.monthApptText}>
                          {formatTime12h(appt.startTime)} {appt.clientName}
                        </span>
                        {isCancelled && (
                          <span className={styles.monthCancelBadge}>
                            <CloseOutlined style={{ fontSize: 10, color: '#FFFFFF' }} />
                          </span>
                        )}
                        {isGroup && !isCancelled && (
                          <span className={styles.monthGroupBadge}>0/10</span>
                        )}
                      </div>
                    );
                  })}
                  {dayAppts.length > 3 && (
                    <div className={styles.monthMore}>{dayAppts.length - 3} more</div>
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
}: {
  appt: Appointment;
  onClose: () => void;
  onEdit: () => void;
  isMonthView: boolean;
}) {
  const isGroup = isGroupAppointment(appt);

  return (
    <Drawer
      open
      onClose={onClose}
      side="right"
      size="lg"
      title={appt.type}
      description={appt.clientName}
      footer={
        <div style={{ display: "flex", gap: 8 }}>
          {!isGroup && (
            <Button size="small">Book another</Button>
          )}
          <Button size="small" onClick={onEdit}>Edit</Button>
          <Button size="small">Reschedule</Button>
          <Button size="small">Archive</Button>
          <Button type="link" size="small">View change log</Button>
        </div>
      }
    >
      {/* Practitioner colour band */}
      <div
        // eslint-disable-next-line no-restricted-syntax -- per-appointment practitioner color (dynamic header band)
        style={{ backgroundColor: appt.practitionerColor, margin: "-20px -20px 16px", padding: "8px 20px", display: "flex", alignItems: "center", gap: 8 }}
      >
        <ColorDot color="#fff" size="sm" />
        <Text variant="heading/sm" as="span" color="inverted">{appt.type}</Text>
      </div>

      {isGroup ? (
        <GroupAppointmentDetails appt={appt} />
      ) : (
        <SingleAppointmentDetails appt={appt} />
      )}
    </Drawer>
  );
}

function SingleAppointmentDetails({ appt }: { appt: Appointment }) {
  return (
    <div className={styles.detailRows}>
      <div className={styles.detailRow}>
        <EnvironmentOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)', marginTop: 2 }} />
        <div>
          <Text as="span" color="text">{appt.practitionerName}</Text>
          <Text as="span" color="secondary"> at </Text>
          <Text variant="label/lg" as="span" color="text">East Clinics</Text>
        </div>
      </div>
      <div className={styles.detailRowCenter}>
        <Avatar name={appt.practitionerName} color={appt.practitionerColor} size="sm" />
        <Text as="span" color="text">{appt.practitionerName}</Text>
      </div>
      <div className={styles.detailRow}>
        <ClockCircleOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)', marginTop: 2 }} />
        <Text as="span" color="text">
          {appt.startTime}, {formatDateLong(appt.date)} for {calcDuration(appt.startTime, appt.endTime)}
        </Text>
      </div>
      <div className={styles.detailRow}>
        <UserOutlined style={{ fontSize: 16, color: 'var(--ant-color-primary, #8250FF)', marginTop: 2 }} />
        <span className={styles.linkTextMedium}>{appt.clientName}</span>
      </div>
      <div className={styles.detailRow}>
        <MailOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)', marginTop: 2 }} />
        <Text as="span" color="secondary">thyxueen@gmail.com</Text>
      </div>
      <div className={styles.detailRow}>
        <div className={styles.statusDot} />
        <Flex align="center" gap={4} style={{ cursor: 'pointer' }}>
          <Text as="span" color="secondary">No status</Text>
          <DownOutlined style={{ fontSize: 10, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
        </Flex>
      </div>
      <div className={styles.detailRow}>
        <VideoCameraOutlined style={{ fontSize: 16, color: 'var(--ant-color-primary, #8250FF)', marginTop: 2 }} />
        <span className={styles.linkText}>Create zoom meeting</span>
      </div>
      <div className={styles.detailRowCenter}>
        <FileTextOutlined style={{ fontSize: 16, color: 'var(--ant-color-primary, #8250FF)', marginTop: 2 }} />
        <span className={styles.linkText}>TRR-005673</span>
        <Badge variant="blue">Draft</Badge>
      </div>
      <div className={styles.detailRow}>
        <StopOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)', marginTop: 2 }} />
        <span className={styles.linkText}>Mark as Do not Invoice?</span>
      </div>
      <div className={styles.detailRow}>
        <FileTextOutlined style={{ fontSize: 16, color: 'var(--ant-color-primary, #8250FF)', marginTop: 2 }} />
        <span className={styles.linkText}>Add progress note</span>
      </div>
      <div className={styles.detailRow}>
        <SyncOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)', marginTop: 2 }} />
        <Text variant="caption/md" as="span" color="secondary">Repeating every 2 weeks on Monday for 6 times</Text>
      </div>
      <div className={styles.detailRowCenter}>
        <Avatar name={appt.practitionerName} color={appt.practitionerColor} size="sm" />
        <Text as="span" color="secondary">{appt.practitionerName} (Organiser)</Text>
      </div>
      <div className={styles.detailSection}>
        <label className={styles.noteLabel}>
          <FileTextOutlined style={{ fontSize: 12, color: 'var(--ant-color-text, #414549)' }} /> Note
        </label>
        <Input.TextArea rows={3} placeholder="Add a note..." />
      </div>
    </div>
  );
}

function GroupAppointmentDetails({ appt }: { appt: Appointment }) {
  return (
    <div className={styles.detailRows}>
      <div className={styles.detailRow}>
        <EnvironmentOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)', marginTop: 2 }} />
        <div>
          <Text as="span" color="text">{appt.practitionerName}</Text>
          <Text as="span" color="secondary"> at </Text>
          <Text variant="label/lg" as="span" color="text">East Clinics</Text>
        </div>
      </div>
      <div className={styles.detailRowCenter}>
        <Avatar name={appt.practitionerName} color={appt.practitionerColor} size="sm" />
        <Text as="span" color="text">{appt.practitionerName}</Text>
      </div>
      <div className={styles.detailRow}>
        <ClockCircleOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)', marginTop: 2 }} />
        <Text as="span" color="text">
          {appt.startTime}, {formatDateLong(appt.date)} for {calcDuration(appt.startTime, appt.endTime)}
        </Text>
      </div>
      <div className={styles.detailRow}>
        <VideoCameraOutlined style={{ fontSize: 16, color: 'var(--ant-color-primary, #8250FF)', marginTop: 2 }} />
        <span className={styles.linkText}>Create zoom meeting</span>
      </div>
      <div className={styles.detailRow}>
        <DesktopOutlined style={{ fontSize: 16, color: 'var(--ant-color-primary, #8250FF)', marginTop: 2 }} />
        <span className={styles.linkText}>Create Microsoft Teams meeting</span>
      </div>
      <div className={styles.attendeesHeader}>
        <Flex align="center" gap={8}>
          <TeamOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
          <Text as="span" color="secondary">1 of 6 clients attending</Text>
        </Flex>
        <Button size="small">
          <UserAddOutlined style={{ fontSize: 12, color: 'var(--ant-color-text, #414549)' }} /> Client
        </Button>
      </div>
      <div className={styles.attendeeList}>
        <div className={styles.attendeeRow}>
          <Avatar name="elsa frozen" size="sm" />
          <span>elsa frozen</span>
        </div>
      </div>
      <div className={styles.detailRowCenter}>
        <Avatar name="Meghna Damodaran" color={appt.practitionerColor} size="sm" />
        <Text as="span" color="secondary">Meghna Damodaran (Organiser)</Text>
      </div>
      <div className={styles.detailSection}>
        <label className={styles.noteLabel}>
          <FileTextOutlined style={{ fontSize: 12, color: 'var(--ant-color-text, #414549)' }} /> Note
        </label>
        <Input.TextArea rows={3} placeholder="Add a note..." />
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
