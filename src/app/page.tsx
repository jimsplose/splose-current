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
    <div className="flex min-h-[calc(100vh-3rem)]">
      {/* Left column — Messages */}
      <div className="flex flex-1 flex-col border-r border-border">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-text">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            <div className="text-center text-xs text-text-secondary">
              {new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
            </div>
            {data.todayAppointments.slice(0, 5).map((appt) => (
              <div key={appt.id} className="flex items-start gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: appt.practitioner.color }}
                >
                  {appt.practitioner.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-text">
                      {appt.practitioner.name}
                    </span>
                    <span className="text-xs text-text-secondary">{appt.startTime}</span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">
                    Appointment with {appt.client.firstName} {appt.client.lastName} — {appt.type}
                  </p>
                </div>
              </div>
            ))}
            {data.todayAppointments.length === 0 && (
              <p className="text-center text-sm text-text-secondary">No appointments today</p>
            )}
          </div>
        </div>
        {/* Compose area */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2 text-text-secondary">
            <button className="p-1 hover:text-text"><span className="text-sm font-bold">B</span></button>
            <button className="p-1 hover:text-text"><span className="text-sm italic">I</span></button>
            <button className="p-1 hover:text-text"><span className="text-sm underline">U</span></button>
            <span className="mx-1 text-border">|</span>
            <button className="p-1 hover:text-text"><span className="text-sm">Aa</span></button>
            <button className="p-1 hover:text-text"><span className="text-sm">&#128206;</span></button>
            <button className="p-1 hover:text-text"><span className="text-sm">&#128247;</span></button>
            <div className="flex-1" />
            <button className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-dark">
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Right column — Analytics */}
      <div className="w-[420px] shrink-0 overflow-y-auto">
        {/* Income chart area */}
        <div className="border-b border-border p-4">
          <h3 className="mb-4 text-sm font-semibold text-text">Income</h3>
          <div className="relative h-48 rounded-lg bg-white p-2">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-2 bottom-6 flex flex-col justify-between text-[10px] text-text-secondary">
              <span>500K</span>
              <span>400K</span>
              <span>300K</span>
              <span>200K</span>
              <span>100K</span>
              <span>0</span>
            </div>
            {/* Chart bars */}
            <div className="ml-8 flex h-full items-end gap-2 pb-6">
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
                      className="w-3 rounded-t bg-lime-400"
                      style={{ height: `${item.invoices}%` }}
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
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-lime-400" /> Invoices
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-purple-400" /> Payments
            </span>
          </div>
        </div>

        {/* Incomplete progress notes */}
        <div className="border-b border-border p-4">
          <h3 className="mb-3 text-sm font-semibold text-text">Incomplete progress notes</h3>
          <div className="space-y-2">
            {data.unsignedNotes.length === 0 ? (
              <p className="text-sm text-text-secondary">No incomplete notes</p>
            ) : (
              data.unsignedNotes.map((note) => (
                <div key={note.id} className="flex items-center justify-between">
                  <span className="text-sm text-primary hover:underline cursor-pointer">
                    {note.client.firstName} {note.client.lastName} ({note.practitioner.name})
                  </span>
                  <span className="text-xs text-text-secondary">
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
          <h3 className="mb-3 text-sm font-semibold text-text">Recently submitted forms</h3>
          <div className="space-y-2">
            {[
              { name: "Michael Brooks (Intake Form)", time: "8:15 pm, Tue 10 Mar 2026" },
              { name: "Lisa Martinez (NDIS Consent)", time: "12:45 pm, Mon 9 Mar 2026" },
              { name: "Tom Nguyen (Health History)", time: "10:21 am, Fri 6 Mar 2026" },
              { name: "Sophie Anderson (Paediatric)", time: "4:55 pm, Thu 5 Mar 2026" },
              { name: "David Park (Assessment)", time: "4:02 pm, Thu 5 Mar 2026" },
            ].map((form) => (
              <div key={form.name} className="flex items-center justify-between">
                <span className="text-sm text-primary hover:underline cursor-pointer">
                  {form.name}
                </span>
                <span className="text-xs text-text-secondary whitespace-nowrap ml-2">
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
