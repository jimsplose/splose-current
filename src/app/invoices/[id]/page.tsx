import StatusBadge from "@/components/StatusBadge";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Mail,
  Plus,
  FileText,
  Printer,
  Copy,
  MoreHorizontal,
} from "lucide-react";

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
  const amountPaid = invoice.status === "Paid" ? invoice.total : 0;
  const outstanding = invoice.total - amountPaid;

  return (
    <div className="min-h-[calc(100vh-3rem)]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/invoices"
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-text"
          >
            <ArrowLeft className="h-4 w-4" />
            Invoices
          </Link>
          <div className="h-5 w-px bg-border" />
          <h1 className="text-xl font-bold text-text">{invoice.invoiceNumber}</h1>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700">
            Credit balance: ${invoice.status === "Paid" ? "0.00" : "680.00"}
          </span>
          <button className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            <CreditCard className="h-4 w-4" />
            Pay
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            <Mail className="h-4 w-4" />
            Email invoice
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            <Plus className="h-4 w-4" />
            Add payment
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            <FileText className="h-4 w-4" />
            Add credit note
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-text-secondary hover:bg-gray-50">
            <Printer className="h-4 w-4" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-text-secondary hover:bg-gray-50">
            <Copy className="h-4 w-4" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-text-secondary hover:bg-gray-50">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Two-column layout: invoice document + sidebar */}
      <div className="flex">
        {/* Invoice document */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="mx-auto max-w-3xl">
            {/* Color bar */}
            <div className="h-2 rounded-t-lg bg-gradient-to-r from-primary via-green-500 to-yellow-400" />

            <div className="rounded-b-lg border border-border bg-white p-8 shadow-sm">
              {/* Title and logo */}
              <div className="mb-8 flex items-start justify-between">
                <h2 className="text-2xl font-bold text-text">
                  {invoice.status === "Overdue"
                    ? "Overdue Invoice"
                    : invoice.status === "Paid"
                      ? "Tax Invoice"
                      : "Invoice"}
                </h2>
                <div
                  className="text-4xl font-bold italic"
                  style={{ color: "#2d6d40" }}
                >
                  S
                </div>
              </div>

              {/* Three column header */}
              <div className="mb-8 grid grid-cols-3 gap-8 text-sm">
                {/* Client */}
                <div>
                  <h3 className="mb-1 font-bold text-text">Client</h3>
                  <p className="text-primary">
                    {invoice.client.firstName} {invoice.client.lastName}
                  </p>
                  {invoice.client.address && (
                    <p className="text-text-secondary">
                      {invoice.client.address}
                    </p>
                  )}
                  {invoice.client.ndisNumber && (
                    <p className="text-text-secondary">
                      NDIS Number: {invoice.client.ndisNumber}
                    </p>
                  )}
                  {invoice.client.medicare && (
                    <p className="text-text-secondary">
                      Medicare: {invoice.client.medicare}
                    </p>
                  )}
                </div>

                {/* From */}
                <div>
                  <h3 className="mb-1 font-bold text-text">From</h3>
                  <p className="text-text">Hands Together Therapies</p>
                  <p className="text-text-secondary">East Clinics</p>
                  <p className="text-text-secondary">4 Williamstown Rd</p>
                  <p className="text-text-secondary">Kingsville VIC 3012</p>
                  <div className="mt-2">
                    <p className="font-bold text-text">ABN</p>
                    <p className="text-text-secondary">112345678110</p>
                  </div>
                  {practitioner && (
                    <div className="mt-2">
                      <p className="font-bold text-text">Provider</p>
                      <p className="text-text-secondary">
                        {practitioner.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Invoice details */}
                <div>
                  <div className="space-y-2">
                    <div>
                      <p className="font-bold text-text">Invoice #</p>
                      <p className="text-text-secondary">
                        {invoice.invoiceNumber}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-text">Issue date</p>
                      <p className="text-text-secondary">
                        {formatDate(invoice.date)}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-text">Due date</p>
                      <p className="text-text-secondary">
                        {formatDate(invoice.dueDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line items table */}
              <table className="mb-6 w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 text-left font-medium text-text">
                      Description
                    </th>
                    <th className="py-2 text-right font-medium text-text">
                      Quantity
                    </th>
                    <th className="py-2 text-right font-medium text-text">
                      Unit price
                    </th>
                    <th className="py-2 text-right font-medium text-text">
                      Tax
                    </th>
                    <th className="py-2 text-right font-medium text-text">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.length > 0 ? (
                    invoice.items.map((item) => {
                      const taxAmount =
                        item.total - item.unitPrice * item.quantity;
                      return (
                        <tr key={item.id} className="border-b border-border">
                          <td className="py-3 text-text">
                            {item.description}
                          </td>
                          <td className="py-3 text-right text-text">
                            {item.quantity}
                          </td>
                          <td className="py-3 text-right text-text">
                            {item.unitPrice.toFixed(2)}
                          </td>
                          <td className="py-3 text-right text-text-secondary">
                            {taxAmount.toFixed(2)}
                          </td>
                          <td className="py-3 text-right font-medium text-text">
                            {item.total.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-6 text-center text-text-secondary"
                      >
                        No items on this invoice
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Totals */}
              <div className="mb-8 flex justify-end">
                <div className="w-64 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="text-text">
                      {invoice.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Tax (GST)</span>
                    <span className="text-text">{invoice.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1">
                    <span className="font-bold text-text">Total AUD</span>
                    <span className="font-bold text-text">
                      {invoice.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Amount paid</span>
                    <span className="text-text">{amountPaid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between rounded bg-gray-50 px-2 py-1 font-bold">
                    <span className="text-text">Amount Due AUD</span>
                    <span className={outstanding > 0 ? "text-danger" : "text-text"}>
                      {outstanding.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional information */}
              <div className="border-t border-border pt-4 text-sm text-text-secondary">
                <h4 className="mb-2 font-bold text-text">
                  Additional Information
                </h4>
                <p>
                  Please note that the service dates are displayed at the
                  beginning of each line item.
                </p>
                <div className="mt-4">
                  <p>Direct deposit details:</p>
                  <div className="mt-2">
                    <p>Please pay to:</p>
                    <p>Name: Hands together therapy</p>
                    <p>Acc: 901802703</p>
                    <p>BSB: 505-500</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar - Payment summary & additional info */}
        <aside className="w-80 shrink-0 overflow-y-auto border-l border-border bg-white p-6">
          {/* Payment summary */}
          <div className="mb-6">
            <h3 className="mb-4 text-sm font-semibold text-text">
              Payment summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Subtotal</span>
                <span className="text-text">
                  ${invoice.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Tax (GST)</span>
                <span className="text-text">${invoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2 font-semibold">
                <span className="text-text">Total</span>
                <span className="text-text">${invoice.total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Amount paid</span>
                <span className="text-text">${amountPaid.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2 font-bold">
                <span className="text-text">Outstanding</span>
                <span
                  className={
                    outstanding > 0 ? "text-danger" : "text-success"
                  }
                >
                  ${outstanding.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <hr className="mb-6 border-border" />

          {/* Additional information */}
          <div className="mb-6">
            <h3 className="mb-4 text-sm font-semibold text-text">
              Additional information
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-text-secondary">Invoice number</span>
                <p className="mt-0.5 font-medium text-text">
                  {invoice.invoiceNumber}
                </p>
              </div>
              <div>
                <span className="text-text-secondary">Issue date</span>
                <p className="mt-0.5 font-medium text-text">
                  {formatDate(invoice.date)}
                </p>
              </div>
              <div>
                <span className="text-text-secondary">Due date</span>
                <p className="mt-0.5 font-medium text-text">
                  {formatDate(invoice.dueDate)}
                </p>
              </div>
              <div>
                <span className="text-text-secondary">Billing type</span>
                <p className="mt-0.5 font-medium text-text">
                  {invoice.billingType}
                </p>
              </div>
              <div>
                <span className="text-text-secondary">Client</span>
                <p className="mt-0.5">
                  <Link
                    href={`/clients/${invoice.clientId}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {invoice.client.firstName} {invoice.client.lastName}
                  </Link>
                </p>
              </div>
              {practitioner && (
                <div>
                  <span className="text-text-secondary">Practitioner</span>
                  <p className="mt-0.5 font-medium text-text">
                    {practitioner.name}
                  </p>
                </div>
              )}
              <div>
                <span className="text-text-secondary">Location</span>
                <p className="mt-0.5 font-medium text-text">East Clinics</p>
              </div>
              {invoice.appointment && (
                <div>
                  <span className="text-text-secondary">Appointment</span>
                  <p className="mt-0.5 font-medium text-text">
                    {formatDate(invoice.appointment.date)},{" "}
                    {invoice.appointment.startTime} &ndash;{" "}
                    {invoice.appointment.endTime}
                  </p>
                </div>
              )}
              {invoice.notes && (
                <div>
                  <span className="text-text-secondary">Notes</span>
                  <p className="mt-0.5 text-text">{invoice.notes}</p>
                </div>
              )}
            </div>
          </div>

          <hr className="mb-6 border-border" />

          {/* Payment history */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-text">
              Payment history
            </h3>
            {invoice.status === "Paid" ? (
              <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3 text-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <CreditCard className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-700">
                    Payment of ${invoice.total.toFixed(2)} received
                  </p>
                  <p className="text-xs text-green-600">
                    {formatDate(invoice.date)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-secondary">
                No payments recorded yet
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
