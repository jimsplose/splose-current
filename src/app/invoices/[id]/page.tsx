import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge, statusVariant } from "@/components/ds";
import InvoiceActions from "./InvoiceActions";

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
          <h1 className="text-heading-lg text-text">{invoice.invoiceNumber}</h1>
          <Badge variant={statusVariant(invoice.status)}>{invoice.status}</Badge>
          {creditBalance > 0 && <Badge variant="green">Credit balance: ${creditBalance.toFixed(2)}</Badge>}
        </div>
        <InvoiceActions />
      </div>

      {/* Main content with sidebar */}
      <div className="flex gap-6 px-8 py-8">
        {/* Invoice document */}
        <div className="min-w-0 flex-1">
          {/* Gradient color bar */}
          <div className="h-2 rounded-t-lg bg-gradient-to-r from-purple-500 via-green-500 to-yellow-400" />

          <div className="rounded-b-lg border border-t-0 border-border bg-white shadow-sm">
            <div className="p-10">
              {/* Invoice title row + illustration */}
              <div className="mb-10 flex items-start justify-between">
                <div>
                  <h2 className="text-display-lg text-gray-900">
                    {isOverdue
                      ? "Overdue Invoice"
                      : invoice.status === "Paid"
                        ? "Tax Invoice"
                        : invoice.status === "Sent"
                          ? "Tax Invoice"
                          : "Draft invoice"}
                  </h2>
                </div>
                <div className="flex-shrink-0">
                  {/* Splose hand-wave illustration */}
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="80" height="80" rx="16" fill="#F0FDF4" />
                    <path
                      d="M40 20C35 20 32 24 32 28C32 32 35 34 38 35C34 36 30 39 30 44C30 49 34 52 40 52C46 52 50 49 50 44C50 39 46 36 42 35C45 34 48 32 48 28C48 24 45 20 40 20Z"
                      fill="#2d6d40"
                      opacity="0.15"
                    />
                    <path
                      d="M26 44C26 44 28 38 32 36"
                      stroke="#2d6d40"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M54 44C54 44 52 38 48 36"
                      stroke="#2d6d40"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="36" cy="42" r="2" fill="#2d6d40" />
                    <circle cx="44" cy="42" r="2" fill="#2d6d40" />
                    <path
                      d="M36 48C36 48 38 50 40 50C42 50 44 48 44 48"
                      stroke="#2d6d40"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M22 32C22 32 24 28 26 30"
                      stroke="#2d6d40"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M58 32C58 32 56 28 54 30"
                      stroke="#2d6d40"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M20 36L24 35"
                      stroke="#2d6d40"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M60 36L56 35"
                      stroke="#2d6d40"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Three-column info block */}
              <div className="mb-10 grid grid-cols-3 gap-x-8 text-sm leading-relaxed">
                {/* Column 1: Client info */}
                <div>
                  <h3 className="mb-2 text-label-sm font-semibold text-gray-400">Client</h3>
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
                      <h3 className="mb-2 text-label-sm font-semibold text-gray-400">
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
                  <h3 className="mb-2 text-label-sm font-semibold text-gray-400">From</h3>
                  <p className="font-medium text-gray-900">Hands Together Therapies</p>
                  <p className="mt-0.5 text-gray-600">East Clinics</p>
                  <p className="text-gray-600">4 Williamstown Rd</p>
                  <p className="text-gray-600">Kingsville VIC 3012</p>

                  {practitioner && (
                    <div className="mt-4">
                      <p className="text-label-sm font-semibold text-gray-400">Provider</p>
                      <p className="mt-1 text-gray-600">{practitioner.name}</p>
                    </div>
                  )}

                  <div className="mt-4">
                    <p className="text-label-sm font-semibold text-gray-400">ABN</p>
                    <p className="mt-1 text-gray-600">11 234 567 811</p>
                  </div>
                </div>

                {/* Column 3: Invoice details */}
                <div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-label-sm font-semibold text-gray-400">Invoice #</p>
                      <p className="mt-1 text-gray-900">{invoice.invoiceNumber}</p>
                    </div>
                    <div>
                      <p className="text-label-sm font-semibold text-gray-400">Issue date</p>
                      <p className="mt-1 text-gray-900">{formatDate(invoice.date)}</p>
                    </div>
                    <div>
                      <p className="text-label-sm font-semibold text-gray-400">Due date</p>
                      <p className="mt-1 text-gray-900">{formatDate(invoice.dueDate)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line items table */}
              <div className="mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-left text-label-sm font-semibold text-gray-500">
                        Item code
                      </th>
                      <th className="pb-3 text-left text-label-sm font-semibold text-gray-500">
                        Description
                      </th>
                      <th className="pb-3 text-right text-label-sm font-semibold text-gray-500">
                        Unit price
                      </th>
                      <th className="pb-3 text-right text-label-sm font-semibold text-gray-500">
                        Quantity
                      </th>
                      <th className="pb-3 text-right text-label-sm font-semibold text-gray-500">
                        Unit
                      </th>
                      <th className="pb-3 text-right text-label-sm font-semibold text-gray-500">
                        Discount
                      </th>
                      <th className="pb-3 text-right text-label-sm font-semibold text-gray-500">
                        GST
                      </th>
                      <th className="pb-3 text-right text-label-sm font-semibold text-gray-500">
                        Amount AUD
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map(
                      (
                        item: { id: string; description: string; unitPrice: number; quantity: number; total: number },
                        idx: number,
                      ) => {
                        const itemCode = generateItemCode(item.description, idx);
                        const gstRate = invoice.billingType === "NDIS" ? 0 : 10;
                        return (
                          <tr key={item.id} className="border-b border-gray-100">
                            <td className="py-3 font-mono text-xs text-gray-500">{itemCode}</td>
                            <td className="py-3 text-gray-900">{item.description}</td>
                            <td className="py-3 text-right text-gray-900 tabular-nums">
                              ${item.unitPrice.toFixed(2)}
                            </td>
                            <td className="py-3 text-right text-gray-900 tabular-nums">
                              {item.quantity.toFixed(2)}
                            </td>
                            <td className="py-3 text-right text-gray-500">Hour</td>
                            <td className="py-3 text-right text-gray-500">$0.00</td>
                            <td className="py-3 text-right text-gray-500">{gstRate}%</td>
                            <td className="py-3 text-right font-medium text-gray-900 tabular-nums">
                              ${item.total.toFixed(2)}
                            </td>
                          </tr>
                        );
                      },
                    )}
                    {invoice.items.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-gray-400">
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

        {/* Right sidebar */}
        <div className="w-[320px] flex-shrink-0 space-y-5 pt-2">
          {/* Payments summary */}
          <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-label-lg font-semibold text-gray-900">Payments</h3>
            <div className="mb-2 flex items-baseline justify-between text-sm">
              <span className="text-gray-500">
                {invoice.status === "Paid" ? invoice.total.toFixed(2) : "0.00"} / {invoice.total.toFixed(2)} AUD
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: invoice.status === "Paid" ? "100%" : "0%" }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-400">
              {invoice.status === "Paid" ? "Paid in full" : "No payments recorded"}
            </p>
          </div>

          {/* Stripe CTA card */}
          <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="20" height="20" rx="4" fill="#635BFF" />
                <path d="M9.3 8.2C8.1 7.7 7.5 7.4 7.5 6.8C7.5 6.3 8 5.9 8.8 5.9C10 5.9 10.9 6.4 10.9 6.4L11.5 4.8C11.5 4.8 10.5 4.2 8.8 4.2C6.5 4.2 5 5.5 5 7.1C5 8.4 5.9 9.2 7.3 9.8C8.4 10.2 8.8 10.6 8.8 11.1C8.8 11.7 8.3 12.1 7.4 12.1C6.2 12.1 5 11.4 5 11.4L4.3 13C4.3 13 5.5 13.8 7.3 13.8C9.7 13.8 11.3 12.6 11.3 10.8C11.3 9.4 10.3 8.6 9.3 8.2Z" fill="white" />
              </svg>
              <span className="text-sm font-semibold text-gray-900">Stripe</span>
            </div>
            <p className="mb-3 text-xs text-gray-500">
              Connect your Stripe account to accept online payments directly from invoices.
            </p>
            <button className="w-full rounded-lg bg-[#635BFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5851DB] transition-colors">
              Connect Stripe
            </button>
          </div>

          {/* Note */}
          <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
            <h3 className="mb-2 text-label-lg font-semibold text-gray-900">Note</h3>
            <textarea
              className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              rows={4}
              placeholder="Add an internal note..."
              defaultValue=""
            />
          </div>

          {/* View change log link */}
          <div className="px-1">
            <button className="text-sm font-medium text-primary hover:underline">
              View change log
            </button>
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
