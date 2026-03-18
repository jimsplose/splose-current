import StatusBadge from "@/components/StatusBadge";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button, Badge } from "@/components/ds";

export const dynamic = "force-dynamic";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
  const amountDue = invoice.status === "Paid" ? 0 : invoice.total;
  const creditBalance = invoice.status === "Paid" ? 0 : 80;
  const isOverdue = invoice.status === "Overdue";

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-gray-50">
      {/* Top header bar */}
      <div className="flex items-center justify-between border-b border-border bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-text">{invoice.invoiceNumber}</h1>
          <StatusBadge status={invoice.status} />
          {creditBalance > 0 && <Badge variant="green">Credit balance: ${creditBalance.toFixed(2)}</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="shadow-sm">
            Pay
            <svg
              className="h-3.5 w-3.5 text-text-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
          <Button variant="secondary" className="shadow-sm">
            <svg
              className="h-4 w-4 text-text-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Email Invoice
          </Button>
          <Button variant="secondary" className="shadow-sm">
            Actions
            <svg
              className="h-3.5 w-3.5 text-text-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Invoice document */}
      <div className="mx-auto max-w-4xl px-8 py-8">
        {/* Gradient color bar */}
        <div className="h-2 rounded-t-lg bg-gradient-to-r from-purple-500 via-green-500 to-yellow-400" />

        <div className="rounded-b-lg border border-t-0 border-border bg-white shadow-sm">
          <div className="p-10">
            {/* Invoice title row + logo */}
            <div className="mb-10 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isOverdue ? "Overdue Invoice" : invoice.status === "Paid" ? "Tax Invoice" : "Tax Invoice"}
                </h2>
              </div>
              <div className="flex-shrink-0">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-lg text-2xl font-bold text-white"
                  style={{ backgroundColor: "#2d6d40" }}
                >
                  S
                </div>
              </div>
            </div>

            {/* Three-column info block */}
            <div className="mb-10 grid grid-cols-3 gap-x-8 text-sm leading-relaxed">
              {/* Column 1: Client info */}
              <div>
                <h3 className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">Client</h3>
                <p className="font-medium text-primary">
                  {invoice.client.firstName} {invoice.client.lastName}
                </p>
                {invoice.client.address && <p className="mt-0.5 text-gray-600">{invoice.client.address}</p>}
                {invoice.client.ndisNumber && (
                  <p className="mt-1 text-gray-600">
                    <span className="text-gray-500">NDIS Number:</span> {invoice.client.ndisNumber}
                  </p>
                )}
                {invoice.client.medicare && (
                  <p className="mt-1 text-gray-600">
                    <span className="text-gray-500">Medicare:</span> {invoice.client.medicare}
                  </p>
                )}
                {practitioner && (
                  <p className="mt-1 text-gray-600">
                    <span className="text-gray-500">Prac No.</span>
                  </p>
                )}

                {/* Care of client */}
                {invoice.billingType === "NDIS" && (
                  <div className="mt-5">
                    <h3 className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                      Care of client above
                    </h3>
                    <p className="font-medium text-primary">National Disability Insurance Agency</p>
                    <p className="mt-0.5 text-gray-600">GPO Box 700</p>
                    <p className="text-gray-600">Canberra ACT 2601</p>
                  </div>
                )}
              </div>

              {/* Column 2: From info */}
              <div>
                <h3 className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">From</h3>
                <p className="font-medium text-gray-900">Hands Together Therapies</p>
                <p className="mt-0.5 text-gray-600">East Clinics</p>
                <p className="text-gray-600">4 Williamstown Rd</p>
                <p className="text-gray-600">Kingsville VIC 3012</p>

                {practitioner && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Provider</p>
                    <p className="mt-1 text-gray-600">{practitioner.name}</p>
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">ABN</p>
                  <p className="mt-1 text-gray-600">11 234 567 811</p>
                </div>
              </div>

              {/* Column 3: Invoice details */}
              <div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Invoice #</p>
                    <p className="mt-1 text-gray-900">{invoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Issue date</p>
                    <p className="mt-1 text-gray-900">{formatDate(invoice.date)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Due date</p>
                    <p className="mt-1 text-gray-900">{formatDate(invoice.dueDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Line items table */}
            <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Item code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Unit price
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Unit
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Discount
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      GST
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Amount AUD
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoice.items.map(
                    (
                      item: { id: string; description: string; unitPrice: number; quantity: number; total: number },
                      idx: number,
                    ) => {
                      const itemCode = generateItemCode(item.description, idx);
                      const gstRate = invoice.billingType === "NDIS" ? 0 : 10;
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono text-xs text-gray-500">{itemCode}</td>
                          <td className="px-4 py-3 text-gray-900">{item.description}</td>
                          <td className="px-4 py-3 text-right text-gray-900 tabular-nums">
                            ${item.unitPrice.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-900 tabular-nums">
                            {item.quantity.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-500">Hour</td>
                          <td className="px-4 py-3 text-right text-gray-500">$0.00</td>
                          <td className="px-4 py-3 text-right text-gray-500">{gstRate}%</td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900 tabular-nums">
                            ${item.total.toFixed(2)}
                          </td>
                        </tr>
                      );
                    },
                  )}
                  {invoice.items.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
                        No line items
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals section */}
            <div className="mb-10 flex justify-end">
              <div className="w-72 space-y-2 text-sm">
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-500">Subtotal excl. tax</span>
                  <span className="text-gray-900 tabular-nums">${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-900 tabular-nums">${invoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                  <span className="font-semibold text-gray-900">Total AUD</span>
                  <span className="font-semibold text-gray-900 tabular-nums">${invoice.total.toFixed(2)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2.5">
                  <span className="font-bold text-gray-900">Total Amount Due AUD</span>
                  <span className="font-bold text-gray-900 tabular-nums">${amountDue.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Additional Information */}
            <div className="mt-6 text-sm">
              <h4 className="mb-3 font-semibold text-gray-900">Additional Information</h4>
              <p className="text-gray-600">
                Please note that the service dates are displayed at the beginning of each line item.
              </p>
              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <p className="font-medium text-gray-700">Direct deposit details:</p>
                <div className="mt-2 space-y-1 text-gray-600">
                  <p>
                    <span className="inline-block w-16 text-gray-500">Name:</span>
                    Hands Together Therapies
                  </p>
                  <p>
                    <span className="inline-block w-16 text-gray-500">Acc:</span>
                    901802703
                  </p>
                  <p>
                    <span className="inline-block w-16 text-gray-500">BSB:</span>
                    505-500
                  </p>
                </div>
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
    return d.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function generateItemCode(description: string, index: number): string {
  // Generate a realistic NDIS-style item code based on the description
  const codes = [
    "15_038_0128_1_3",
    "15_040_0128_1_3",
    "15_042_0128_1_3",
    "15_044_0128_1_3",
    "15_046_0128_1_3",
    "15_048_0128_1_3",
  ];
  return codes[index % codes.length];
}
