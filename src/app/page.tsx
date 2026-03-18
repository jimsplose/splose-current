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

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-3rem)]">
      {/* Left column — Messages */}
      <div className="flex flex-1 flex-col lg:border-r border-border">
        {/* Messages header */}
        <div className="px-4 py-2.5">
          <h2 className="text-sm font-medium text-text">Messages</h2>
        </div>

        {/* Messages content */}
        <div className="flex-1 overflow-y-auto px-4 pb-2">
          <div className="space-y-4">
            {/* Date separator */}
            <div className="flex items-center justify-center py-2">
              <span className="text-xs text-text-secondary">
                {new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>

            {/* Messages from today's appointments */}
            {data.todayAppointments.slice(0, 5).map((appt) => (
              <div key={appt.id} className="flex items-start gap-2.5">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-medium text-white"
                  style={{ backgroundColor: appt.practitioner.color }}
                >
                  {appt.practitioner.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[13px] font-semibold text-text">
                      {appt.practitioner.name}
                    </span>
                    <span className="text-[11px] text-text-secondary">{appt.startTime}</span>
                  </div>
                  <p className="mt-0.5 text-[13px] text-text-secondary leading-snug">
                    Appointment with {appt.client.firstName} {appt.client.lastName} — {appt.type}
                  </p>
                </div>
              </div>
            ))}

            {data.todayAppointments.length === 0 && (
              <>
                {/* Show some sample messages when no appointments */}
                {/* Joseph Go — message with blurred/censored image */}
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[10px] font-medium text-white">
                    JG
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[13px] font-semibold text-text">Joseph Go</span>
                      <span className="text-[11px] text-text-secondary">9:48 pm</span>
                    </div>
                    <div className="mt-1.5 h-36 w-48 max-w-full rounded-lg bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-br from-pink-200 via-gray-300 to-blue-200 blur-[12px] scale-110" />
                    </div>
                  </div>
                </div>

                {/* Date separator — 9 Feb 2026 */}
                <div className="flex items-center justify-center py-1">
                  <span className="text-xs text-text-secondary">9 Feb 2026</span>
                </div>

                {/* Joseph Go — blue cat sticker */}
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[10px] font-medium text-white">
                    JG
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[13px] font-semibold text-text">Joseph Go</span>
                      <span className="text-[11px] text-text-secondary">9:50 pm</span>
                    </div>
                    <div className="mt-1.5 h-40 w-40 max-w-full rounded-lg bg-gradient-to-br from-sky-200 to-sky-400 flex flex-col items-center justify-center gap-1">
                      <div className="h-16 w-14 rounded-t-full bg-sky-500 relative">
                        <div className="absolute -top-2 -left-1 h-4 w-3 bg-sky-500 rounded-tl-full rotate-[-15deg]" />
                        <div className="absolute -top-2 -right-1 h-4 w-3 bg-sky-500 rounded-tr-full rotate-[15deg]" />
                        <div className="absolute top-4 left-2 h-2 w-2 rounded-full bg-white" />
                        <div className="absolute top-4 right-2 h-2 w-2 rounded-full bg-white" />
                      </div>
                      <span className="text-[10px] text-sky-800 font-bold tracking-wider">STFCRS5</span>
                    </div>
                  </div>
                </div>

                {/* Date separator — 16 Feb 2026 */}
                <div className="flex items-center justify-center py-1">
                  <span className="text-xs text-text-secondary cursor-pointer" title="Click to go forward, hold to see history">16 Feb 2026</span>
                </div>

                {/* Hao Wang — green S logo image */}
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-600 text-[10px] font-medium text-white">
                    HW
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[13px] font-semibold text-text">Hao Wang</span>
                      <span className="text-[11px] text-text-secondary">3:56 pm</span>
                    </div>
                    <div className="mt-1.5 h-40 w-48 max-w-full rounded-lg bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center">
                      <span className="text-5xl font-bold text-green-600">S</span>
                    </div>
                  </div>
                </div>

                {/* Joseph Go — MADE IT HOME meme */}
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[10px] font-medium text-white">
                    JG
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[13px] font-semibold text-text">Joseph Go</span>
                      <span className="text-[11px] text-text-secondary">10:18 pm</span>
                    </div>
                    <div className="mt-1.5 h-36 w-48 max-w-full rounded-lg bg-gradient-to-br from-amber-100 to-amber-300 flex flex-col items-center justify-center gap-1">
                      <span className="text-sm font-bold text-amber-800 tracking-wide">MADE IT HOME</span>
                      <div className="h-14 w-16 rounded-t-full bg-amber-400/60 relative">
                        <div className="absolute -top-1.5 -left-0.5 h-3 w-2.5 bg-amber-400/60 rounded-tl-full rotate-[-15deg]" />
                        <div className="absolute -top-1.5 -right-0.5 h-3 w-2.5 bg-amber-400/60 rounded-tr-full rotate-[15deg]" />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Compose area */}
        <div className="border-t border-border p-3">
          <div className="mb-2 min-h-[80px] rounded-lg border border-border bg-white px-3 py-2 text-[13px] text-text-secondary leading-relaxed">
            Type a message...
          </div>
          <div className="flex items-center gap-0.5 text-text-secondary">
            <button className="rounded p-1 hover:bg-gray-100 text-[13px] font-bold" title="Bold">B</button>
            <button className="rounded p-1 hover:bg-gray-100 text-[13px] italic" title="Italic">I</button>
            <button className="rounded p-1 hover:bg-gray-100 text-[13px] underline" title="Underline">U</button>
            <button className="rounded p-1 hover:bg-gray-100 text-[13px]" title="Text size">A<sub className="text-[9px]">1</sub></button>
            <span className="mx-0.5 h-4 w-px bg-border" />
            <button className="rounded p-1 hover:bg-gray-100 text-[13px]" title="Table">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="12" height="12" rx="1"/><line x1="2" y1="6" x2="14" y2="6"/><line x1="2" y1="10" x2="14" y2="10"/><line x1="6" y1="2" x2="6" y2="14"/><line x1="10" y1="2" x2="10" y2="14"/></svg>
            </button>
            <button className="rounded p-1 hover:bg-gray-100 text-[13px]" title="Link">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6.5 9.5a3 3 0 004.2.1l2-2a3 3 0 00-4.2-4.3l-1.1 1.1"/><path d="M9.5 6.5a3 3 0 00-4.2-.1l-2 2a3 3 0 004.2 4.3l1.1-1.1"/></svg>
            </button>
            <button className="rounded p-1 hover:bg-gray-100 text-[13px]" title="Image">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="12" height="12" rx="1"/><circle cx="5.5" cy="5.5" r="1"/><path d="M14 10l-3-3-7 7"/></svg>
            </button>
            <button className="rounded p-1 hover:bg-gray-100 text-[13px]" title="Emoji">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M5.5 6.5h.01M10.5 6.5h.01"/><path d="M5.5 9.5a3.5 3.5 0 005 0"/></svg>
            </button>
            <button className="rounded p-1 hover:bg-gray-100 text-[13px]" title="Align">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="2" y1="3" x2="14" y2="3"/><line x1="2" y1="6" x2="10" y2="6"/><line x1="2" y1="9" x2="14" y2="9"/><line x1="2" y1="12" x2="10" y2="12"/></svg>
            </button>
            <button className="rounded p-1 hover:bg-gray-100 text-[13px]" title="List">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="5" y1="3" x2="14" y2="3"/><line x1="5" y1="8" x2="14" y2="8"/><line x1="5" y1="13" x2="14" y2="13"/><circle cx="2.5" cy="3" r="0.75" fill="currentColor"/><circle cx="2.5" cy="8" r="0.75" fill="currentColor"/><circle cx="2.5" cy="13" r="0.75" fill="currentColor"/></svg>
            </button>
            <span className="mx-0.5 h-4 w-px bg-border" />
            <button className="rounded p-1 hover:bg-gray-100 text-[13px]" title="More">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>
            </button>
            <div className="flex-1" />
            <span className="mr-1 cursor-pointer rounded px-1.5 py-0.5 text-xs font-medium text-text-secondary hover:bg-gray-100">GIF</span>
            <button className="rounded-lg bg-primary px-4 py-1.5 text-[13px] font-medium text-white hover:bg-primary-dark">
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Right column — Analytics */}
      <div className="w-full lg:w-[380px] shrink-0 overflow-y-auto bg-white">
        {/* Income chart area */}
        <div className="border-b border-border px-4 pt-3 pb-4">
          <h3 className="mb-3 text-sm font-medium text-text">Income</h3>
          <div className="relative h-52">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-text-secondary pr-1">
              <span>500K</span>
              <span>400K</span>
              <span>300K</span>
              <span>200K</span>
              <span>100K</span>
              <span>0</span>
            </div>
            {/* Y-axis label "Values" rotated */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] text-text-secondary whitespace-nowrap">
              Values
            </div>
            {/* Grid lines */}
            <div className="absolute left-7 right-0 top-0 bottom-6 flex flex-col justify-between">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border-b border-gray-100 h-0" />
              ))}
            </div>
            {/* Chart bars */}
            <div className="ml-8 flex h-[calc(100%-24px)] items-end gap-1">
              {incomeData.map((item) => (
                <div key={item.month} className="flex flex-1 flex-col items-center">
                  <div className="flex w-full items-end justify-center gap-px" style={{ height: "100%" }}>
                    <div
                      className="w-3 rounded-t-sm"
                      style={{
                        height: `${(item.invoices / maxVal) * 100}%`,
                        backgroundColor: "#bef264",
                        minHeight: item.invoices > 0 ? "2px" : "0",
                      }}
                    />
                    <div
                      className="w-3 rounded-t-sm"
                      style={{
                        height: `${(item.payments / maxVal) * 100}%`,
                        backgroundColor: "#c084fc",
                        minHeight: item.payments > 0 ? "2px" : "0",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* X-axis labels */}
            <div className="ml-8 flex">
              {incomeData.map((item) => (
                <div key={item.month} className="flex-1 text-center">
                  <span className="text-[9px] text-text-secondary whitespace-nowrap">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-center gap-4 text-xs text-text-secondary">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#bef264" }} /> Invoices
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#c084fc" }} /> Payments
            </span>
          </div>
        </div>

        {/* Incomplete progress notes */}
        <div className="border-b border-border px-4 pt-3 pb-3">
          <h3 className="mb-2.5 text-sm font-medium text-text">Incomplete progress notes</h3>
          <div className="space-y-1.5">
            {data.unsignedNotes.length === 0 ? (
              <>
                {[
                  { name: "Skyler Peterson (Bill Gates Demo)", time: "10:04 am, Wed 11 Mar 2026" },
                  { name: "A Del (AAA TEST)", time: "3:43 am, Wed 11 Mar 2026" },
                  { name: "Ethan McKenzie (BIRP Treatment Note - AI Blocks Demo)", time: "1:34 pm, Tue 10 Mar 2026" },
                  { name: "Shaz Test (AAA TEST)", time: "1:22 pm, Tue 10 Mar 2026" },
                  { name: "A Jr (Temp progress note test 6March26)", time: "10:16 am, Fri 6 Mar 2026" },
                ].map((note) => (
                  <div key={note.name} className="flex items-start justify-between gap-2 py-0.5">
                    <span className="text-[13px] text-primary hover:underline cursor-pointer leading-snug">
                      {note.name}
                    </span>
                    <span className="text-[11px] text-text-secondary whitespace-nowrap shrink-0 pt-0.5">
                      {note.time}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              data.unsignedNotes.map((note) => (
                <div key={note.id} className="flex items-start justify-between gap-2 py-0.5">
                  <span className="text-[13px] text-primary hover:underline cursor-pointer leading-snug">
                    {note.client.firstName} {note.client.lastName} ({note.practitioner.name})
                  </span>
                  <span className="text-[11px] text-text-secondary whitespace-nowrap shrink-0 pt-0.5">
                    {formatDateTime(note.date)}
                  </span>
                </div>
              ))
            )}
            <button className="mt-1 text-[13px] text-primary hover:underline">Load more</button>
          </div>
        </div>

        {/* Recently submitted forms */}
        <div className="px-4 pt-3 pb-3">
          <h3 className="mb-2.5 text-sm font-medium text-text">Recently submitted forms</h3>
          <div className="space-y-1.5">
            {[
              { name: "Hao Wang (TEST IMAGE FORM)", time: "8:15 pm, Tue 10 Mar 2026" },
              { name: "Skyler Peterson (TEST IMAGE FORM)", time: "12:45 pm, Mon 9 Mar 2026" },
              { name: "DDDDDDD Hun (Test form saved in A Jr)", time: "10:21 am, Fri 6 Mar 2026" },
              { name: "a a (A)", time: "4:55 pm, Thu 5 Mar 2026" },
              { name: "A Jr (Test form File upload pdf)", time: "4:02 pm, Thu 5 Mar 2026" },
            ].map((form) => (
              <div key={form.name} className="flex items-start justify-between gap-2 py-0.5">
                <span className="text-[13px] text-primary hover:underline cursor-pointer leading-snug">
                  {form.name}
                </span>
                <span className="text-[11px] text-text-secondary whitespace-nowrap shrink-0 pt-0.5">
                  {form.time}
                </span>
              </div>
            ))}
            <button className="mt-1 text-[13px] text-primary hover:underline">Load more</button>
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
