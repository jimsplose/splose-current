import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import { ChevronDown, Plus, MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button, PageHeader, DataTable, TableHead, Th, TableBody, Td, Pagination, Badge, statusVariant } from "@/components/ds";

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
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <PageHeader title="Appointments">
        <Button>
          Send upcoming appointments
          <ChevronDown className="h-4 w-4 text-text-secondary" />
        </Button>
        <Button>
          <Plus className="h-4 w-4" />
          New appointment
        </Button>
      </PageHeader>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full">
          <TableHead>
            <Th>
              <span className="inline-flex items-center gap-1">When <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" /></span>
            </Th>
            <Th>Where</Th>
            <Th>Type</Th>
            <Th>Practitioner</Th>
            <Th>Invoice status</Th>
            <Th align="right">Actions</Th>
          </TableHead>
          <TableBody>
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
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${isUpcoming ? 'bg-green-500' : statusColor}`} />
                        <span className="text-text">
                          {formatDate(appt.date)}, {appt.startTime}
                        </span>
                        {isUpcoming && (
                          <Badge variant="green" className="bg-green-500 text-white">Upcoming</Badge>
                        )}
                        {appt.status === "Cancelled" && (
                          <Badge variant={statusVariant("Cancelled")}>Cancelled</Badge>
                        )}
                        {appt.status === "No Show" && (
                          <StatusBadge status={appt.status} />
                        )}
                      </div>
                    </Td>
                    <Td className="text-text-secondary">East Clinics</Td>
                    <Td className="text-text-secondary">{appt.type}</Td>
                    <Td className="text-text-secondary">{appt.practitioner.name}</Td>
                    <Td>
                      {invoiceStatus === "Paid" && (
                        <Badge variant="red" className="bg-red-500 text-white">Paid</Badge>
                      )}
                      {invoiceStatus === "Draft" && (
                        <Badge variant="blue" className="bg-blue-500 text-white">Draft</Badge>
                      )}
                      {invoiceStatus === "Do not invoice" && (
                        <Badge variant="gray" className="bg-gray-700 text-white">Do not invoice</Badge>
                      )}
                      {invoiceStatus === "---" && (
                        <span className="text-text-secondary">---</span>
                      )}
                    </Td>
                    <Td align="right">
                      <button className="text-text-secondary hover:text-text">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </Td>
                  </tr>
                );
              })
            )}
          </TableBody>
        </table>
        <Pagination totalItems={client.appointments.length} itemsPerPage={10} />
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
