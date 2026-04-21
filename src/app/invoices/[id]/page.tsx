import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Flex } from "antd";
import { Badge, Button, Card, Divider, Grid, Text } from "@/components/ds";

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
    <div style={{ minHeight: 'calc(100vh - 3rem)', background: 'var(--color-bg-layout)' }}>
      {/* Top header bar */}
      <Flex align="center" justify="space-between" style={{ borderBottom: '1px solid var(--color-border)', background: 'white', padding: '12px 24px' }}>
        <Flex align="center" gap={12}>
          <Text variant="display/lg" as="h1" color="rgb(66, 105, 74)">{invoice.invoiceNumber}</Text>
          <Badge variant={STATUS_VARIANTS[invoice.status] ?? "gray"} solid>{invoice.status}</Badge>
          {creditBalance > 0 && <Badge variant="blue" solid>Credit balance: ${creditBalance.toFixed(2)}</Badge>}
        </Flex>
        <InvoiceActions />
      </Flex>

      {/* Main content with sidebar */}
      <Flex gap={24} style={{ padding: '32px 32px' }}>
        {/* Invoice document */}
        <div style={{ minWidth: 0, flex: 1 }}>
          {/* Top color bar */}
          <div style={{ height: 15, borderRadius: '8px 8px 0 0', background: 'rgb(134, 157, 252)' }} />

          <div style={{ borderRadius: '0 0 8px 8px', border: '1px solid var(--color-border)', borderTop: 'none', background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: 40 }}>
              {/* Invoice title row + illustration */}
              <Flex align="start" justify="space-between" style={{ marginBottom: 40 }}>
                <div>
                  <Text variant="heading/xl" as="h2">
                    {isOverdue
                      ? "Overdue Invoice"
                      : invoice.status === "Paid"
                        ? "Tax Invoice"
                        : invoice.status === "Sent"
                          ? "Tax Invoice"
                          : "Draft invoice"}
                  </Text>
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
              <Grid cols={3} gap={32} style={{ marginBottom: 40 }}>
                {/* Column 1: Client info */}
                <div>
                  <Text variant="body/md-strong" as="h3" style={{ fontSize: 13, color: 'rgb(65, 69, 73)', marginBottom: 8 }}>Client</Text>
                  <Text variant="label/lg" as="p" color="primary">
                    {invoice.client.firstName} {invoice.client.lastName}
                  </Text>
                  {invoice.client.address && <Text variant="body/md" as="p" color="secondary" style={{ marginTop: 2 }}>{invoice.client.address}</Text>}
                  {invoice.client.ndisNumber && (
                    <Text variant="body/md" as="p" color="secondary" style={{ marginTop: 4 }}>
                      <Text variant="body/md" as="span" color="secondary">NDIS Number:</Text> {invoice.client.ndisNumber}
                    </Text>
                  )}
                  {invoice.client.medicare && (
                    <Text variant="body/md" as="p" color="secondary" style={{ marginTop: 4 }}>
                      <Text variant="body/md" as="span" color="secondary">Medicare:</Text> {invoice.client.medicare}
                    </Text>
                  )}
                  {practitioner && (
                    <Text variant="body/md" as="p" color="secondary" style={{ marginTop: 4 }}>
                      <Text variant="body/md" as="span" color="secondary">Prac No.</Text>
                    </Text>
                  )}

                  {/* Care of client */}
                  {invoice.billingType === "NDIS" && (
                    <div style={{ marginTop: 20 }}>
                      <Text variant="body/md-strong" as="h3" style={{ fontSize: 13, color: 'rgb(65, 69, 73)', marginBottom: 8 }}>
                        Care of client above
                      </Text>
                      <Text variant="label/lg" as="p" color="primary">National Disability Insurance Agency</Text>
                      <Text variant="body/md" as="p" color="secondary" style={{ marginTop: 2 }}>GPO Box 700</Text>
                      <Text variant="body/md" as="p" color="secondary">Canberra ACT 2601</Text>
                    </div>
                  )}
                </div>

                {/* Column 2: From info */}
                <div>
                  <Text variant="body/md-strong" as="h3" style={{ fontSize: 13, color: 'rgb(65, 69, 73)', marginBottom: 8 }}>From</Text>
                  <Text variant="label/lg" as="p" color="text">Hands Together Therapies</Text>
                  <Text variant="body/md" as="p" color="secondary" style={{ marginTop: 2 }}>East Clinics</Text>
                  <Text variant="body/md" as="p" color="secondary">4 Williamstown Rd</Text>
                  <Text variant="body/md" as="p" color="secondary">Kingsville VIC 3012</Text>

                  {practitioner && (
                    <div style={{ marginTop: 16 }}>
                      <Text variant="body/md-strong" as="p" style={{ fontSize: 13, color: 'rgb(65, 69, 73)' }}>Provider</Text>
                      <Text variant="body/md" as="p" color="secondary" style={{ marginTop: 4 }}>{practitioner.name}</Text>
                    </div>
                  )}

                  <div style={{ marginTop: 16 }}>
                    <Text variant="body/md-strong" as="p" style={{ fontSize: 13, color: 'rgb(65, 69, 73)' }}>ABN</Text>
                    <Text variant="body/md" as="p" color="secondary" style={{ marginTop: 4 }}>11 234 567 811</Text>
                  </div>
                </div>

                {/* Column 3: Invoice details */}
                <Flex vertical gap={16}>
                  <div>
                    <Text variant="body/md-strong" as="p" style={{ fontSize: 13, color: 'rgb(65, 69, 73)' }}>Invoice #</Text>
                    <Text variant="body/md" as="p" color="text" style={{ marginTop: 4 }}>{invoice.invoiceNumber}</Text>
                  </div>
                  <div>
                    <Text variant="body/md-strong" as="p" style={{ fontSize: 13, color: 'rgb(65, 69, 73)' }}>Issue date</Text>
                    <Text variant="body/md" as="p" color="text" style={{ marginTop: 4 }}>{formatDate(invoice.date)}</Text>
                  </div>
                  <div>
                    <Text variant="body/md-strong" as="p" style={{ fontSize: 13, color: 'rgb(65, 69, 73)' }}>Due date</Text>
                    <Text variant="body/md" as="p" color="text" style={{ marginTop: 4 }}>{formatDate(invoice.dueDate)}</Text>
                  </div>
                </Flex>
              </Grid>

              {/* Line items table */}
              <div style={{ marginBottom: 32 }}>
                <table style={{ width: '100%' }}>
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 text-left">
                        <Text variant="heading/sm" as="span" color="secondary">Item code</Text>
                      </th>
                      <th className="pb-3 text-left">
                        <Text variant="heading/sm" as="span" color="secondary">Description</Text>
                      </th>
                      <th className="pb-3 text-right">
                        <Text variant="heading/sm" as="span" color="secondary">Unit price</Text>
                      </th>
                      <th className="pb-3 text-right">
                        <Text variant="heading/sm" as="span" color="secondary">Quantity</Text>
                      </th>
                      <th className="pb-3 text-right">
                        <Text variant="heading/sm" as="span" color="secondary">Unit</Text>
                      </th>
                      <th className="pb-3 text-right">
                        <Text variant="heading/sm" as="span" color="secondary">Discount</Text>
                      </th>
                      <th className="pb-3 text-right">
                        <Text variant="heading/sm" as="span" color="secondary">GST</Text>
                      </th>
                      <th className="pb-3 text-right">
                        <Text variant="heading/sm" as="span" color="secondary">Amount AUD</Text>
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
                          <tr key={item.id} className="border-b border-fill-secondary">
                            <td className="py-3">
                              <Text variant="body/sm" as="span" color="secondary" style={{ fontFamily: 'monospace' }}>{itemCode}</Text>
                            </td>
                            <td className="py-3">
                              <Text variant="body/md" as="span" color="text">{item.description}</Text>
                            </td>
                            <td className="py-3 text-right tabular-nums">
                              <Text variant="body/md" as="span" color="text">${item.unitPrice.toFixed(2)}</Text>
                            </td>
                            <td className="py-3 text-right tabular-nums">
                              <Text variant="body/md" as="span" color="text">{item.quantity.toFixed(2)}</Text>
                            </td>
                            <td className="py-3 text-right">
                              <Text variant="body/md" as="span" color="secondary">Hour</Text>
                            </td>
                            <td className="py-3 text-right">
                              <Text variant="body/md" as="span" color="secondary">$0.00</Text>
                            </td>
                            <td className="py-3 text-right">
                              <Text variant="body/md" as="span" color="secondary">{gstRate}%</Text>
                            </td>
                            <td className="py-3 text-right tabular-nums">
                              <Text variant="label/lg" as="span" color="text">${item.total.toFixed(2)}</Text>
                            </td>
                          </tr>
                        );
                      },
                    )}
                    {invoice.items.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-6 text-center">
                          <Text variant="body/md" as="span" color="tertiary">No line items</Text>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals section */}
              <Flex justify="end" style={{ marginBottom: 40 }}>
                <Flex vertical gap={8} style={{ width: 288 }}>
                  <Flex align="center" justify="space-between" style={{ padding: '4px 0' }}>
                    <Text variant="body/md" as="span" color="secondary">Subtotal excl. tax</Text>
                    <Text variant="body/md" as="span" color="text" className="tabular-nums">${invoice.subtotal.toFixed(2)}</Text>
                  </Flex>
                  <Flex align="center" justify="space-between" style={{ padding: '4px 0' }}>
                    <Text variant="body/md" as="span" color="secondary">Tax</Text>
                    <Text variant="body/md" as="span" color="text" className="tabular-nums">${invoice.tax.toFixed(2)}</Text>
                  </Flex>
                  <Flex align="center" justify="space-between" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 8 }}>
                    <Text variant="heading/md" as="span" color="text">Total AUD</Text>
                    <Text variant="heading/md" as="span" color="text" className="tabular-nums">${invoice.total.toFixed(2)}</Text>
                  </Flex>
                  <Flex align="center" justify="space-between" style={{ marginTop: 4, borderRadius: 8, background: 'var(--color-fill-secondary)', padding: '10px 12px' }}>
                    <Text variant="body/md-strong" as="span" color="text">Total Amount Due AUD</Text>
                    <Text variant="body/md-strong" as="span" color="text" className="tabular-nums">${amountDue.toFixed(2)}</Text>
                  </Flex>
                </Flex>
              </Flex>

              {/* Divider */}
              <Divider spacing="none" />

              {/* Additional Information */}
              <div style={{ marginTop: 24 }}>
                <Text variant="body/sm" as="h4" color="text" weight="medium" style={{ marginBottom: 12 }}>Additional Information</Text>
                <Text variant="body/md" as="p" color="secondary">
                  Please note that the service dates are displayed at the beginning of each line item.
                </Text>
                <div style={{ marginTop: 16, borderRadius: 8, background: 'var(--color-fill-tertiary)', padding: 16 }}>
                  <Text variant="label/lg" as="p" color="text">Direct deposit details:</Text>
                  <Flex vertical gap={4} style={{ marginTop: 8 }}>
                    <Text variant="body/md" as="p" color="secondary">
                      <Text variant="body/md" as="span" color="secondary" className="inline-block w-16">Name:</Text>
                      Hands Together Therapies
                    </Text>
                    <Text variant="body/md" as="p" color="secondary">
                      <Text variant="body/md" as="span" color="secondary" className="inline-block w-16">Acc:</Text>
                      901802703
                    </Text>
                    <Text variant="body/md" as="p" color="secondary">
                      <Text variant="body/md" as="span" color="secondary" className="inline-block w-16">BSB:</Text>
                      505-500
                    </Text>
                  </Flex>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <Flex vertical gap={20} style={{ width: 320, flexShrink: 0, paddingTop: 8 }}>
          {/* Payments summary */}
          <Card padding="lg" shadow>
            <Text variant="display/xs" as="h3" weight="medium" style={{ marginBottom: 12 }}>Payments</Text>
            <Flex align="baseline" justify="space-between" style={{ marginBottom: 8 }}>
              <Text variant="body/md" as="span" color="secondary">
                {invoice.status === "Paid" ? invoice.total.toFixed(2) : "0.00"} / {invoice.total.toFixed(2)}
              </Text>
            </Flex>
            {/* Progress bar */}
            <div style={{ height: 8, width: '100%', overflow: 'hidden', borderRadius: 9999, background: 'var(--color-fill-secondary)' }}>
              <div
                style={{ height: '100%', borderRadius: 9999, background: 'var(--color-primary)', transition: 'all 0.3s', width: invoice.status === "Paid" ? "100%" : "0%" }}
              />
            </div>
            {invoice.status === "Paid" && (
              <Text variant="body/sm" as="p" color="tertiary" style={{ marginTop: 8 }}>
                Paid in full
              </Text>
            )}
          </Card>

          {/* Stripe CTA card */}
          <Card padding="none" shadow>
            {/* Purple banner with lowercase 'stripe' wordmark */}
            <div style={{ background: 'rgb(99, 91, 252)', padding: '10px 16px', height: 50, display: 'flex', alignItems: 'center', borderRadius: '8px 8px 0 0' }}>
              <span style={{ color: 'white', fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1 }}>stripe</span>
            </div>
            <div style={{ padding: 16 }}>
              <Text variant="body/sm" as="p" color="secondary" style={{ marginBottom: 12 }}>
                Add a &lsquo;Pay now&rsquo; button to invoices for clients and contacts to pay online.
              </Text>
              <Button variant="link" href="#">Connect to Stripe</Button>
            </div>
          </Card>

          {/* HICAPS / LanternPay card */}
          <Card padding="none" shadow>
            {/* Gray banner with HICAPS wordmark */}
            <div style={{ background: 'rgb(241, 241, 241)', padding: '10px 16px', height: 50, display: 'flex', alignItems: 'center', gap: 4, borderRadius: '8px 8px 0 0' }}>
              <span style={{ color: '#ffc400', fontSize: 20, fontWeight: 700, lineHeight: 1 }}>+</span>
              <span style={{ color: 'rgb(65, 69, 73)', fontSize: 20, fontWeight: 800, letterSpacing: '0.5px', lineHeight: 1 }}>HICAPS</span>
              <span style={{ color: '#ffc400', fontSize: 20, fontWeight: 700, lineHeight: 1 }}>+</span>
            </div>
            <div style={{ padding: 16 }}>
              <Text variant="body/sm" as="p" color="secondary" style={{ marginBottom: 12 }}>
                Submit your claim through LanternPay by validating your invoice first.
              </Text>
              <Button variant="secondary" style={{ width: '100%' }}>Claim</Button>
            </div>
          </Card>

          {/* Note */}
          <Card padding="lg" shadow>
            <Text variant="display/xs" as="h3" weight="medium" style={{ marginBottom: 8 }}>Note</Text>
            <textarea
              className="text-body-md text-text"
              style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-fill-tertiary)', padding: 12, outline: 'none', fontFamily: 'inherit' }}
              rows={4}
              defaultValue=""
            />
          </Card>

          {/* View change log link */}
          <div style={{ padding: '0 4px' }}>
            <Button variant="link">View change log</Button>
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
