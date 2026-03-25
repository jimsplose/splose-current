"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, Button, Card, ColorDot } from "@/components/ds";
import { ChevronDown, ChevronRight } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────── */

interface Appointment {
  id: string;
  startTime: string;
  type: string;
  client: { firstName: string; lastName: string };
  practitioner: { name: string; color: string };
}

interface UnsignedNote {
  id: string;
  date: string;
  client: { firstName: string; lastName: string };
  practitioner: { name: string };
}

interface DashboardClientProps {
  todayAppointments: Appointment[];
  unsignedNotes: UnsignedNote[];
}

/* ─── Income chart data ──────────────────────────────────────────────── */

const incomeData = [
  { month: "Sep-2025", invoices: 8, payments: 1 },
  { month: "Oct-2025", invoices: 15, payments: 3 },
  { month: "Nov-2025", invoices: 40, payments: 8 },
  { month: "Dec-2025", invoices: 95, payments: 2 },
  { month: "Jan-2026", invoices: 10, payments: 1 },
  { month: "Feb-2026", invoices: 5, payments: 1 },
  { month: "Mar-2026", invoices: 18, payments: 5 },
];

const maxVal = Math.max(...incomeData.map((d) => Math.max(d.invoices, d.payments)));

/* ─── Static message data ────────────────────────────────────────────── */

const staticMessages = [
  {
    id: "msg-1",
    sender: "Joseph Go",
    color: "#f59e0b",
    time: "9:48 pm",
    preview: "Shared an image",
    fullContent: "Hey team, check out this new layout mockup I put together for the patient intake form. Let me know your thoughts!",
    type: "image" as const,
  },
  {
    id: "msg-2",
    sender: "Joseph Go",
    color: "#f59e0b",
    time: "9:50 pm",
    preview: "Shared a sticker",
    fullContent: "Looking forward to the team meeting tomorrow. We should discuss the Q2 roadmap and new feature priorities.",
    type: "sticker" as const,
  },
  {
    id: "msg-3",
    sender: "Hao Wang",
    color: "#16a34a",
    time: "3:56 pm",
    preview: "Shared the Splose logo",
    fullContent: "Just updated the Splose branding assets. The new logo files are in the shared drive under /design/brand-2026/.",
    type: "logo" as const,
  },
  {
    id: "msg-4",
    sender: "Joseph Go",
    color: "#f59e0b",
    time: "10:18 pm",
    preview: "MADE IT HOME",
    fullContent: "Made it home safe from the conference. Great presentations today - especially the one on telehealth integration. Will share my notes tomorrow.",
    type: "image" as const,
  },
];

const recentForms = [
  { id: 1, name: "Hao Wang (TEST IMAGE FORM)", time: "8:15 pm, Tue 10 Mar 2026" },
  { id: 2, name: "Skyler Peterson (TEST IMAGE FORM)", time: "12:45 pm, Mon 9 Mar 2026" },
  { id: 3, name: "DDDDDDD Hun (Test form saved in A Jr)", time: "10:21 am, Fri 6 Mar 2026" },
  { id: 4, name: "a a (A)", time: "4:55 pm, Thu 5 Mar 2026" },
  { id: 5, name: "A Jr (Test form File upload pdf)", time: "4:02 pm, Thu 5 Mar 2026" },
];

const incompleteNotes = [
  { name: "Skyler Peterson (Bill Gates Demo)", time: "10:04 am, Wed 11 Mar 2026" },
  { name: "A Del (AAA TEST)", time: "3:43 am, Wed 11 Mar 2026" },
  { name: "Ethan McKenzie (BIRP Treatment Note - AI Blocks Demo)", time: "1:34 pm, Tue 10 Mar 2026" },
  { name: "Shaz Test (AAA TEST)", time: "1:22 pm, Tue 10 Mar 2026" },
  { name: "A Jr (Temp progress note test 6March26)", time: "10:16 am, Fri 6 Mar 2026" },
];

/* ─── Helpers ────────────────────────────────────────────────────────── */

function formatDateTime(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    const time = d.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" });
    const date = d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    return `${time}, ${date}`;
  } catch {
    return dateStr;
  }
}

/* ─── Income Chart Bar with Tooltip ──────────────────────────────────── */

function ChartBar({ item }: { item: typeof incomeData[number] }) {
  const [hovered, setHovered] = useState<"invoices" | "payments" | null>(null);

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="relative flex w-full items-end justify-center gap-px" style={{ height: "100%" }}>
        {/* Invoice bar */}
        <div
          className="w-3 rounded-t-sm transition-opacity"
          style={{
            height: `${(item.invoices / maxVal) * 100}%`,
            backgroundColor: "#bef264",
            minHeight: item.invoices > 0 ? "2px" : "0",
            opacity: hovered === "payments" ? 0.5 : 1,
          }}
          onMouseEnter={() => setHovered("invoices")}
          onMouseLeave={() => setHovered(null)}
        />
        {/* Payment bar */}
        <div
          className="w-3 rounded-t-sm transition-opacity"
          style={{
            height: `${(item.payments / maxVal) * 100}%`,
            backgroundColor: "#c084fc",
            minHeight: item.payments > 0 ? "2px" : "0",
            opacity: hovered === "invoices" ? 0.5 : 1,
          }}
          onMouseEnter={() => setHovered("payments")}
          onMouseLeave={() => setHovered(null)}
        />
        {/* Tooltip */}
        {hovered && (
          <div className="pointer-events-none absolute -top-14 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2.5 py-1.5 text-caption-sm text-white shadow-lg">
            <div className="font-semibold">{item.month}</div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: "#bef264" }} />
              Invoices: ${(item.invoices * 100).toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: "#c084fc" }} />
              Payments: ${(item.payments * 100).toLocaleString()}
            </div>
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-800" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Expandable Message ─────────────────────────────────────────────── */

function MessageItem({
  message,
  expanded,
  onToggle,
}: {
  message: typeof staticMessages[number];
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="flex cursor-pointer items-start gap-2.5 rounded-lg px-1 py-1 transition-colors hover:bg-gray-50"
      onClick={onToggle}
    >
      <Avatar name={message.sender} color={message.color} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[14px] font-bold text-text">{message.sender}</span>
          <span className="text-[10px] text-text-secondary">{message.time}</span>
          <span className="ml-auto text-text-secondary">
            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </span>
        </div>
        {!expanded && (
          <p className="mt-0.5 truncate text-body-md text-text-secondary">{message.preview}</p>
        )}
        {expanded && (
          <div className="mt-1.5 space-y-2">
            {/* The visual element */}
            {message.type === "image" && message.id === "msg-1" && (
              <div className="flex h-36 w-48 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-gray-300 to-gray-400">
                <div className="h-full w-full scale-110 bg-gradient-to-br from-pink-200 via-gray-300 to-blue-200 blur-[12px]" />
              </div>
            )}
            {message.type === "sticker" && (
              <div className="flex h-40 w-40 flex-col items-center justify-center gap-1 rounded-lg bg-gradient-to-br from-sky-200 to-sky-400">
                <div className="relative h-16 w-14 rounded-t-full bg-sky-500">
                  <div className="absolute -left-1 -top-2 h-4 w-3 rotate-[-15deg] rounded-tl-full bg-sky-500" />
                  <div className="absolute -right-1 -top-2 h-4 w-3 rotate-[15deg] rounded-tr-full bg-sky-500" />
                  <div className="absolute left-2 top-4 h-2 w-2 rounded-full bg-white" />
                  <div className="absolute right-2 top-4 h-2 w-2 rounded-full bg-white" />
                </div>
                <span className="text-caption-sm font-bold text-sky-800">STFCRS5</span>
              </div>
            )}
            {message.type === "logo" && (
              <div className="flex h-40 w-48 items-center justify-center rounded-lg bg-gradient-to-br from-green-100 to-green-300">
                <span className="text-5xl font-bold text-green-600">S</span>
              </div>
            )}
            {message.type === "image" && message.id === "msg-4" && (
              <div className="flex h-36 w-48 flex-col items-center justify-center gap-1 rounded-lg bg-gradient-to-br from-amber-100 to-amber-300">
                <span className="text-body-md-strong text-amber-800">MADE IT HOME</span>
                <div className="relative h-14 w-16 rounded-t-full bg-amber-400/60">
                  <div className="absolute -left-0.5 -top-1.5 h-3 w-2.5 rotate-[-15deg] rounded-tl-full bg-amber-400/60" />
                  <div className="absolute -right-0.5 -top-1.5 h-3 w-2.5 rotate-[15deg] rounded-tr-full bg-amber-400/60" />
                </div>
              </div>
            )}
            {/* Full text content */}
            <p className="text-body-md text-text-secondary">{message.fullContent}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Client Component ──────────────────────────────────────────── */

export default function DashboardClient({ todayAppointments, unsignedNotes }: DashboardClientProps) {
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  const toggleMessage = (id: string) => {
    setExpandedMessages((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-3rem)] gap-[14px] p-[7px]">
      {/* Left column -- Messages (col1: wider) */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border">
        <div className="border-b border-border bg-surface-header px-4 py-4">
          <h2 className="text-label-lg text-text">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-2">
          <div className="space-y-4">
            <div className="flex items-center justify-center py-2">
              <span className="text-caption-md text-text-secondary">
                {new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>

            {todayAppointments.slice(0, 5).map((appt) => (
              <div key={appt.id} className="flex items-start gap-2.5">
                <Avatar name={appt.practitioner.name} color={appt.practitioner.color} size="sm" />
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-heading-sm text-text">
                      {appt.practitioner.name}
                    </span>
                    <span className="text-caption-sm text-text-secondary">{appt.startTime}</span>
                  </div>
                  <p className="mt-0.5 text-body-md text-text-secondary">
                    Appointment with {appt.client.firstName} {appt.client.lastName} -- {appt.type}
                  </p>
                </div>
              </div>
            ))}

            {todayAppointments.length === 0 && (
              <>
                {staticMessages.map((msg, idx) => (
                  <div key={msg.id}>
                    {idx === 1 && (
                      <div className="flex items-center justify-center py-1">
                        <span className="text-caption-md text-text-secondary">9 Feb 2026</span>
                      </div>
                    )}
                    {idx === 2 && (
                      <div className="flex items-center justify-center py-1">
                        <span className="cursor-pointer text-caption-md text-text-secondary" title="Click to go forward, hold to see history">16 Feb 2026</span>
                      </div>
                    )}
                    <MessageItem
                      message={msg}
                      expanded={expandedMessages.has(msg.id)}
                      onToggle={() => toggleMessage(msg.id)}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="border-t border-border p-3">
          <Card padding="none" className="mb-2 min-h-[80px] px-3 py-2 text-body-md text-text-secondary">
            Type a message...
          </Card>
          <div className="flex items-center gap-0.5 text-text-secondary">
            <Button variant="icon" size="sm" className="text-body-md-strong" title="Bold">B</Button>
            <Button variant="icon" size="sm" className="text-body-md italic" title="Italic">I</Button>
            <Button variant="icon" size="sm" className="text-body-md underline" title="Underline">U</Button>
            <Button variant="icon" size="sm" className="text-body-md" title="Text size">A<sub className="text-caption-sm">1</sub></Button>
            <span className="mx-0.5 h-4 w-px bg-border" />
            <Button variant="icon" size="sm" title="Table">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="12" height="12" rx="1"/><line x1="2" y1="6" x2="14" y2="6"/><line x1="2" y1="10" x2="14" y2="10"/><line x1="6" y1="2" x2="6" y2="14"/><line x1="10" y1="2" x2="10" y2="14"/></svg>
            </Button>
            <Button variant="icon" size="sm" title="Link">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6.5 9.5a3 3 0 004.2.1l2-2a3 3 0 00-4.2-4.3l-1.1 1.1"/><path d="M9.5 6.5a3 3 0 00-4.2-.1l-2 2a3 3 0 004.2 4.3l1.1-1.1"/></svg>
            </Button>
            <Button variant="icon" size="sm" title="Image">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="12" height="12" rx="1"/><circle cx="5.5" cy="5.5" r="1"/><path d="M14 10l-3-3-7 7"/></svg>
            </Button>
            <Button variant="icon" size="sm" title="Emoji">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M5.5 6.5h.01M10.5 6.5h.01"/><path d="M5.5 9.5a3.5 3.5 0 005 0"/></svg>
            </Button>
            <Button variant="icon" size="sm" title="Align">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="2" y1="3" x2="14" y2="3"/><line x1="2" y1="6" x2="10" y2="6"/><line x1="2" y1="9" x2="14" y2="9"/><line x1="2" y1="12" x2="10" y2="12"/></svg>
            </Button>
            <Button variant="icon" size="sm" title="List">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="5" y1="3" x2="14" y2="3"/><line x1="5" y1="8" x2="14" y2="8"/><line x1="5" y1="13" x2="14" y2="13"/><circle cx="2.5" cy="3" r="0.75" fill="currentColor"/><circle cx="2.5" cy="8" r="0.75" fill="currentColor"/><circle cx="2.5" cy="13" r="0.75" fill="currentColor"/></svg>
            </Button>
            <span className="mx-0.5 h-4 w-px bg-border" />
            <Button variant="icon" size="sm" title="More">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>
            </Button>
            <div className="flex-1" />
            <span className="mr-1 cursor-pointer rounded px-1.5 py-0.5 text-label-md text-text-secondary hover:bg-gray-100">GIF</span>
            <Button variant="primary" size="sm" className="text-body-md">
              Send
            </Button>
          </div>
        </div>
      </div>

      {/* Right column -- Analytics (col2: narrower) */}
      <div className="flex w-[380px] shrink-0 flex-col gap-[7px]">
        {/* Income card */}
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <div className="border-b border-border bg-surface-header px-4 py-4">
            <h3 className="text-label-lg text-text">Income</h3>
          </div>
          <div className="px-4 pt-3 pb-4">
            <div className="relative h-52">
              <div className="absolute bottom-6 left-0 top-0 flex flex-col justify-between pr-1 text-caption-sm text-text-secondary">
                <span>500K</span>
                <span>400K</span>
                <span>300K</span>
                <span>200K</span>
                <span>100K</span>
                <span>0</span>
              </div>
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-caption-sm text-text-secondary">
                Values
              </div>
              <div className="absolute bottom-6 left-7 right-0 top-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-0 border-b border-gray-100" />
                ))}
              </div>
              <div className="ml-8 flex h-[calc(100%-24px)] items-end gap-1">
                {incomeData.map((item) => (
                  <ChartBar key={item.month} item={item} />
                ))}
              </div>
              <div className="ml-8 flex h-12">
                {incomeData.map((item) => (
                  <div key={item.month} className="flex-1 pt-1">
                    <span className="inline-block -rotate-45 origin-top-left whitespace-nowrap text-[10px] text-text-secondary">{item.month.replace("-", " ")}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-1 flex items-center justify-center gap-4 text-caption-md text-text-secondary">
              <span className="flex items-center gap-1.5">
                <ColorDot color="#bef264" size="xs" className="h-2.5 w-2.5" /> Invoices
              </span>
              <span className="flex items-center gap-1.5">
                <ColorDot color="#c084fc" size="xs" className="h-2.5 w-2.5" /> Payments
              </span>
            </div>
          </div>
        </div>

        {/* Incomplete progress notes card */}
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <div className="border-b border-border bg-surface-header px-4 py-4">
            <h3 className="text-label-lg text-text">Incomplete progress notes</h3>
          </div>
          <div className="px-4 pt-3 pb-3">
            <div className="space-y-1.5">
              {unsignedNotes.length === 0 ? (
                <>
                  {incompleteNotes.map((note) => (
                    <div key={note.name} className="flex items-start justify-between gap-2 py-0.5">
                      <span className="cursor-pointer text-body-md text-primary hover:underline">
                        {note.name}
                      </span>
                      <span className="shrink-0 whitespace-nowrap pt-0.5 text-caption-sm text-text-secondary">
                        {note.time}
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                unsignedNotes.map((note) => (
                  <div key={note.id} className="flex items-start justify-between gap-2 py-0.5">
                    <span className="cursor-pointer text-body-md text-primary hover:underline">
                      {note.client.firstName} {note.client.lastName} ({note.practitioner.name})
                    </span>
                    <span className="shrink-0 whitespace-nowrap pt-0.5 text-caption-sm text-text-secondary">
                      {formatDateTime(note.date)}
                    </span>
                  </div>
                ))
              )}
              <Button variant="link" className="mt-1">Load more</Button>
            </div>
          </div>
        </div>

        {/* Recently submitted forms card */}
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <div className="border-b border-border bg-surface-header px-4 py-4">
            <h3 className="text-label-lg text-text">Recently submitted forms</h3>
          </div>
          <div className="px-4 pt-3 pb-3">
            <div className="space-y-1.5">
              {recentForms.map((form) => (
                <div key={form.id} className="flex items-start justify-between gap-2 py-0.5">
                  <Link
                    href={`/patient-form/${form.id}/view`}
                    className="cursor-pointer text-body-md text-primary hover:underline"
                  >
                    {form.name}
                  </Link>
                  <span className="shrink-0 whitespace-nowrap pt-0.5 text-caption-sm text-text-secondary">
                    {form.time}
                  </span>
                </div>
              ))}
              <Button variant="link" className="mt-1">Load more</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
