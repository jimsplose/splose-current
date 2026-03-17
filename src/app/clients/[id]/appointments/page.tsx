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
        <h1 className="text-2xl font-bold text-text">Appointments</h1>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Send upcoming appointments &#9660;
          </button>
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            + New appointment
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-purple-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">When</th>
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
                const statusColor = appt.status === "Completed" ? "bg-green-500"
                  : appt.status === "Cancelled" ? "bg-red-500"
                  : appt.status === "No Show" ? "bg-yellow-500"
                  : "bg-amber-400";
                return (
                  <tr key={appt.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />
                        <span className="text-text">
                          {formatDate(appt.date)}, {appt.startTime}
                        </span>
                        {appt.status !== "Scheduled" && (
                          <StatusBadge status={appt.status} />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">East Clinics</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{appt.type}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{appt.practitioner.name}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="text-text-secondary">----</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-text-secondary hover:text-text">...</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
          <span>1-{client.appointments.length} of {client.appointments.length} items</span>
          <div className="ml-4 flex items-center gap-1">
            <span>&lt;</span>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">1</button>
            <span>&gt;</span>
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
