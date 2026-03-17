import StatusBadge from "@/components/StatusBadge";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Mail, Phone, MapPin, CreditCard, FileText, Pencil } from "lucide-react";

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

  const sidebarSections = [
    { label: "Details", count: null, active: true },
    { label: "Appointments", count: client.appointments.length },
    { label: "Files", count: 0 },
    { label: "Progress notes", count: client.clinicalNotes.length },
    { label: "Forms", count: 0 },
    { label: "Invoices", count: client.invoices.length },
    { label: "Payments", count: 0 },
    { label: "Statements", count: null },
    { label: "Letters", count: 0 },
    { label: "Practitioner access", count: null },
  ];

  return (
    <div className="flex min-h-[calc(100vh-3rem)]">
      {/* Left sidebar */}
      <aside className="w-56 shrink-0 border-r border-border bg-white overflow-y-auto">
        <div className="p-4">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-sm font-medium text-text-secondary">Client</span>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-text">
              {client.firstName[0]}{client.lastName[0]}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text hover:bg-gray-50">
              New SMS
            </button>
            <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text hover:bg-gray-50">
              New email
            </button>
            <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text hover:bg-gray-50">
              Actions ▾
            </button>
          </div>
        </div>
        <nav className="border-t border-border">
          {sidebarSections.map((section) => (
            <button
              key={section.label}
              className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                section.active
                  ? "border-l-2 border-primary bg-purple-50 text-primary font-medium"
                  : "text-text-secondary hover:bg-gray-50"
              }`}
            >
              <span>{section.label}</span>
              {section.count !== null && (
                <span className="text-xs text-text-secondary">{section.count}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold text-text">Details</h1>
          <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
        </div>

        {/* General details */}
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-text">General details</h2>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
              {client.firstName[0]}{client.lastName[0]}
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="text-text-secondary">Date of birth:</span> {client.dateOfBirth}</p>
            </div>
          </div>
        </section>

        {/* Contact details */}
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-text">Client contact details</h2>
          <div className="space-y-2 text-sm">
            {client.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-text-secondary" />
                <span>{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-text-secondary" />
                <span className="text-primary">{client.phone}</span>
                <span className="text-xs text-text-secondary">(Mobile)</span>
              </div>
            )}
            {client.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-text-secondary" />
                <span>{client.address}</span>
              </div>
            )}
          </div>
        </section>

        {/* Medicare/NDIS details */}
        {(client.medicare || client.ndisNumber) && (
          <section className="mb-6">
            <h2 className="mb-3 text-sm font-semibold text-text">
              {client.medicare ? "Medicare details" : "NDIS details"}
            </h2>
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-text-secondary" />
              <span>
                {client.medicare
                  ? `Card number: ${client.medicare}`
                  : `NDIS number: ${client.ndisNumber}`}
              </span>
            </div>
          </section>
        )}
      </div>

      {/* Right panel */}
      <aside className="w-64 shrink-0 border-l border-border bg-white p-4 overflow-y-auto">
        <div className="rounded-lg bg-primary p-4 text-white mb-4">
          <h3 className="text-sm font-medium">Account balance</h3>
          <p className="mt-2 text-2xl font-bold">$0.00</p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <h3 className="text-sm font-semibold text-text">Client alerts</h3>
          <p className="mt-1 text-xs text-text-secondary">No alerts</p>
        </div>
      </aside>
    </div>
  );
}
