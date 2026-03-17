import { prisma } from "@/lib/prisma";
import Link from "next/link";

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
          {/* Mock messages */}
          <div className="space-y-6">
            <div className="text-center text-xs text-text-secondary">
              {new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
            </div>
            {data.todayAppointments.slice(0, 3).map((appt) => (
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
          <div className="flex h-48 items-end gap-2 rounded-lg bg-gray-50 p-4">
            {["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].map((month, i) => {
              const heights = [8, 12, 20, 80, 6, 10, 15];
              return (
                <div key={month} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-lime-400"
                    style={{ height: `${heights[i]}%` }}
                  />
                  <span className="text-[10px] text-text-secondary">{month}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex items-center justify-center gap-4 text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-lime-400" /> Invoices
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary" /> Payments
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
                  <span className="text-sm text-primary">
                    {note.client.firstName} {note.client.lastName} ({note.template})
                  </span>
                  <span className="text-xs text-text-secondary">{note.date}</span>
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
            {data.recentInvoices.slice(0, 3).map((inv) => (
              <div key={inv.id} className="flex items-center justify-between">
                <span className="text-sm text-primary">
                  {inv.client.firstName} {inv.client.lastName}
                </span>
                <span className="text-xs text-text-secondary">{inv.date}</span>
              </div>
            ))}
            <button className="text-sm text-primary hover:underline">Load more</button>
          </div>
        </div>
      </div>
    </div>
  );
}
