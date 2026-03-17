import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ClientSidebar from "./ClientSidebar";

export const dynamic = "force-dynamic";

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          appointments: true,
          clinicalNotes: true,
          invoices: true,
        },
      },
    },
  });

  if (!client) notFound();

  const sidebarSections = [
    { label: "Details", href: `/clients/${id}`, count: null },
    { label: "Appointments", href: `/clients/${id}/appointments`, count: client._count.appointments },
    { label: "Communications", href: `/clients/${id}`, count: 0 },
    { label: "Files", href: `/clients/${id}`, count: 0 },
    { label: "Progress notes", href: `/clients/${id}/notes`, count: client._count.clinicalNotes },
    { label: "Cases", href: `/clients/${id}/cases`, count: 0 },
    { label: "Support activities", href: `/clients/${id}`, count: null },
    { label: "Forms", href: `/clients/${id}/forms`, count: 0 },
    { label: "Invoices", href: `/clients/${id}/invoices`, count: client._count.invoices },
    { label: "Payments", href: `/clients/${id}`, count: 0 },
    { label: "Statements", href: `/clients/${id}`, count: null },
    { label: "Letters", href: `/clients/${id}`, count: 0 },
    { label: "Practitioner access", href: `/clients/${id}/practitioner-access`, count: null },
  ];

  return (
    <div className="flex min-h-[calc(100vh-3rem)]">
      <ClientSidebar
        clientName={`${client.firstName} ${client.lastName}`}
        clientInitials={`${client.firstName[0].toLowerCase()}${client.lastName[0].toLowerCase()}`}
        sections={sidebarSections}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top action bar */}
        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-text">Client</h2>
            <span className="text-sm text-text-secondary">{client.firstName} {client.lastName}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
              New SMS
            </button>
            <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
              New email
            </button>
            <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
              Actions &#9660;
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
