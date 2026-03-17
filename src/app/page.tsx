import { prisma } from "@/lib/prisma";

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

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-3rem)]">
      {/* Left column — Messages */}
      <div className="flex flex-1 flex-col border-r border-border min-w-0">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-text">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            <div className="text-center text-xs text-text-secondary py-2">
              {new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
            </div>
            {data.todayAppointments.slice(0, 5).map((appt) => (
              <div key={appt.id} className="flex items-start gap-3 cursor-pointer rounded-lg px-3 py-3 hover:bg-gray-50 transition-colors">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: appt.practitioner.color }}
                >
                  {appt.practitioner.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-text">
                      {appt.practitioner.name}
                    </span>
                    <span className="text-xs text-text-secondary">{appt.startTime}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-text-secondary leading-relaxed">
                    Appointment with {appt.client.firstName} {appt.client.lastName} — {appt.type}
                  </p>
                </div>
              </div>
            ))}
            {data.todayAppointments.length === 0 && (
              <p className="text-center text-sm text-text-secondary py-4">No appointments today</p>
            )}
          </div>
        </div>
        {/* Compose area */}
        <div className="border-t border-border p-3">
          <div className="mb-2 min-h-[60px] rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-secondary">
            Type a message...
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5 text-text-secondary">
              <button className="rounded p-1.5 hover:bg-gray-100 text-sm font-bold">B</button>
              <button className="rounded p-1.5 hover:bg-gray-100 text-sm italic">I</button>
              <button className="rounded p-1.5 hover:bg-gray-100 text-sm underline">U</button>
              <button className="rounded p-1.5 hover:bg-gray-100 text-sm">A<sub className="text-[8px]">1</sub></button>
              <span className="mx-0.5 text-border">|</span>
              <button className="rounded p-1.5 hover:bg-gray-100 text-sm">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
              </button>
              <button className="rounded p-1.5 hover:bg-gray-100 text-sm">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </button>
              <span className="mx-0.5 text-border">|</span>
              <button className="rounded p-1.5 hover:bg-gray-100 text-sm">&#8212;</button>
              <button className="rounded p-1.5 hover:bg-gray-100 text-sm">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </button>
              <button className="rounded p-1.5 hover:bg-gray-100 text-sm">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
              </button>
              <span className="mx-0.5 text-border">|</span>
              <button className="rounded p-1.5 hover:bg-gray-100 text-sm">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="6" x2="3" y2="6"/><line x1="17" y1="12" x2="3" y2="12"/><line x1="21" y1="18" x2="3" y2="18"/></svg>
              </button>
              <button className="rounded p-1.5 hover:bg-gray-100 text-sm">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="6" x2="11" y2="6"/><line x1="21" y1="12" x2="11" y2="12"/><line x1="21" y1="18" x2="11" y2="18"/><polyline points="7 8 3 12 7 16"/></svg>
              </button>
              <span className="mx-0.5 text-border">|</span>
              <button className="rounded p-1.5 hover:bg-gray-100 text-sm">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded p-1.5 hover:bg-gray-100 text-text-secondary text-sm">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
              </button>
              <button className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-dark">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right column — Analytics */}
      <div className="w-full lg:w-[420px] shrink-0 overflow-y-auto">
        {/* Income chart area */}
        <div className="border-b border-border p-4">
          <h3 className="mb-4 text-sm font-medium text-text">Income</h3>
          <div className="relative h-48 rounded-lg bg-white p-2">
            {/* Y-axis label */}
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-text-secondary">
              Values
            </div>
            {/* Y-axis labels */}
            <div className="absolute left-3 top-2 bottom-6 flex flex-col justify-between text-[10px] text-text-secondary">
              <span>500K</span>
              <span>400K</span>
              <span>300K</span>
              <span>200K</span>
              <span>100K</span>
              <span>0</span>
            </div>
            {/* Horizontal grid lines */}
            <div className="absolute left-10 right-2 top-2 bottom-6 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border-b border-gray-100 w-full" />
              ))}
            </div>
            {/* Chart bars */}
            <div className="ml-10 flex h-full items-end gap-2 pb-6">
              {[
                { month: "Sep-2025", invoices: 3, payments: 1 },
                { month: "Oct-2025", invoices: 8, payments: 2 },
                { month: "Nov-2025", invoices: 15, payments: 5 },
                { month: "Dec-2025", invoices: 80, payments: 10 },
                { month: "Jan-2026", invoices: 5, payments: 3 },
                { month: "Feb-2026", invoices: 8, payments: 2 },
                { month: "Mar-2026", invoices: 12, payments: 4 },
              ].map((item) => (
                <div key={item.month} className="flex flex-1 flex-col items-center gap-0.5">
                  <div className="flex w-full items-end justify-center gap-0.5" style={{ height: "130px" }}>
                    <div
                      className="w-3 rounded-t"
                      style={{ height: `${item.invoices}%`, backgroundColor: "#c4d94e" }}
                    />
                    <div
                      className="w-3 rounded-t bg-purple-400"
                      style={{ height: `${item.payments}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-text-secondary whitespace-nowrap">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-center gap-4 text-xs text-text-secondary">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#c4d94e" }} /> Invoices
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-400" /> Payments
            </span>
          </div>
        </div>

        {/* Incomplete progress notes */}
        <div className="border-b border-border p-4">
          <h3 className="mb-3 text-sm font-medium text-text">Incomplete progress notes</h3>
          <div className="space-y-2.5">
            {data.unsignedNotes.length === 0 ? (
              <p className="text-sm text-text-secondary">No incomplete notes</p>
            ) : (
              data.unsignedNotes.map((note) => (
                <div key={note.id} className="flex items-start justify-between gap-2">
                  <span className="text-sm text-primary hover:underline cursor-pointer leading-snug">
                    {note.client.firstName} {note.client.lastName} ({note.practitioner.name})
                  </span>
                  <span className="text-xs text-text-secondary whitespace-nowrap pt-0.5">
                    {formatDateTime(note.date)}
                  </span>
                </div>
              ))
            )}
            <button className="text-sm text-primary hover:underline">Load more</button>
          </div>
        </div>

        {/* Recently submitted forms */}
        <div className="p-4">
          <h3 className="mb-3 text-sm font-medium text-text">Recently submitted forms</h3>
          <div className="space-y-2.5">
            {[
              { name: "Michael Brooks (Intake Form)", time: "8:15 pm, Tue 10 Mar 2026" },
              { name: "Lisa Martinez (NDIS Consent)", time: "12:45 pm, Mon 9 Mar 2026" },
              { name: "Tom Nguyen (Health History)", time: "10:21 am, Fri 6 Mar 2026" },
              { name: "Sophie Anderson (Paediatric)", time: "4:55 pm, Thu 5 Mar 2026" },
              { name: "David Park (Assessment)", time: "4:02 pm, Thu 5 Mar 2026" },
            ].map((form) => (
              <div key={form.name} className="flex items-start justify-between gap-2">
                <span className="text-sm text-primary hover:underline cursor-pointer leading-snug">
                  {form.name}
                </span>
                <span className="text-xs text-text-secondary whitespace-nowrap pt-0.5">
                  {form.time}
                </span>
              </div>
            ))}
            <button className="text-sm text-primary hover:underline">Load more</button>
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
