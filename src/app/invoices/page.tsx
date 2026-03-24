import { prisma } from "@/lib/prisma";
import InvoicesClient from "./InvoicesClient";
import type { InvoiceRow } from "./InvoicesClient";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    include: { client: true, items: true, appointment: { include: { practitioner: true } } },
    orderBy: { createdAt: "desc" },
  });

  const rows: InvoiceRow[] = invoices.map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    clientName: `${inv.client.firstName} ${inv.client.lastName}`,
    billingType: inv.billingType,
    location: "East Clinics",
    practitioner: inv.appointment?.practitioner?.name ?? "",
    date: inv.date,
    dueDate: inv.dueDate,
    total: inv.total,
    status: inv.status,
  }));

  return <InvoicesClient invoices={rows} />;
}
