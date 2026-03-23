import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ds";
import ClientTabs from "./ClientTabs";

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

  const tabs = [
    { label: "Details", value: "details", href: `/clients/${id}` },
    { label: "Appointments", value: "appointments", href: `/clients/${id}/appointments` },
    { label: "Communications", value: "communications", href: `/clients/${id}/communications` },
    { label: "Files", value: "files", href: `/clients/${id}/files` },
    { label: "Notes", value: "notes", href: `/clients/${id}/notes` },
    { label: "Cases", value: "cases", href: `/clients/${id}/cases` },
    { label: "Support Activities", value: "support-activities", href: `/clients/${id}/support-activities` },
    { label: "Forms", value: "forms", href: `/clients/${id}/forms` },
    { label: "Invoices", value: "invoices", href: `/clients/${id}/invoices` },
    { label: "Payments", value: "payments", href: `/clients/${id}/payments` },
    { label: "Statements", value: "statements", href: `/clients/${id}/statements` },
    { label: "Letters", value: "letters", href: `/clients/${id}/letters` },
    { label: "Practitioner Access", value: "practitioner-access", href: `/clients/${id}/practitioner-access` },
  ];

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 48px)" }}>
      {/* Page header with title and action buttons */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <h2 className="text-heading-lg text-text">Client</h2>
          <span className="truncate text-body-lg text-text-secondary">
            {client.firstName} ({client.firstName.slice(0, 3)}) {client.lastName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="hidden sm:inline">New SMS</span>
          </Button>
          <Button variant="secondary" size="sm" className="border-primary bg-primary/5 text-primary hover:bg-primary/10">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="hidden sm:inline">New email</span>
          </Button>
          <Button variant="secondary" size="sm">
            Actions
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Tab bar */}
      <ClientTabs tabs={tabs} />

      {/* Tab content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
