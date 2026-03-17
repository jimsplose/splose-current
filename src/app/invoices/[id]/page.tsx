import StatusBadge from "@/components/StatusBadge";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import InvoiceDetailClient from "./InvoiceDetailClient";

export const dynamic = "force-dynamic";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      client: true,
      items: true,
      appointment: { include: { practitioner: true } },
    },
  });

  if (!invoice) notFound();

  const practitioner = invoice.appointment?.practitioner;

  const serializedInvoice = {
    invoiceNumber: invoice.invoiceNumber,
    status: invoice.status,
    date: invoice.date,
    dueDate: invoice.dueDate,
    billingType: invoice.billingType,
    subtotal: invoice.subtotal,
    tax: invoice.tax,
    total: invoice.total,
    client: {
      firstName: invoice.client.firstName,
      lastName: invoice.client.lastName,
      address: invoice.client.address,
      ndisNumber: invoice.client.ndisNumber,
      medicare: invoice.client.medicare,
    },
    items: invoice.items.map((item: { id: string; description: string; unitPrice: number; quantity: number; total: number }) => ({
      id: item.id,
      description: item.description,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      total: item.total,
    })),
    practitionerName: practitioner?.name ?? null,
  };

  return <InvoiceDetailClient invoice={serializedInvoice} />;
}
