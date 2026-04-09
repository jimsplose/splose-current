"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Flex } from "antd";
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
import { Button, Badge, FormInput, FormSelect, FormTextarea, Modal, Toggle, Avatar, ColorDot, Alert, Dropdown, Card, RadioGroup } from "@/components/ds";
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
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const practitionerDropdownRef = useRef<HTMLDivElement>(null);

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
            <LeftOutlined style={{ fontSize: 16 }} />
          </button>
          <button className={styles.iconBtn}>
            <RightOutlined style={{ fontSize: 16 }} />
          </button>
          <span className={styles.dateLabel}>{toolbarDateLabel}</span>
          <button className={styles.iconBtnSecondary}>
            <FilterOutlined style={{ fontSize: 16 }} />
          </button>
          <button className={styles.iconBtnSecondary}>
            <SettingOutlined style={{ fontSize: 16 }} />
          </button>
          <button className={styles.iconBtnSecondary}>
            <CalendarOutlined style={{ fontSize: 16 }} />
          </button>
          <button className={styles.iconBtnSecondary}>
            <BulbOutlined style={{ fontSize: 16 }} />
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
                      <SearchOutlined style={{ fontSize: 14, color: "var(--color-text-secondary)" }} />
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
                        {locationFilter === "all" && <CheckOutlined style={{ fontSize: 12, color: "white" }} />}
                      </div>
                      <span style={{ fontWeight: 500 }}>Select all</span>
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
                            {locationFilter === loc && <CheckOutlined style={{ fontSize: 12, color: "white" }} />}
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
                      <SearchOutlined style={{ fontSize: 14, color: "var(--color-text-secondary)" }} />
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
                        {practitionerFilter === "all" && <CheckOutlined style={{ fontSize: 12, color: "white" }} />}
                      </div>
                      <span style={{ fontWeight: 500 }}>All practitioners</span>
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
                                {practitionerFilter === p.id && <CheckOutlined style={{ fontSize: 12, color: "white" }} />}
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

            <Dropdown
              trigger={
                <button className={styles.dropdownTrigger}>
                  {calendarMode} <span className={styles.dropdownArrow}>&#9662;</span>
                </button>
              }
              items={[
                { label: "Calendar", value: "Calendar" },
                { label: "Rooms/resources", value: "Rooms/resources" },
              ]}
              onSelect={(v) => setCalendarMode(v as CalendarMode)}
              align="right"
            />

            <Dropdown
              trigger={
                <button className={styles.dropdownTrigger}>
                  {viewMode} <span className={styles.dropdownArrow}>&#9662;</span>
                </button>
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
                              <div
                                key={prac.id}
                                className={styles.dayViewPracCell}
                                style={{
                                  height: HOUR_HEIGHT,
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
                                    <div
                                      key={appt.id}
                                      className={styles.apptBlock}
                                      style={{
                                        backgroundColor: lightenColor(appt.practitionerColor, 0.7),
                                        color: "rgb(0, 0, 0)",
                                        opacity: appt.status === "Cancelled" ? 0.5 : 1,
                                        ...pos,
                                      }}
                                      onClick={(e) => { e.stopPropagation(); setSelectedAppt(appt); }}
                                    >
                                      <p className={styles.apptClientName}>{appt.clientName} {getStatusIcons(appt)}</p>
                                      <p className={styles.apptTime}>{formatTime12h(appt.startTime)} – {formatTime12h(appt.endTime)}</p>
                                      <p className={styles.apptType}>{appt.type}</p>
                                    </div>
                                  );
                                })}
                              </div>
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
                                    <div
                                      key={prac.id}
                                      className={styles.pracSubCol}
                                      style={{
                                        ...(useFlexible ? { flex: 1 } : { width: COL_W }),
                                        backgroundColor: isUnavailable ? "#f0f0f0" : gi % 2 === 0 ? "#f3f4f6" : "#ffffff",
                                      }}
                                      onClick={(e) => handleCellClick(e, dateStr, hour)}
                                    >
                                      {hourAppts.map((appt) => {
                                        const pos = getApptStyle(appt);
                                        return (
                                          <div
                                            key={appt.id}
                                            className={styles.apptBlockSmall}
                                            style={{
                                              backgroundColor: lightenColor(appt.practitionerColor, 0.7),
                                              color: "rgb(0, 0, 0)",
                                              opacity: appt.status === "Cancelled" ? 0.5 : 1,
                                              ...pos,
                                            }}
                                            onClick={(e) => { e.stopPropagation(); setSelectedAppt(appt); }}
                                          >
                                            <p className={styles.apptClientName}>{appt.clientName} {getStatusIcons(appt)}</p>
                                            <p className={styles.apptTime}>{formatTime12h(appt.startTime)}</p>
                                            <p className={styles.apptType}>{appt.type}</p>
                                          </div>
                                        );
                                      })}
                                    </div>
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
              <AppstoreOutlined style={{ fontSize: 32, color: "#9ca3af" }} />
            </div>
            <p className="text-body-md text-text-secondary">Rooms/Resources view</p>
            <p className="text-caption-md text-text-secondary" style={{ marginTop: 4 }}>Select rooms to display in the calendar</p>
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
          <Card padding="none" style={{ boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: "12px 12px 4px" }}>
              <p className="text-heading-sm text-text">{popover.time}</p>
            </div>
            <div style={{ padding: "4px 0" }}>
              <Button
                variant="ghost"
                style={{ width: '100%', justifyContent: 'flex-start', gap: 10, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}
                onClick={() => setPopover((prev) => ({ ...prev, visible: false }))}
              >
                <ClockCircleOutlined style={{ fontSize: 16, color: "var(--color-text-secondary)" }} />
                Support activity
              </Button>
              <Button
                variant="ghost"
                style={{ width: '100%', justifyContent: 'flex-start', gap: 10, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}
                onClick={() => setPopover((prev) => ({ ...prev, visible: false }))}
              >
                <StopOutlined style={{ fontSize: 16, color: "var(--color-text-secondary)" }} />
                Busy time
              </Button>
              <Button
                variant="ghost"
                style={{ width: '100%', justifyContent: 'flex-start', gap: 10, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}
                onClick={() => openCreateModal(popover.dateStr, popover.hour, popover.minute, popover.practitionerId)}
              >
                <CalendarOutlined style={{ fontSize: 16, color: "var(--color-text-secondary)" }} />
                Appointment
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
        title="New appointment"
        maxWidth="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowCreateModal(false)}>Create</Button>
          </>
        }
      >
        <div className={styles.formStack}>
          {createDate && isDateInPast(createDate) && (
            <Alert variant="warning" icon={<WarningOutlined style={{ fontSize: 16, color: "#ca8a04" }} />}>
              This appointment is in the past. Are you sure you want to create it?
            </Alert>
          )}
          <FormSelect label="Location" value={createLocation} onChange={setCreateLocation} options={[
            { value: "Hands Together Therapy (East)", label: "Hands Together Therapy (East)" },
            { value: "Hands Together Therapy (West)", label: "Hands Together Therapy (West)" },
          ]} />
          <FormSelect label="Practitioner *" value={createPractitioner} onChange={setCreatePractitioner} options={practitioners.map((p) => ({ value: p.id, label: p.name }))} />
          <FormInput label="Client *" type="text" value={createClient} onChange={(e) => setCreateClient(e.target.value)} placeholder="Start typing to search client..." />
          {!createClient && (
            <div>
              <p className={styles.sectionLabel}>Recent clients</p>
              <div className={styles.clientChips}>
                {["Sarah Johnson", "Marcus Lee", "Priya Patel", "Tom Nguyen"].map((name) => (
                  <button key={name} type="button" onClick={() => setCreateClient(name)} className={styles.clientChip}>
                    <UserOutlined style={{ fontSize: 14 }} />
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <FormSelect label="Service *" value={createService} onChange={setCreateService} options={[
            { value: "", label: "Select a service" },
            { value: "initial-assessment", label: "Initial Assessment" },
            { value: "follow-up", label: "Follow Up" },
            { value: "review", label: "Review" },
            { value: "group-session", label: "Group Session" },
            { value: "targeted-services", label: "Targeted Services (Goodstart)" },
            { value: "capacity-building", label: "Capacity Building" },
          ]} />
          <FormSelect label="Case" value={createCase} onChange={setCreateCase} options={[{ value: "", label: "Choose a case" }]} />
          <FormInput label="Date *" type="date" value={createDate} onChange={(e) => setCreateDate(e.target.value)} />
          <div className={styles.formGrid2}>
            <FormSelect label="Start time *" value={createTime} onChange={setCreateTime} options={TIME_OPTIONS.map((t) => ({ value: t, label: t }))} />
            <FormSelect label="End time *" value={createEndTime} onChange={setCreateEndTime} options={TIME_OPTIONS.map((t) => ({ value: t, label: t }))} />
          </div>
          {createTime && createTime.includes("AM") && (
            <Alert variant="warning" icon={<WarningOutlined style={{ fontSize: 16, color: "#ca8a04" }} />}>
              <span style={{ fontWeight: 500 }}>Scheduling conflict:</span> {createPractitioner ? practitioners.find(p => p.id === createPractitioner)?.name || "Practitioner" : "Practitioner"} already has an appointment at {createTime}. Double-check before confirming.
            </Alert>
          )}
          <FormSelect label="Room/Resource" value={createRoom} onChange={setCreateRoom} options={[
            { value: "", label: "Choose a room/resource" },
            { value: "green", label: "Green (1 available of 1)" },
            { value: "red", label: "Red (1 available of 1)" },
            { value: "blue", label: "Blue (2 available of 2)" },
            { value: "room1", label: "Room 1 (1 available of 1)" },
          ]} />
          <Toggle checked={createProviderTravel} onChange={setCreateProviderTravel} label="Provider travel" />
          <Toggle checked={createProviderTravelNonLabour} onChange={setCreateProviderTravelNonLabour} label="Provider Travel - Non-Labour Costs" />
          <Toggle checked={createActivityTransport} onChange={setCreateActivityTransport} label="Activity Based Transport" />
          <Toggle checked={createRepeat} onChange={setCreateRepeat} label="Repeat" />
          {createRepeat && (
            <div className={styles.repeatSection}>
              <FormSelect label="Repeat" options={[
                { value: "weekly", label: "Every week" },
                { value: "2weeks", label: "Every 2 weeks" },
                { value: "3weeks", label: "Every 3 weeks" },
                { value: "4weeks", label: "Every 4 weeks" },
              ]} />
              <div>
                <label className={styles.sectionLabel}>Repeat on *</label>
                <div className={styles.dayPicker}>
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                    <Button key={d} variant={d === "Mo" ? "primary" : "secondary"} size="sm" round>{d}</Button>
                  ))}
                </div>
              </div>
              <FormSelect label="Ends" options={[
                { value: "6", label: "After 6 times" },
                { value: "4", label: "After 4 times" },
                { value: "8", label: "After 8 times" },
                { value: "12", label: "After 12 times" },
                { value: "date", label: "On date" },
              ]} />
            </div>
          )}
          <div className={styles.waitlistBox}>
            <Button variant="ghost" size="sm" style={{ width: "100%", justifyContent: "space-between" }}>
              <span className="text-label-lg text-text">Waitlist matches (2)</span>
              <DownOutlined style={{ fontSize: 16, color: "var(--color-text-secondary)" }} />
            </Button>
          </div>
          <FormTextarea label="Notes" value={createNotes} onChange={(e) => setCreateNotes(e.target.value)} placeholder="Add notes..." rows={3} />
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
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setShowEditModal(false)}>Save changes</Button>
            </>
          }
        >
          <div className={styles.formStack}>
            <Alert variant="info" icon={<InfoCircleOutlined style={{ fontSize: 16, color: "#2563eb" }} />}>
              Client won&apos;t be notified of changes. To do this, use Reschedule.
            </Alert>
            <FormSelect label="Location" defaultValue="Hands Together Therapy (East)" options={[
              { value: "Hands Together Therapy (East)", label: "Hands Together Therapy (East)" },
              { value: "Hands Together Therapy (West)", label: "Hands Together Therapy (West)" },
            ]} />
            <FormSelect label="Practitioner *" defaultValue={selectedAppt.practitionerName} options={practitioners.map((p) => ({ value: p.name, label: p.name }))} />
            <FormInput label="Client *" type="text" defaultValue={selectedAppt.clientName} />
            <FormInput label="Service *" type="text" defaultValue={selectedAppt.type} />
            <FormSelect label="Case" options={[{ value: "", label: "Choose a case" }]} />
            <FormInput label="Date *" type="date" defaultValue={selectedAppt.date} />
            <div className={styles.formGrid2}>
              <FormSelect label="Time *" defaultValue={selectedAppt.startTime} options={TIME_OPTIONS.map((t) => ({ value: t, label: t }))} />
              <FormSelect label="&nbsp;" defaultValue={selectedAppt.endTime} options={TIME_OPTIONS.map((t) => ({ value: t, label: t }))} />
            </div>
            <FormSelect label="Room/Resource" value={editRoom} onChange={setEditRoom} options={[
              { value: "", label: "Choose a room/resource" },
              { value: "green", label: "Green (1 available of 1)" },
              { value: "red", label: "Red (1 available of 1)" },
              { value: "blue", label: "Blue (2 available of 2)" },
              { value: "car", label: "Car (1 available of 1)" },
              { value: "room1", label: "Room 1 (1 available of 1)" },
            ]} />
            <Toggle checked={editRepeat} onChange={setEditRepeat} label="Repeat" />
            {editRepeat && (
              <div className={styles.repeatSection}>
                <FormSelect label="Repeat" options={[
                  { value: "2weeks", label: "Every 2 weeks" },
                  { value: "weekly", label: "Every week" },
                  { value: "3weeks", label: "Every 3 weeks" },
                  { value: "4weeks", label: "Every 4 weeks" },
                ]} />
                <div>
                  <label className={styles.sectionLabel}>Repeat on *</label>
                  <div className={styles.dayPicker}>
                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                      <Button key={d} variant={d === "Mo" ? "primary" : "secondary"} size="sm" round>{d}</Button>
                    ))}
                  </div>
                </div>
                <FormSelect label="Ends" options={[
                  { value: "6", label: "After 6 times" },
                  { value: "4", label: "After 4 times" },
                  { value: "8", label: "After 8 times" },
                  { value: "12", label: "After 12 times" },
                  { value: "date", label: "On date" },
                ]} />
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
                <MailOutlined style={{ fontSize: 16, color: "var(--color-primary)" }} />
                <span className="text-label-lg text-text">Notification preview</span>
              </div>
              <p className="text-body-sm text-text-secondary" style={{ marginBottom: 12 }}>
                Client won&apos;t be notified of changes. To notify the client, use Reschedule instead.
              </p>
              <div className={styles.notificationPreview}>
                <p className="text-body-sm text-text-secondary">If using Reschedule, the client will receive:</p>
                <div className={styles.emailPreview}>
                  <p className="text-body-sm text-text-secondary">Subject: <span className="text-text">Your appointment has been rescheduled</span></p>
                  <p className="text-body-sm text-text-secondary" style={{ marginTop: 4 }}>
                    Hi {selectedAppt.clientName.split(" ")[0]}, your appointment with {selectedAppt.practitionerName} has been moved to a new time. Please check your updated appointment details.
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.changeLogSection}>
              <div className={styles.changeLogHeader}>
                <HistoryOutlined style={{ fontSize: 16, color: "var(--color-text-secondary)" }} />
                <span className="text-label-lg text-text">Change log</span>
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
                        style={{ backgroundColor: lightenColor(appt.practitionerColor, 0.7) }}
                        onClick={() => onApptClick(appt)}
                      >
                        <span className={styles.monthApptText}>
                          {formatTime12h(appt.startTime)} {appt.clientName}
                        </span>
                        {isCancelled && (
                          <span className={styles.monthCancelBadge}>
                            <CloseOutlined style={{ fontSize: 10, color: "white" }} />
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
  isMonthView,
}: {
  appt: Appointment;
  onClose: () => void;
  onEdit: () => void;
  isMonthView: boolean;
}) {
  const isGroup = isGroupAppointment(appt);

  return (
    <>
      <div className={styles.sidePanelBackdrop} onClick={onClose} />
      <div className={styles.sidePanelFixed}>
        <div className={styles.sidePanelContent}>
          <div className={styles.sidePanelHeader}>
            <div className={styles.sidePanelTitle}>
              <ColorDot color={appt.practitionerColor} size="sm" />
              <span className="text-heading-sm text-text">
                {appt.clientName} ({appt.type})
              </span>
            </div>
            <Button variant="icon" size="sm" onClick={onClose}>
              <CloseOutlined style={{ fontSize: 16, color: "var(--color-text-secondary)" }} />
            </Button>
          </div>

          {isGroup ? (
            <GroupAppointmentDetails appt={appt} />
          ) : (
            <SingleAppointmentDetails appt={appt} />
          )}

          <div className={styles.actionButtons}>
            {!isGroup && (
              <Button variant="secondary" size="sm">Book another</Button>
            )}
            <Button variant="secondary" size="sm" onClick={onEdit}>Edit</Button>
            <Button variant="secondary" size="sm">Reschedule</Button>
            <Button variant="danger" size="sm">Archive</Button>
          </div>

          <div className={styles.changeLogLink}>
            <Button variant="link">
              <HistoryOutlined style={{ fontSize: 14 }} />
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
    <div className={styles.detailRows}>
      <div className={styles.detailRow}>
        <EnvironmentOutlined style={{ fontSize: 16, color: "var(--color-text-secondary)", marginTop: 2 }} />
        <div>
          <span className="text-text">{appt.practitionerName}</span>
          <span className="text-text-secondary"> at </span>
          <span className="text-text" style={{ fontWeight: 500 }}>East Clinics</span>
        </div>
      </div>
      <div className={styles.detailRowCenter}>
        <Avatar name={appt.practitionerName} color={appt.practitionerColor} size="sm" />
        <span className="text-text">{appt.practitionerName}</span>
      </div>
      <div className={styles.detailRow}>
        <ClockCircleOutlined style={{ fontSize: 16, color: "var(--color-text-secondary)", marginTop: 2 }} />
        <span className="text-text">
          {appt.startTime}, {formatDateLong(appt.date)} for {calcDuration(appt.startTime, appt.endTime)}
        </span>
      </div>
      <div className={styles.detailRow}>
        <UserOutlined style={{ fontSize: 16, color: "var(--color-primary)", marginTop: 2 }} />
        <span className={styles.linkTextMedium}>{appt.clientName}</span>
      </div>
      <div className={styles.detailRow}>
        <MailOutlined style={{ fontSize: 16, color: "var(--color-text-secondary)", marginTop: 2 }} />
        <span className="text-text-secondary">thyxueen@gmail.com</span>
      </div>
      <div className={styles.detailRow}>
        <div className={styles.statusDot} />
        <span className="text-text-secondary">No status</span>
      </div>
      <div className={styles.detailRow}>
        <VideoCameraOutlined style={{ fontSize: 16, color: "var(--color-primary)", marginTop: 2 }} />
        <span className={styles.linkText}>Create zoom meeting</span>
      </div>
      <div className={styles.detailRowCenter}>
        <FileTextOutlined style={{ fontSize: 16, color: "var(--color-primary)", marginTop: 2 }} />
        <span className={styles.linkText}>TRR-005673</span>
        <Badge variant="blue">Draft</Badge>
      </div>
      <div className={styles.detailRow}>
        <StopOutlined style={{ fontSize: 16, color: "var(--color-text-secondary)", marginTop: 2 }} />
        <span className={styles.linkText}>Mark as Do not Invoice?</span>
      </div>
      <div className={styles.detailRow}>
        <FileTextOutlined style={{ fontSize: 16, color: "var(--color-primary)", marginTop: 2 }} />
        <span className={styles.linkText}>Add progress note</span>
      </div>
      <div className={styles.detailRow}>
        <SyncOutlined style={{ fontSize: 16, color: "var(--color-text-secondary)", marginTop: 2 }} />
        <span className="text-caption-md text-text-secondary">Repeating every 2 weeks on Monday for 6 times</span>
      </div>
      <div className={styles.detailRowCenter}>
        <Avatar name={appt.practitionerName} color={appt.practitionerColor} size="sm" />
        <span className="text-text-secondary">{appt.practitionerName} (Organiser)</span>
      </div>
      <div className={styles.detailSection}>
        <label className={styles.noteLabel}>
          <FileTextOutlined style={{ fontSize: 12 }} /> Note
        </label>
        <FormTextarea rows={3} placeholder="Add a note..." />
      </div>
    </div>
  );
}

function GroupAppointmentDetails({ appt }: { appt: Appointment }) {
  return (
    <div className={styles.detailRows}>
      <div className={styles.detailRow}>
        <EnvironmentOutlined style={{ fontSize: 16, color: "var(--color-text-secondary)", marginTop: 2 }} />
        <div>
          <span className="text-text">{appt.practitionerName}</span>
          <span className="text-text-secondary"> at </span>
          <span className="text-text" style={{ fontWeight: 500 }}>East Clinics</span>
        </div>
      </div>
      <div className={styles.detailRowCenter}>
        <Avatar name={appt.practitionerName} color={appt.practitionerColor} size="sm" />
        <span className="text-text">{appt.practitionerName}</span>
      </div>
      <div className={styles.detailRow}>
        <ClockCircleOutlined style={{ fontSize: 16, color: "var(--color-text-secondary)", marginTop: 2 }} />
        <span className="text-text">
          {appt.startTime}, {formatDateLong(appt.date)} for {calcDuration(appt.startTime, appt.endTime)}
        </span>
      </div>
      <div className={styles.detailRow}>
        <VideoCameraOutlined style={{ fontSize: 16, color: "var(--color-primary)", marginTop: 2 }} />
        <span className={styles.linkText}>Create zoom meeting</span>
      </div>
      <div className={styles.detailRow}>
        <DesktopOutlined style={{ fontSize: 16, color: "var(--color-primary)", marginTop: 2 }} />
        <span className={styles.linkText}>Create Microsoft Teams meeting</span>
      </div>
      <div className={styles.attendeesHeader}>
        <Flex align="center" gap={8}>
          <TeamOutlined style={{ fontSize: 16, color: "var(--color-text-secondary)" }} />
          <span className="text-text-secondary">1 of 6 clients attending</span>
        </Flex>
        <Button variant="secondary" size="sm">
          <UserAddOutlined style={{ fontSize: 12 }} /> Client
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
        <span className="text-text-secondary">Meghna Damodaran (Organiser)</span>
      </div>
      <div className={styles.detailSection}>
        <label className={styles.noteLabel}>
          <FileTextOutlined style={{ fontSize: 12 }} /> Note
        </label>
        <FormTextarea rows={3} placeholder="Add a note..." />
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
