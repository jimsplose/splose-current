"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, Button, Card, ColorDot } from "@/components/ds";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import styles from "./DashboardClient.module.css";

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
    color: "var(--color-warning)",
    time: "9:48 pm",
    preview: "Shared an image",
    fullContent: "Hey team, check out this new layout mockup I put together for the patient intake form. Let me know your thoughts!",
    type: "image" as const,
  },
  {
    id: "msg-2",
    sender: "Joseph Go",
    color: "var(--color-warning)",
    time: "9:50 pm",
    preview: "Shared a sticker",
    fullContent: "Looking forward to the team meeting tomorrow. We should discuss the Q2 roadmap and new feature priorities.",
    type: "sticker" as const,
  },
  {
    id: "msg-3",
    sender: "Hao Wang",
    color: "var(--color-success)",
    time: "3:56 pm",
    preview: "Shared the Splose logo",
    fullContent: "Just updated the Splose branding assets. The new logo files are in the shared drive under /design/brand-2026/.",
    type: "logo" as const,
  },
  {
    id: "msg-4",
    sender: "Joseph Go",
    color: "var(--color-warning)",
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
    <Flex vertical align="center" style={{ flex: 1 }}>
      <div style={{ position: 'relative', display: 'flex', width: '100%', alignItems: 'flex-end', justifyContent: 'center', gap: 1, height: '100%' }}>
        {/* Invoice bar */}
        <div
          style={{
            width: 12,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            transition: 'opacity 0.2s',
            height: `${(item.invoices / maxVal) * 100}%`,
            backgroundColor: "#bef264",
            minHeight: item.invoices > 0 ? 2 : 0,
            opacity: hovered === "payments" ? 0.5 : 1,
          }}
          onMouseEnter={() => setHovered("invoices")}
          onMouseLeave={() => setHovered(null)}
        />
        {/* Payment bar */}
        <div
          style={{
            width: 12,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            transition: 'opacity 0.2s',
            height: `${(item.payments / maxVal) * 100}%`,
            backgroundColor: "#c084fc",
            minHeight: item.payments > 0 ? 2 : 0,
            opacity: hovered === "invoices" ? 0.5 : 1,
          }}
          onMouseEnter={() => setHovered("payments")}
          onMouseLeave={() => setHovered(null)}
        />
        {/* Tooltip */}
        {hovered && (
          <div className="text-caption-sm" style={{ pointerEvents: 'none', position: 'absolute', top: -56, left: '50%', zIndex: 10, transform: 'translateX(-50%)', whiteSpace: 'nowrap', borderRadius: 4, backgroundColor: '#1f2937', padding: '6px 10px', color: 'white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontWeight: 600 }}>{item.month}</div>
            <Flex align="center" gap={6}>
              <span style={{ display: 'inline-block', height: 8, width: 8, borderRadius: 2, backgroundColor: "#bef264" }} />
              Invoices: ${(item.invoices * 100).toLocaleString()}
            </Flex>
            <Flex align="center" gap={6}>
              <span style={{ display: 'inline-block', height: 8, width: 8, borderRadius: 2, backgroundColor: "#c084fc" }} />
              Payments: ${(item.payments * 100).toLocaleString()}
            </Flex>
            <div style={{ position: 'absolute', bottom: -4, left: '50%', height: 8, width: 8, transform: 'translateX(-50%) rotate(45deg)', backgroundColor: '#1f2937' }} />
          </div>
        )}
      </div>
    </Flex>
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
    <Flex
      gap={10}
      align="flex-start"
      style={{ cursor: 'pointer', borderRadius: 8, padding: 4, transition: 'background-color 0.2s' }}
      className={styles.messageItem}
      onClick={onToggle}
    >
      <Avatar name={message.sender} color={message.color} size="sm" />
      <div style={{ minWidth: 0, flex: 1 }}>
        <Flex align="baseline" gap={6}>
          <span className="text-body-md" style={{ fontWeight: 700, color: 'var(--color-text)' }}>{message.sender}</span>
          <span className="text-caption-sm" style={{ color: 'var(--color-text-secondary)' }}>{message.time}</span>
          <span style={{ marginLeft: 'auto', color: 'var(--color-text-secondary)' }}>
            {expanded ? <DownOutlined style={{ fontSize: 14 }} /> : <RightOutlined style={{ fontSize: 14 }} />}
          </span>
        </Flex>
        {!expanded && (
          <p className="text-body-md" style={{ marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-text-secondary)' }}>{message.preview}</p>
        )}
        {expanded && (
          <Flex vertical gap={8} style={{ marginTop: 6 }}>
            {/* The visual element */}
            {message.type === "image" && message.id === "msg-1" && (
              <div style={{ display: 'flex', height: 144, width: 192, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 8, background: 'linear-gradient(to bottom right, #d1d5db, #9ca3af)' }}>
                <div style={{ height: '100%', width: '100%', transform: 'scale(1.1)', background: 'linear-gradient(to bottom right, #fbcfe8, #d1d5db, #bfdbfe)', filter: 'blur(12px)' }} />
              </div>
            )}
            {message.type === "sticker" && (
              <Flex vertical align="center" justify="center" gap={4} style={{ height: 160, width: 160, borderRadius: 8, background: 'linear-gradient(to bottom right, #bae6fd, #38bdf8)' }}>
                <div style={{ position: 'relative', height: 64, width: 56, borderTopLeftRadius: 9999, borderTopRightRadius: 9999, backgroundColor: '#0ea5e9' }}>
                  <div style={{ position: 'absolute', left: -4, top: -8, height: 16, width: 12, transform: 'rotate(-15deg)', borderTopLeftRadius: 9999, backgroundColor: '#0ea5e9' }} />
                  <div style={{ position: 'absolute', right: -4, top: -8, height: 16, width: 12, transform: 'rotate(15deg)', borderTopRightRadius: 9999, backgroundColor: '#0ea5e9' }} />
                  <div style={{ position: 'absolute', left: 8, top: 16, height: 8, width: 8, borderRadius: 9999, backgroundColor: 'white' }} />
                  <div style={{ position: 'absolute', right: 8, top: 16, height: 8, width: 8, borderRadius: 9999, backgroundColor: 'white' }} />
                </div>
                <span className="text-caption-sm" style={{ fontWeight: 700, color: '#075985' }}>STFCRS5</span>
              </Flex>
            )}
            {message.type === "logo" && (
              <Flex align="center" justify="center" style={{ height: 160, width: 192, borderRadius: 8, background: 'linear-gradient(to bottom right, #dcfce7, #86efac)' }}>
                <span style={{ fontSize: 48, fontWeight: 700, color: '#16a34a' }}>S</span>
              </Flex>
            )}
            {message.type === "image" && message.id === "msg-4" && (
              <Flex vertical align="center" justify="center" gap={4} style={{ height: 144, width: 192, borderRadius: 8, background: 'linear-gradient(to bottom right, #fef3c7, #fcd34d)' }}>
                <span className="text-body-md-strong" style={{ color: '#92400e' }}>MADE IT HOME</span>
                <div style={{ position: 'relative', height: 56, width: 64, borderTopLeftRadius: 9999, borderTopRightRadius: 9999, backgroundColor: 'rgba(251, 191, 36, 0.6)' }}>
                  <div style={{ position: 'absolute', left: -2, top: -6, height: 12, width: 10, transform: 'rotate(-15deg)', borderTopLeftRadius: 9999, backgroundColor: 'rgba(251, 191, 36, 0.6)' }} />
                  <div style={{ position: 'absolute', right: -2, top: -6, height: 12, width: 10, transform: 'rotate(15deg)', borderTopRightRadius: 9999, backgroundColor: 'rgba(251, 191, 36, 0.6)' }} />
                </div>
              </Flex>
            )}
            {/* Full text content */}
            <p className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>{message.fullContent}</p>
          </Flex>
        )}
      </div>
    </Flex>
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
    <Flex style={{ minHeight: 'calc(100vh - 3rem)', gap: 14, padding: 7 }}>
      {/* Left column -- Messages (col1: wider) */}
      <Flex vertical style={{ flex: 1, overflow: 'hidden', borderRadius: 8, border: '1px solid var(--color-border)' }}>
        <div style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-fill-quaternary)', padding: 16 }}>
          <h2 className="text-label-lg" style={{ color: 'var(--color-text)' }}>Messages</h2>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingLeft: 16, paddingRight: 16, paddingBottom: 8 }}>
          <Flex vertical gap={16}>
            <Flex align="center" justify="center" style={{ paddingTop: 8, paddingBottom: 8 }}>
              <span className="text-caption-md" style={{ color: 'var(--color-text-secondary)' }}>
                {new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </Flex>

            {todayAppointments.slice(0, 5).map((appt) => (
              <Flex key={appt.id} align="flex-start" gap={10}>
                <Avatar name={appt.practitioner.name} color={appt.practitioner.color} size="sm" />
                <div style={{ minWidth: 0 }}>
                  <Flex align="baseline" gap={6}>
                    <span className="text-heading-sm" style={{ color: 'var(--color-text)' }}>
                      {appt.practitioner.name}
                    </span>
                    <span className="text-caption-sm" style={{ color: 'var(--color-text-secondary)' }}>{appt.startTime}</span>
                  </Flex>
                  <p className="text-body-md" style={{ marginTop: 2, color: 'var(--color-text-secondary)' }}>
                    Appointment with {appt.client.firstName} {appt.client.lastName} -- {appt.type}
                  </p>
                </div>
              </Flex>
            ))}

            {todayAppointments.length === 0 && (
              <>
                {staticMessages.map((msg, idx) => (
                  <div key={msg.id}>
                    {idx === 1 && (
                      <Flex align="center" justify="center" style={{ paddingTop: 4, paddingBottom: 4 }}>
                        <span className="text-caption-md" style={{ color: 'var(--color-text-secondary)' }}>9 Feb 2026</span>
                      </Flex>
                    )}
                    {idx === 2 && (
                      <Flex align="center" justify="center" style={{ paddingTop: 4, paddingBottom: 4 }}>
                        <span className="text-caption-md" style={{ cursor: 'pointer', color: 'var(--color-text-secondary)' }} title="Click to go forward, hold to see history">16 Feb 2026</span>
                      </Flex>
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
          </Flex>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', padding: 12 }}>
          <Card padding="none" className="text-body-md" style={{ marginBottom: 8, minHeight: 80, padding: '8px 12px', color: 'var(--color-text-secondary)' }}>
            Type a message...
          </Card>
          <Flex align="center" gap={2} style={{ color: 'var(--color-text-secondary)' }}>
            <Button variant="icon" size="sm" className="text-body-md-strong" title="Bold">B</Button>
            <Button variant="icon" size="sm" className="text-body-md" style={{ fontStyle: 'italic' }} title="Italic">I</Button>
            <Button variant="icon" size="sm" className="text-body-md" style={{ textDecoration: 'underline' }} title="Underline">U</Button>
            <Button variant="icon" size="sm" className="text-body-md" title="Text size">A<sub className="text-caption-sm">1</sub></Button>
            <span style={{ marginLeft: 2, marginRight: 2, height: 16, width: 1, backgroundColor: 'var(--color-border)' }} />
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
            <span style={{ marginLeft: 2, marginRight: 2, height: 16, width: 1, backgroundColor: 'var(--color-border)' }} />
            <Button variant="icon" size="sm" title="More">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>
            </Button>
            <div style={{ flex: 1 }} />
            <span className={`text-label-md ${styles.gifButton}`} style={{ marginRight: 4, cursor: 'pointer', borderRadius: 4, padding: '2px 6px', color: 'var(--color-text-secondary)' }}>GIF</span>
            <Button variant="primary" size="sm" className="text-body-md">
              Send
            </Button>
          </Flex>
        </div>
      </Flex>

      {/* Right column -- Analytics (col2: narrower) */}
      <Flex vertical gap={7} style={{ width: 380, flexShrink: 0 }}>
        {/* Income card */}
        <div style={{ overflow: 'hidden', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'white' }}>
          <div style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-fill-quaternary)', padding: 16 }}>
            <h3 className="text-label-lg" style={{ color: 'var(--color-text)' }}>Income</h3>
          </div>
          <div style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 16 }}>
            <div style={{ position: 'relative', height: 208 }}>
              <Flex vertical justify="space-between" className="text-caption-sm" style={{ position: 'absolute', bottom: 24, left: 0, top: 0, paddingRight: 4, color: 'var(--color-text-secondary)' }}>
                <span>500K</span>
                <span>400K</span>
                <span>300K</span>
                <span>200K</span>
                <span>100K</span>
                <span>0</span>
              </Flex>
              <div className="text-caption-sm" style={{ position: 'absolute', left: -16, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', whiteSpace: 'nowrap', color: 'var(--color-text-secondary)' }}>
                Values
              </div>
              <Flex vertical justify="space-between" style={{ position: 'absolute', bottom: 24, left: 28, right: 0, top: 0 }}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} style={{ height: 0, borderBottom: '1px solid #f3f4f6' }} />
                ))}
              </Flex>
              <Flex align="flex-end" gap={4} style={{ marginLeft: 32, height: 'calc(100% - 24px)' }}>
                {incomeData.map((item) => (
                  <ChartBar key={item.month} item={item} />
                ))}
              </Flex>
              <Flex style={{ marginLeft: 32, height: 48 }}>
                {incomeData.map((item) => (
                  <div key={item.month} style={{ flex: 1, paddingTop: 4 }}>
                    <span className="text-caption-sm" style={{ display: 'inline-block', transform: 'rotate(-45deg)', transformOrigin: 'top left', whiteSpace: 'nowrap', color: 'var(--color-text-secondary)' }}>{item.month.replace("-", " ")}</span>
                  </div>
                ))}
              </Flex>
            </div>
            <Flex align="center" justify="center" gap={16} className="text-caption-md" style={{ marginTop: 4, color: 'var(--color-text-secondary)' }}>
              <Flex align="center" gap={6}>
                <ColorDot color="#bef264" size="xs" className="h-2.5 w-2.5" /> Invoices
              </Flex>
              <Flex align="center" gap={6}>
                <ColorDot color="#c084fc" size="xs" className="h-2.5 w-2.5" /> Payments
              </Flex>
            </Flex>
          </div>
        </div>

        {/* Incomplete progress notes card */}
        <div style={{ overflow: 'hidden', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'white' }}>
          <div style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-fill-quaternary)', padding: 16 }}>
            <h3 className="text-label-lg" style={{ color: 'var(--color-text)' }}>Incomplete progress notes</h3>
          </div>
          <div style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>
            <Flex vertical gap={6}>
              {unsignedNotes.length === 0 ? (
                <>
                  {incompleteNotes.map((note) => (
                    <Flex key={note.name} align="flex-start" justify="space-between" gap={8} style={{ paddingTop: 2, paddingBottom: 2 }}>
                      <span className="text-body-md hover:underline" style={{ cursor: 'pointer', color: 'var(--color-primary)' }}>
                        {note.name}
                      </span>
                      <span className="text-caption-sm" style={{ flexShrink: 0, whiteSpace: 'nowrap', paddingTop: 2, color: 'var(--color-text-secondary)' }}>
                        {note.time}
                      </span>
                    </Flex>
                  ))}
                </>
              ) : (
                unsignedNotes.map((note) => (
                  <Flex key={note.id} align="flex-start" justify="space-between" gap={8} style={{ paddingTop: 2, paddingBottom: 2 }}>
                    <span className="text-body-md hover:underline" style={{ cursor: 'pointer', color: 'var(--color-primary)' }}>
                      {note.client.firstName} {note.client.lastName} ({note.practitioner.name})
                    </span>
                    <span className="text-caption-sm" style={{ flexShrink: 0, whiteSpace: 'nowrap', paddingTop: 2, color: 'var(--color-text-secondary)' }}>
                      {formatDateTime(note.date)}
                    </span>
                  </Flex>
                ))
              )}
              <Button variant="link" style={{ marginTop: 4 }}>Load more</Button>
            </Flex>
          </div>
        </div>

        {/* Recently submitted forms card */}
        <div style={{ overflow: 'hidden', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'white' }}>
          <div style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-fill-quaternary)', padding: 16 }}>
            <h3 className="text-label-lg" style={{ color: 'var(--color-text)' }}>Recently submitted forms</h3>
          </div>
          <div style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>
            <Flex vertical gap={6}>
              {recentForms.map((form) => (
                <Flex key={form.id} align="flex-start" justify="space-between" gap={8} style={{ paddingTop: 2, paddingBottom: 2 }}>
                  <Link
                    href={`/patient-form/${form.id}/view`}
                    className="text-body-md hover:underline"
                    style={{ cursor: 'pointer', color: 'var(--color-primary)' }}
                  >
                    {form.name}
                  </Link>
                  <span className="text-caption-sm" style={{ flexShrink: 0, whiteSpace: 'nowrap', paddingTop: 2, color: 'var(--color-text-secondary)' }}>
                    {form.time}
                  </span>
                </Flex>
              ))}
              <Button variant="link" style={{ marginTop: 4 }}>Load more</Button>
            </Flex>
          </div>
        </div>
      </Flex>
    </Flex>
  );
}
