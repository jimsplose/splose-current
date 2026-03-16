import Header from "@/components/Header";
import StatusBadge from "@/components/StatusBadge";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Mail, Phone, MapPin, CreditCard, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({
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
        take: 10,
      },
      clinicalNotes: {
        include: { practitioner: true },
        orderBy: { date: "desc" },
        take: 5,
      },
      invoices: {
        orderBy: { date: "desc" },
        take: 5,
      },
    },
  });

  if (!client) notFound();

  return (
    <>
      <Header title={`${client.firstName} ${client.lastName}`} />
      <div className="p-6">
        {/* Client info card */}
        <div className="mb-6 rounded-xl border border-border bg-surface p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                {client.firstName[0]}
                {client.lastName[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {client.firstName} {client.lastName}
                </h2>
                <p className="text-sm text-text-secondary">
                  DOB: {client.dateOfBirth}
                </p>
              </div>
            </div>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
              Edit Client
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {client.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-text-secondary" />
                {client.email}
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-text-secondary" />
                {client.phone}
              </div>
            )}
            {client.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-text-secondary" />
                {client.address}
              </div>
            )}
            {(client.medicare || client.ndisNumber) && (
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-text-secondary" />
                {client.medicare
                  ? `Medicare: ${client.medicare}`
                  : `NDIS: ${client.ndisNumber}`}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Appointments */}
          <div className="rounded-xl border border-border bg-surface">
            <h3 className="border-b border-border px-6 py-4 text-lg font-semibold">
              Recent Appointments
            </h3>
            <div className="divide-y divide-border">
              {client.appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-center justify-between px-6 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {appt.date} &middot; {appt.startTime} - {appt.endTime}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {appt.practitioner.name} &middot; {appt.type}
                    </p>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Notes */}
          <div className="rounded-xl border border-border bg-surface">
            <h3 className="border-b border-border px-6 py-4 text-lg font-semibold">
              Clinical Notes
            </h3>
            <div className="divide-y divide-border">
              {client.clinicalNotes.length === 0 ? (
                <p className="p-6 text-center text-sm text-text-secondary">
                  No clinical notes yet
                </p>
              ) : (
                client.clinicalNotes.map((note) => (
                  <div key={note.id} className="px-6 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-text-secondary" />
                        <span className="text-sm font-medium">
                          {note.template}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-secondary">
                          {note.date}
                        </span>
                        {note.signed ? (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Signed
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            Unsigned
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-text-secondary line-clamp-2">
                      {note.content}
                    </p>
                    <p className="mt-1 text-xs text-text-secondary">
                      {note.practitioner.name}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
