import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Flex } from "antd";
import { Badge } from "@/components/ds";

const STATUS_VARIANTS: Record<string, "green" | "red" | "blue" | "yellow" | "gray"> = {
  Paid: "green", Draft: "gray", Sent: "blue", Overdue: "red",
  Outstanding: "yellow", Cancelled: "red", "Partially Paid": "yellow",
};
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
    <div style={{ minHeight: 'calc(100vh - 3rem)', background: '#f9fafb' }}>
      {/* Top header bar */}
      <Flex align="center" justify="space-between" style={{ borderBottom: '1px solid var(--color-border)', background: 'white', padding: '12px 24px' }}>
        <Flex align="center" gap={12}>
          <h1 className="text-heading-lg text-text">{invoice.invoiceNumber}</h1>
          <Badge variant={STATUS_VARIANTS[invoice.status] ?? "gray"}>{invoice.status}</Badge>
          {creditBalance > 0 && <Badge variant="green">Credit balance: ${creditBalance.toFixed(2)}</Badge>}
        </Flex>
        <InvoiceActions />
      </Flex>

      {/* Main content with sidebar */}
      <Flex gap={24} style={{ padding: '32px 32px' }}>
        {/* Invoice document */}
        <div style={{ minWidth: 0, flex: 1 }}>
          {/* Gradient color bar */}
          <div style={{ height: 8, borderRadius: '8px 8px 0 0', background: 'linear-gradient(to right, #a855f7, #22c55e, #facc15)' }} />

          <div style={{ borderRadius: '0 0 8px 8px', border: '1px solid var(--color-border)', borderTop: 'none', background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: 40 }}>
              {/* Invoice title row + illustration */}
              <Flex align="start" justify="space-between" style={{ marginBottom: 40 }}>
                <div>
                  <h2 className="text-display-lg" style={{ color: '#111827' }}>
                    {isOverdue
                      ? "Overdue Invoice"
                      : invoice.status === "Paid"
                        ? "Tax Invoice"
                        : invoice.status === "Sent"
                          ? "Tax Invoice"
                          : "Draft invoice"}
                  </h2>
                </div>
                <div style={{ flexShrink: 0 }}>
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
              </Flex>

              {/* Three-column info block */}
              <div style={{ marginBottom: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0 32px', fontSize: 14, lineHeight: 1.625 }}>
                {/* Column 1: Client info */}
                <div>
                  <h3 style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, color: 'rgb(65, 69, 73)' }}>Client</h3>
                  <p className="text-primary" style={{ fontWeight: 500 }}>
                    {invoice.client.firstName} {invoice.client.lastName}
                  </p>
                  {invoice.client.address && <p style={{ marginTop: 2, color: '#4b5563' }}>{invoice.client.address}</p>}
                  {invoice.client.ndisNumber && (
                    <p style={{ marginTop: 4, color: '#4b5563' }}>
                      <span style={{ color: '#6b7280' }}>NDIS Number:</span> {invoice.client.ndisNumber}
                    </p>
                  )}
                  {invoice.client.medicare && (
                    <p style={{ marginTop: 4, color: '#4b5563' }}>
                      <span style={{ color: '#6b7280' }}>Medicare:</span> {invoice.client.medicare}
                    </p>
                  )}
                  {practitioner && (
                    <p style={{ marginTop: 4, color: '#4b5563' }}>
                      <span style={{ color: '#6b7280' }}>Prac No.</span>
                    </p>
                  )}

                  {/* Care of client */}
                  {invoice.billingType === "NDIS" && (
                    <div style={{ marginTop: 20 }}>
                      <h3 style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, color: 'rgb(65, 69, 73)' }}>
                        Care of client above
                      </h3>
                      <p className="text-primary" style={{ fontWeight: 500 }}>National Disability Insurance Agency</p>
                      <p style={{ marginTop: 2, color: '#4b5563' }}>GPO Box 700</p>
                      <p style={{ color: '#4b5563' }}>Canberra ACT 2601</p>
                    </div>
                  )}
                </div>

                {/* Column 2: From info */}
                <div>
                  <h3 style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, color: 'rgb(65, 69, 73)' }}>From</h3>
                  <p style={{ fontWeight: 500, color: '#111827' }}>Hands Together Therapies</p>
                  <p style={{ marginTop: 2, color: '#4b5563' }}>East Clinics</p>
                  <p style={{ color: '#4b5563' }}>4 Williamstown Rd</p>
                  <p style={{ color: '#4b5563' }}>Kingsville VIC 3012</p>

                  {practitioner && (
                    <div style={{ marginTop: 16 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'rgb(65, 69, 73)' }}>Provider</p>
                      <p style={{ marginTop: 4, color: '#4b5563' }}>{practitioner.name}</p>
                    </div>
                  )}

                  <div style={{ marginTop: 16 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'rgb(65, 69, 73)' }}>ABN</p>
                    <p style={{ marginTop: 4, color: '#4b5563' }}>11 234 567 811</p>
                  </div>
                </div>

                {/* Column 3: Invoice details */}
                <Flex vertical gap={16}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'rgb(65, 69, 73)' }}>Invoice #</p>
                    <p style={{ marginTop: 4, color: '#111827' }}>{invoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'rgb(65, 69, 73)' }}>Issue date</p>
                    <p style={{ marginTop: 4, color: '#111827' }}>{formatDate(invoice.date)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'rgb(65, 69, 73)' }}>Due date</p>
                    <p style={{ marginTop: 4, color: '#111827' }}>{formatDate(invoice.dueDate)}</p>
                  </div>
                </Flex>
              </div>

              {/* Line items table */}
              <div style={{ marginBottom: 32 }}>
                <table style={{ width: '100%', fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <th className="text-label-sm" style={{ paddingBottom: 12, textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>
                        Item code
                      </th>
                      <th className="text-label-sm" style={{ paddingBottom: 12, textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>
                        Description
                      </th>
                      <th className="text-label-sm" style={{ paddingBottom: 12, textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>
                        Unit price
                      </th>
                      <th className="text-label-sm" style={{ paddingBottom: 12, textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>
                        Quantity
                      </th>
                      <th className="text-label-sm" style={{ paddingBottom: 12, textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>
                        Unit
                      </th>
                      <th className="text-label-sm" style={{ paddingBottom: 12, textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>
                        Discount
                      </th>
                      <th className="text-label-sm" style={{ paddingBottom: 12, textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>
                        GST
                      </th>
                      <th className="text-label-sm" style={{ paddingBottom: 12, textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>
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
                          <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '12px 0', fontFamily: 'monospace', fontSize: 12, color: '#6b7280' }}>{itemCode}</td>
                            <td style={{ padding: '12px 0', color: '#111827' }}>{item.description}</td>
                            <td style={{ padding: '12px 0', textAlign: 'right', color: '#111827', fontVariantNumeric: 'tabular-nums' }}>
                              ${item.unitPrice.toFixed(2)}
                            </td>
                            <td style={{ padding: '12px 0', textAlign: 'right', color: '#111827', fontVariantNumeric: 'tabular-nums' }}>
                              {item.quantity.toFixed(2)}
                            </td>
                            <td style={{ padding: '12px 0', textAlign: 'right', color: '#6b7280' }}>Hour</td>
                            <td style={{ padding: '12px 0', textAlign: 'right', color: '#6b7280' }}>$0.00</td>
                            <td style={{ padding: '12px 0', textAlign: 'right', color: '#6b7280' }}>{gstRate}%</td>
                            <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 500, color: '#111827', fontVariantNumeric: 'tabular-nums' }}>
                              ${item.total.toFixed(2)}
                            </td>
                          </tr>
                        );
                      },
                    )}
                    {invoice.items.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ padding: '24px 0', textAlign: 'center', color: '#9ca3af' }}>
                          No line items
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals section */}
              <Flex justify="end" style={{ marginBottom: 40 }}>
                <Flex vertical gap={8} style={{ width: 288, fontSize: 14 }}>
                  <Flex align="center" justify="space-between" style={{ padding: '4px 0' }}>
                    <span style={{ color: '#6b7280' }}>Subtotal excl. tax</span>
                    <span style={{ color: '#111827', fontVariantNumeric: 'tabular-nums' }}>${invoice.subtotal.toFixed(2)}</span>
                  </Flex>
                  <Flex align="center" justify="space-between" style={{ padding: '4px 0' }}>
                    <span style={{ color: '#6b7280' }}>Tax</span>
                    <span style={{ color: '#111827', fontVariantNumeric: 'tabular-nums' }}>${invoice.tax.toFixed(2)}</span>
                  </Flex>
                  <Flex align="center" justify="space-between" style={{ borderTop: '1px solid #e5e7eb', paddingTop: 8 }}>
                    <span style={{ fontWeight: 600, color: '#111827' }}>Total AUD</span>
                    <span style={{ fontWeight: 600, color: '#111827', fontVariantNumeric: 'tabular-nums' }}>${invoice.total.toFixed(2)}</span>
                  </Flex>
                  <Flex align="center" justify="space-between" style={{ marginTop: 4, borderRadius: 8, background: '#f3f4f6', padding: '10px 12px' }}>
                    <span style={{ fontWeight: 700, color: '#111827' }}>Total Amount Due AUD</span>
                    <span style={{ fontWeight: 700, color: '#111827', fontVariantNumeric: 'tabular-nums' }}>${amountDue.toFixed(2)}</span>
                  </Flex>
                </Flex>
              </Flex>

              {/* Divider */}
              <div style={{ borderTop: '1px solid #e5e7eb' }} />

              {/* Additional Information */}
              <div style={{ marginTop: 24, fontSize: 14 }}>
                <h4 style={{ marginBottom: 12, fontWeight: 600, color: '#111827' }}>Additional Information</h4>
                <p style={{ color: '#4b5563' }}>
                  Please note that the service dates are displayed at the beginning of each line item.
                </p>
                <div style={{ marginTop: 16, borderRadius: 8, background: '#f9fafb', padding: 16 }}>
                  <p style={{ fontWeight: 500, color: '#374151' }}>Direct deposit details:</p>
                  <Flex vertical gap={4} style={{ marginTop: 8, color: '#4b5563' }}>
                    <p>
                      <span style={{ display: 'inline-block', width: 64, color: '#6b7280' }}>Name:</span>
                      Hands Together Therapies
                    </p>
                    <p>
                      <span style={{ display: 'inline-block', width: 64, color: '#6b7280' }}>Acc:</span>
                      901802703
                    </p>
                    <p>
                      <span style={{ display: 'inline-block', width: 64, color: '#6b7280' }}>BSB:</span>
                      505-500
                    </p>
                  </Flex>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <Flex vertical gap={20} style={{ width: 320, flexShrink: 0, paddingTop: 8 }}>
          {/* Payments summary */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', background: 'white', padding: 20, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: 12, fontSize: 21, fontWeight: 500, color: 'rgb(65, 69, 73)' }}>Payments</h3>
            <Flex align="baseline" justify="space-between" style={{ marginBottom: 8, fontSize: 14 }}>
              <span style={{ color: '#6b7280' }}>
                {invoice.status === "Paid" ? invoice.total.toFixed(2) : "0.00"} / {invoice.total.toFixed(2)} AUD
              </span>
            </Flex>
            {/* Progress bar */}
            <div style={{ height: 8, width: '100%', overflow: 'hidden', borderRadius: 9999, background: '#f3f4f6' }}>
              <div
                style={{ height: '100%', borderRadius: 9999, background: 'var(--color-primary)', transition: 'all 0.3s', width: invoice.status === "Paid" ? "100%" : "0%" }}
              />
            </div>
            <p style={{ marginTop: 8, fontSize: 12, color: '#9ca3af' }}>
              {invoice.status === "Paid" ? "Paid in full" : "No payments recorded"}
            </p>
          </div>

          {/* Stripe CTA card */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', background: 'white', padding: 20, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <Flex align="center" gap={8} style={{ marginBottom: 12 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="20" height="20" rx="4" fill="#635BFF" />
                <path d="M9.3 8.2C8.1 7.7 7.5 7.4 7.5 6.8C7.5 6.3 8 5.9 8.8 5.9C10 5.9 10.9 6.4 10.9 6.4L11.5 4.8C11.5 4.8 10.5 4.2 8.8 4.2C6.5 4.2 5 5.5 5 7.1C5 8.4 5.9 9.2 7.3 9.8C8.4 10.2 8.8 10.6 8.8 11.1C8.8 11.7 8.3 12.1 7.4 12.1C6.2 12.1 5 11.4 5 11.4L4.3 13C4.3 13 5.5 13.8 7.3 13.8C9.7 13.8 11.3 12.6 11.3 10.8C11.3 9.4 10.3 8.6 9.3 8.2Z" fill="white" />
              </svg>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Stripe</span>
            </Flex>
            <p style={{ marginBottom: 12, fontSize: 12, color: '#6b7280' }}>
              Connect your Stripe account to accept online payments directly from invoices.
            </p>
            <button style={{ width: '100%', borderRadius: 8, background: '#635BFF', padding: '8px 16px', fontSize: 14, fontWeight: 500, color: 'white', border: 'none', cursor: 'pointer' }}>
              Connect Stripe
            </button>
          </div>

          {/* Note */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', background: 'white', padding: 20, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <h3 className="text-label-lg" style={{ marginBottom: 8, fontWeight: 600, color: '#111827' }}>Note</h3>
            <textarea
              style={{ width: '100%', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', padding: 12, fontSize: 14, color: '#374151', outline: 'none' }}
              rows={4}
              placeholder="Add an internal note..."
              defaultValue=""
            />
          </div>

          {/* View change log link */}
          <div style={{ padding: '0 4px' }}>
            <button className="text-primary" style={{ fontSize: 14, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
              View change log
            </button>
          </div>
        </Flex>
      </Flex>
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
