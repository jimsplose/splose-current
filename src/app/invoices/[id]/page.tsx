import StatusBadge from "@/components/StatusBadge";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

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

  return (
    <div className="min-h-[calc(100vh-3rem)]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-text">{invoice.invoiceNumber}</h1>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="flex items-center gap-2">
          {invoice.status === "Overdue" && (
            <span className="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700">
              Credit balance: $0.00
            </span>
          )}
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Pay
          </button>
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Email invoice
          </button>
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Actions
          </button>
        </div>
      </div>

      {/* Invoice document */}
      <div className="mx-auto max-w-4xl p-8">
        {/* Color bar */}
        <div className="h-2 rounded-t-lg bg-gradient-to-r from-primary via-green-500 to-yellow-400" />

        <div className="rounded-b-lg border border-border bg-white p-8 shadow-sm">
          {/* Title */}
          <div className="flex items-start justify-between mb-8">
            <h2 className="text-2xl font-bold text-text">
              {invoice.status === "Overdue" ? "Overdue Invoice" : invoice.status === "Paid" ? "Tax Invoice" : "Invoice"}
            </h2>
            <div className="text-4xl text-accent font-bold italic">S</div>
          </div>

          {/* Three column header */}
          <div className="grid grid-cols-3 gap-8 mb-8 text-sm">
            {/* Client */}
            <div>
              <h3 className="font-bold text-text mb-1">Client</h3>
              <p className="text-primary">{invoice.client.firstName} {invoice.client.lastName}</p>
              {invoice.client.address && <p className="text-text-secondary">{invoice.client.address}</p>}
              {invoice.client.ndisNumber && (
                <p className="text-text-secondary">NDIS Number: {invoice.client.ndisNumber}</p>
              )}
              {invoice.client.medicare && (
                <p className="text-text-secondary">Medicare: {invoice.client.medicare}</p>
              )}
            </div>

            {/* From */}
            <div>
              <h3 className="font-bold text-text mb-1">From</h3>
              <p className="text-text">Splose Demo Clinic</p>
              <p className="text-text-secondary">East Clinics</p>
              <p className="text-text-secondary">123 Demo Street</p>
              <p className="text-text-secondary">Melbourne VIC 3000</p>
              <div className="mt-2">
                <p className="font-bold text-text">ABN</p>
                <p className="text-text-secondary">12345678910</p>
              </div>
              {practitioner && (
                <div className="mt-2">
                  <p className="font-bold text-text">Provider</p>
                  <p className="text-text-secondary">{practitioner.name}</p>
                </div>
              )}
            </div>

            {/* Invoice details */}
            <div>
              <div className="space-y-2">
                <div>
                  <p className="font-bold text-text">Invoice #</p>
                  <p className="text-text-secondary">{invoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="font-bold text-text">Issue date</p>
                  <p className="text-text-secondary">{formatDate(invoice.date)}</p>
                </div>
                <div>
                  <p className="font-bold text-text">Due date</p>
                  <p className="text-text-secondary">{formatDate(invoice.dueDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Line items table */}
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-medium text-text">Item code</th>
                <th className="py-2 text-left font-medium text-text">Description</th>
                <th className="py-2 text-right font-medium text-text">Unit price</th>
                <th className="py-2 text-right font-medium text-text">Quantity</th>
                <th className="py-2 text-right font-medium text-text">Unit</th>
                <th className="py-2 text-right font-medium text-text">GST</th>
                <th className="py-2 text-right font-medium text-text">Amount AUD</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={item.id} className="border-b border-border">
                  <td className="py-3 text-text-secondary">{idx + 1}</td>
                  <td className="py-3 text-text">{item.description}</td>
                  <td className="py-3 text-right text-text">{item.unitPrice.toFixed(2)}</td>
                  <td className="py-3 text-right text-text">{item.quantity}</td>
                  <td className="py-3 text-right text-text-secondary">Each</td>
                  <td className="py-3 text-right text-text-secondary">0%</td>
                  <td className="py-3 text-right text-text font-medium">{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Subtotal excl. tax</span>
                <span className="text-text">{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Tax</span>
                <span className="text-text">{invoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-1">
                <span className="font-bold text-text">Total AUD</span>
                <span className="font-bold text-text">{invoice.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between bg-gray-50 px-2 py-1 rounded font-bold">
                <span className="text-text">Total Amount Due AUD</span>
                <span className="text-text">{invoice.status === "Paid" ? "0.00" : invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Additional information */}
          <div className="border-t border-border pt-4 text-sm text-text-secondary">
            <h4 className="font-bold text-text mb-2">Additional Information</h4>
            <p>Please note that the service dates are displayed at the beginning of each line item.</p>
            <div className="mt-4">
              <p>Please pay to:</p>
              <p>Name: Splose Demo Clinic</p>
              <p>Acc: 123456789</p>
              <p>BSB: 000-000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}
