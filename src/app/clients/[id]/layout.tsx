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
    { label: "Communications", href: `/clients/${id}/communications`, count: 7 },
    { label: "Files", href: `/clients/${id}/files`, count: 2 },
    { label: "Progress notes", href: `/clients/${id}/notes`, count: client._count.clinicalNotes },
    { label: "Cases", href: `/clients/${id}/cases`, count: 33 },
    { label: "Support activities", href: `/clients/${id}/support-activities`, count: 9 },
    { label: "Forms", href: `/clients/${id}/forms`, count: 212 },
    { label: "Invoices", href: `/clients/${id}/invoices`, count: client._count.invoices },
    { label: "Payments", href: `/clients/${id}/payments`, count: 17 },
    { label: "Statements", href: `/clients/${id}/statements`, count: null },
    { label: "Letters", href: `/clients/${id}/letters`, count: 1 },
    { label: "Practitioner access", href: `/clients/${id}/practitioner-access`, count: null },
  ];

  return (
    <div className="flex" style={{ height: "calc(100vh - 48px)" }}>
      <ClientSidebar
        sections={sidebarSections}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top action bar */}
        <div className="flex items-center justify-between border-b border-border px-6 py-3 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-text">Client</h2>
            <span className="text-base text-text-secondary">
              {client.firstName} ({client.firstName.slice(0, 3)}) {client.lastName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              New SMS
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-primary bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              New email
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
              Actions
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
