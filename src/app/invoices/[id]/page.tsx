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
          <span className="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700">
            Credit balance: ${invoice.status === "Paid" ? "0.00" : "680.00"}
          </span>
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Pay &#9660;
          </button>
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Email invoice
          </button>
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Actions &#9660;
          </button>
        </div>
      </div>

      {/* Invoice document */}
      <div className="mx-auto max-w-4xl p-8">
        {/* Color bar */}
        <div className="h-2 rounded-t-lg bg-gradient-to-r from-primary via-green-500 to-yellow-400" />

        <div className="rounded-b-lg border border-border bg-white p-8 shadow-sm">
          {/* Title and logo */}
          <div className="flex items-start justify-between mb-8">
            <h2 className="text-2xl font-bold text-text">
              {invoice.status === "Overdue" ? "Overdue Invoice" : invoice.status === "Paid" ? "Tax Invoice" : "Invoice"}
            </h2>
            <div className="text-4xl font-bold italic" style={{ color: "#2d6d40" }}>S</div>
          </div>

          {/* Three column header */}
          <div className="grid grid-cols-3 gap-8 mb-8 text-sm">
            {/* Client */}
            <div>
              <h3 className="font-bold text-text mb-1">Client</h3>
              <p className="text-primary">{invoice.client.firstName} {invoice.client.lastName}</p>
              {invoice.client.address && <p className="text-text-secondary">{invoice.client.address}</p>}
              {invoice.client.ndisNumber && (
                <>
                  <p className="text-text-secondary">NDIS Number: {invoice.client.ndisNumber}</p>
                  <p className="text-text-secondary">Prac No.</p>
                  <p className="text-text-secondary">Prac No.</p>
                  <p className="text-text-secondary">Prac No.</p>
                </>
              )}
              {invoice.client.medicare && (
                <p className="text-text-secondary">Medicare: {invoice.client.medicare}</p>
              )}
              {/* Care of client above section for contacts */}
              {invoice.billingType === "NDIS" && (
                <div className="mt-3">
                  <h4 className="font-bold text-text">Care of client above</h4>
                  <p className="text-primary">C/o [Client above]</p>
                  <p className="text-text-secondary">161 Bay St.</p>
                  <p className="text-text-secondary">Toronto ON M5J 1C4</p>
                </div>
              )}
            </div>

            {/* From */}
            <div>
              <h3 className="font-bold text-text mb-1">From</h3>
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
                <th className="py-2 text-right font-medium text-text">Discount</th>
                <th className="py-2 text-right font-medium text-text">GST</th>
                <th className="py-2 text-right font-medium text-text">Amount AUD</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={item.id} className="border-b border-border">
                  <td className="py-3 text-text-secondary">{`299dsdds${3234 + idx}`}</td>
                  <td className="py-3 text-text">{item.description}</td>
                  <td className="py-3 text-right text-text">{item.unitPrice.toFixed(2)}</td>
                  <td className="py-3 text-right text-text">{item.quantity.toFixed(2)}</td>
                  <td className="py-3 text-right text-text-secondary">Hour</td>
                  <td className="py-3 text-right text-text-secondary">0.00</td>
                  <td className="py-3 text-right text-text-secondary">15%</td>
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
              <p>aA Direct deposit details:</p>
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
