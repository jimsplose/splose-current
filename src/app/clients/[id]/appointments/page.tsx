import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import { ChevronDown, Plus, MoreHorizontal, ArrowUpDown } from "lucide-react";

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
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Send upcoming appointments
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            New appointment
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-purple-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <span className="inline-flex items-center gap-1">When <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" /></span>
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
                const statusColor = appt.status === "Completed" ? "bg-gray-400"
                  : appt.status === "Cancelled" ? "bg-red-400"
                  : appt.status === "No Show" ? "bg-yellow-400"
                  : "bg-amber-400";
                const isUpcoming = appt.status === "Scheduled" && new Date(appt.date + "T00:00:00") >= new Date(new Date().toDateString());

                // Derive invoice status from appointment status
                let invoiceStatus: "Paid" | "Draft" | "Do not invoice" | "---";
                if (appt.status === "Cancelled") {
                  invoiceStatus = "Do not invoice";
                } else if (appt.status === "Completed") {
                  // Deterministic assignment based on id hash
                  const hash = appt.id.split("").reduce((acc: number, ch: string) => acc + ch.charCodeAt(0), 0);
                  invoiceStatus = hash % 3 === 0 ? "Draft" : "Paid";
                } else {
                  invoiceStatus = "---";
                }

                return (
                  <tr key={appt.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${isUpcoming ? 'bg-green-500' : statusColor}`} />
                        <span className="text-text">
                          {formatDate(appt.date)}, {appt.startTime}
                        </span>
                        {isUpcoming && (
                          <span className="inline-flex items-center rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">Upcoming</span>
                        )}
                        {appt.status === "Cancelled" && (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Cancelled</span>
                        )}
                        {appt.status === "No Show" && (
                          <StatusBadge status={appt.status} />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">East Clinics</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{appt.type}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{appt.practitioner.name}</td>
                    <td className="px-4 py-3 text-sm">
                      {invoiceStatus === "Paid" && (
                        <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white">Paid</span>
                      )}
                      {invoiceStatus === "Draft" && (
                        <span className="inline-flex items-center rounded-full bg-blue-500 px-2.5 py-0.5 text-xs font-medium text-white">Draft</span>
                      )}
                      {invoiceStatus === "Do not invoice" && (
                        <span className="inline-flex items-center rounded-full bg-yellow-500 px-2.5 py-0.5 text-xs font-medium text-white">Do not invoice</span>
                      )}
                      {invoiceStatus === "---" && (
                        <span className="text-text-secondary">---</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-text-secondary hover:text-text">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
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
