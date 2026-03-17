import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function ClientAppointmentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      appointments: {
        include: { practitioner: true },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!client) notFound();

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-text">Appointments</h1>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
            Send upcoming appointments
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-dark">
            + New appointment
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <span className="flex items-center gap-1">
                  When
                  <svg className="h-3 w-3 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Where</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Practitioner</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Invoice status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {client.appointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-text-secondary">
                  No appointments
                </td>
              </tr>
            ) : (
              client.appointments.map((appt) => {
                const isUpcoming = new Date(appt.date + "T" + appt.startTime) > new Date();
                const statusColor = appt.status === "Completed" ? "bg-green-500"
                  : appt.status === "Cancelled" ? "bg-red-400"
                  : appt.status === "No Show" ? "bg-yellow-500"
                  : isUpcoming ? "bg-green-400"
                  : "bg-amber-400";
                return (
                  <tr key={appt.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusColor}`} />
                        <span className="text-text whitespace-nowrap">
                          {formatDate(appt.date)}, {appt.startTime}
                        </span>
                        {isUpcoming && appt.status !== "Cancelled" && (
                          <span className="rounded bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                            Upcoming
                          </span>
                        )}
                        {appt.status === "Cancelled" && (
                          <StatusBadge status="Cancelled" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">East Clinics</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{appt.type}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{appt.practitioner.name}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="text-text-secondary">---</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="rounded p-1 text-text-secondary hover:bg-gray-100 hover:text-text">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h.01M12 12h.01M18 12h.01" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-center border-t border-border px-4 py-3 text-sm text-text-secondary">
          <span>1-{Math.min(10, client.appointments.length)} of {client.appointments.length} items</span>
          <div className="ml-4 flex items-center gap-1">
            <span className="cursor-pointer px-1">&lt;</span>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-primary bg-primary/5 text-xs font-medium text-primary">
              1
            </button>
            {client.appointments.length > 10 && (
              <>
                <button className="flex h-7 w-7 items-center justify-center rounded text-xs hover:bg-gray-100">2</button>
                <button className="flex h-7 w-7 items-center justify-center rounded text-xs hover:bg-gray-100">3</button>
              </>
            )}
            <span className="cursor-pointer px-1">&gt;</span>
          </div>
          <span className="ml-4">10 / page</span>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}
