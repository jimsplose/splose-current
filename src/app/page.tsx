import { prisma } from "@/lib/prisma";
import {
  SquarePen,
  Bold,
  Italic,
  Underline,
  Type,
  Paperclip,
  List,
  ListOrdered,
  Send,
  Hash,
  ChevronDown,
  CheckSquare,
  Square,
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const [todayAppointments, recentInvoices, unsignedNotes] = await Promise.all([
    prisma.appointment.findMany({
      where: { date: new Date().toISOString().split("T")[0] },
      include: { client: true, practitioner: true },
      orderBy: { startTime: "asc" },
    }),
    prisma.invoice.findMany({
      include: { client: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.clinicalNote.findMany({
      where: { signed: false },
      include: { client: true, practitioner: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return { todayAppointments, recentInvoices, unsignedNotes };
}

export default async function Dashboard() {
  const data = await getDashboardData();

  const channels = [
    { name: "General", active: true },
    { name: "Clinical", active: false },
    { name: "Admin", active: false },
  ];

  const tasks = [
    { label: "Review NDIS plan for Sophie Anderson", done: false },
    { label: "Follow up with Michael Brooks re: intake", done: true },
    { label: "Submit monthly NDIS claiming batch", done: false },
    { label: "Update practitioner availability for April", done: false },
  ];

  return (
    <div className="flex min-h-[calc(100vh-3rem)]">
      {/* Left column — Messages */}
      <div className="flex flex-1 flex-col border-r border-border bg-white">
        {/* Messages header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <h2 className="text-sm font-semibold text-text">Messages</h2>
          <button className="rounded-md p-1.5 text-text-secondary hover:bg-gray-100" title="New message">
            <SquarePen className="h-4 w-4" />
          </button>
        </div>

        {/* Channel tabs */}
        <div className="flex items-center gap-0 border-b border-border px-2">
          {channels.map((ch) => (
            <button
              key={ch.name}
              className={`relative flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors ${
                ch.active
                  ? "text-primary"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              <Hash className="h-3.5 w-3.5" />
              {ch.name}
              {ch.active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="space-y-5">
            {/* Date separator */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-text-secondary">
                {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {data.todayAppointments.slice(0, 5).map((appt) => (
              <div key={appt.id} className="group flex items-start gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: appt.practitioner.color }}
                >
                  {appt.practitioner.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-text">
                      {appt.practitioner.name}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {appt.startTime}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm leading-relaxed text-text-secondary">
                    Appointment with{" "}
                    <span className="font-medium text-text">
                      {appt.client.firstName} {appt.client.lastName}
                    </span>{" "}
                    — {appt.type}
                  </p>
                </div>
              </div>
            ))}

            {data.todayAppointments.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-text-secondary">
                  No messages yet today. Start a conversation!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Compose area */}
        <div className="border-t border-border bg-white p-3">
          <div className="rounded-lg border border-border focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
            <div className="min-h-[72px] px-3 py-2.5 text-sm text-text-secondary">
              Write a message...
            </div>
            <div className="flex items-center gap-0.5 border-t border-border px-2 py-1.5">
              <button className="rounded p-1.5 text-text-secondary hover:bg-gray-100 hover:text-text" title="Bold">
                <Bold className="h-4 w-4" />
              </button>
              <button className="rounded p-1.5 text-text-secondary hover:bg-gray-100 hover:text-text" title="Italic">
                <Italic className="h-4 w-4" />
              </button>
              <button className="rounded p-1.5 text-text-secondary hover:bg-gray-100 hover:text-text" title="Underline">
                <Underline className="h-4 w-4" />
              </button>
              <button className="rounded p-1.5 text-text-secondary hover:bg-gray-100 hover:text-text" title="Font size">
                <Type className="h-4 w-4" />
              </button>
              <div className="mx-1 h-4 w-px bg-border" />
              <button className="rounded p-1.5 text-text-secondary hover:bg-gray-100 hover:text-text" title="Attach file">
                <Paperclip className="h-4 w-4" />
              </button>
              <button className="rounded p-1.5 text-text-secondary hover:bg-gray-100 hover:text-text" title="Bulleted list">
                <List className="h-4 w-4" />
              </button>
              <button className="rounded p-1.5 text-text-secondary hover:bg-gray-100 hover:text-text" title="Numbered list">
                <ListOrdered className="h-4 w-4" />
              </button>
              <div className="flex-1" />
              <span className="mr-2 cursor-pointer text-xs font-medium text-text-secondary hover:text-text">
                GIF
              </span>
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark">
                <Send className="h-3.5 w-3.5" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right column — Insights */}
      <div className="w-[400px] shrink-0 overflow-y-auto bg-gray-50/50">
        {/* Insights header */}
        <div className="border-b border-border bg-white px-4 py-2.5">
          <h2 className="text-sm font-semibold text-text">Insights</h2>
        </div>

        {/* Income chart area */}
        <div className="border-b border-border bg-white p-4">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text">Income</h3>
            <button className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-text">
              Last 7 months
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <div className="relative mt-3 h-44 rounded-lg bg-gray-50 p-3">
            {/* Y-axis labels */}
            <div className="absolute left-2 top-3 bottom-7 flex flex-col justify-between text-[10px] text-text-secondary">
              <span>500K</span>
              <span>400K</span>
              <span>300K</span>
              <span>200K</span>
              <span>100K</span>
              <span>0</span>
            </div>
            {/* Horizontal grid lines */}
            <div className="absolute left-9 right-3 top-3 bottom-7 flex flex-col justify-between">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-px bg-gray-200" />
              ))}
            </div>
            {/* Chart bars */}
            <div className="ml-8 flex h-full items-end gap-2 pb-6">
              {[
                { month: "Sep", invoices: 3, payments: 1 },
                { month: "Oct", invoices: 8, payments: 2 },
                { month: "Nov", invoices: 15, payments: 5 },
                { month: "Dec", invoices: 80, payments: 10 },
                { month: "Jan", invoices: 5, payments: 3 },
                { month: "Feb", invoices: 8, payments: 2 },
                { month: "Mar", invoices: 12, payments: 4 },
              ].map((item) => (
                <div key={item.month} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="flex w-full items-end justify-center gap-0.5"
                    style={{ height: "110px" }}
                  >
                    <div
                      className="w-3 rounded-t bg-lime-400 transition-all"
                      style={{ height: `${item.invoices}%` }}
                    />
                    <div
                      className="w-3 rounded-t bg-primary-light transition-all"
                      style={{ height: `${item.payments}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-text-secondary">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-center gap-5 text-xs text-text-secondary">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-lime-400" /> Invoices
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-primary-light" /> Payments
            </span>
          </div>
        </div>

        {/* Incomplete progress notes */}
        <div className="border-b border-border bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-text">
            Incomplete progress notes
          </h3>
          <div className="space-y-2.5">
            {data.unsignedNotes.length === 0 ? (
              <p className="text-sm text-text-secondary">No incomplete notes</p>
            ) : (
              data.unsignedNotes.map((note) => (
                <div key={note.id} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="cursor-pointer text-sm font-medium text-primary hover:underline">
                      {note.client.firstName} {note.client.lastName}
                    </span>
                    <span className="text-sm text-text-secondary">
                      {" "}({note.practitioner.name})
                    </span>
                  </div>
                  <span className="shrink-0 text-xs text-text-secondary">
                    {formatDateTime(note.date)}
                  </span>
                </div>
              ))
            )}
            <button className="mt-1 text-sm font-medium text-primary hover:underline">
              Load more
            </button>
          </div>
        </div>

        {/* Recently submitted forms */}
        <div className="border-b border-border bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-text">
            Recently submitted forms
          </h3>
          <div className="space-y-2.5">
            {[
              { client: "Michael Brooks", form: "Intake Form", time: "8:15 pm, Tue 10 Mar 2026" },
              { client: "Lisa Martinez", form: "NDIS Consent", time: "12:45 pm, Mon 9 Mar 2026" },
              { client: "Tom Nguyen", form: "Health History", time: "10:21 am, Fri 6 Mar 2026" },
              { client: "Sophie Anderson", form: "Paediatric", time: "4:55 pm, Thu 5 Mar 2026" },
              { client: "David Park", form: "Assessment", time: "4:02 pm, Thu 5 Mar 2026" },
            ].map((form) => (
              <div key={form.client + form.form} className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="cursor-pointer text-sm font-medium text-primary hover:underline">
                    {form.client}
                  </span>
                  <span className="text-sm text-text-secondary"> ({form.form})</span>
                </div>
                <span className="shrink-0 text-xs text-text-secondary whitespace-nowrap">
                  {form.time}
                </span>
              </div>
            ))}
            <button className="mt-1 text-sm font-medium text-primary hover:underline">
              Load more
            </button>
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-text">Tasks</h3>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.label} className="flex items-start gap-2.5">
                {task.done ? (
                  <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <Square className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary" />
                )}
                <span
                  className={`text-sm leading-snug ${
                    task.done
                      ? "text-text-secondary line-through"
                      : "text-text"
                  }`}
                >
                  {task.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

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
