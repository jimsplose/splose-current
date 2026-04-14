import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Flex } from "antd";
import { Button } from "@/components/ds";
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
    <Flex vertical style={{ height: "calc(100vh - 48px)" }}>
      {/* Full-width heading row — matches production layout */}
      <Flex wrap="wrap" align="center" justify="space-between" gap={8} style={{ flexShrink: 0, borderBottom: '1px solid var(--color-border)', paddingLeft: 24, paddingRight: 24, paddingTop: 12, paddingBottom: 12 }}>
        <Flex align="center" gap={8}>
          <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Sprig Sans', 'Inter', sans-serif", color: "rgb(66, 105, 74)" }}>Client</h2>
          <span className="text-body-lg" style={{ color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {client.firstName} ({client.firstName.slice(0, 3)}) {client.lastName}
          </span>
        </Flex>
        <Flex align="center" gap={8}>
          <Button variant="secondary">
            <svg style={{ height: 16, width: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            New SMS
          </Button>
          <Button variant="secondary">
            <svg style={{ height: 16, width: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            New email
          </Button>
          <Button variant="secondary">
            Actions
            <svg style={{ height: 14, width: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </Flex>
      </Flex>
      {/* Sidebar + content row */}
      <Flex style={{ flex: 1, overflow: 'hidden' }}>
        <ClientSidebar sections={sidebarSections} />
        <div style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>{children}</div>
      </Flex>
    </Flex>
  );
}
