import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PaymentStatusBadge, dbStatusToPaymentStatus, Card, Divider, Grid, Text } from "@/components/ds";
import InvoiceActions from "./InvoiceActions";
import styles from "./InvoicePage.module.css";

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
    <div className={styles.shell}>
      {/* Top header bar */}
      <Flex align="center" justify="space-between" className={styles.header}>
        <Flex align="center" gap={12}>
          <Text variant="display/lg" as="h1" color="rgb(66, 105, 74)">{invoice.invoiceNumber}</Text>
          <PaymentStatusBadge status={dbStatusToPaymentStatus(invoice.status)} />
          {creditBalance > 0 && <PaymentStatusBadge status="paid" size="lg" />}
        </Flex>
        <InvoiceActions />
      </Flex>

      {/* Main content with sidebar */}
      <Flex gap={24} className={styles.body}>
        {/* Invoice document */}
        <div className={styles.invoiceCard}>
          {/* Top color bar */}
          <div className={styles.accentBar} />

          <div className={styles.invoiceCardInner}>
            <div className={styles.invoiceCardPadding}>
              {/* Invoice title row + illustration */}
              <Flex align="start" justify="space-between" className={styles.titleRow}>
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
                <div className={styles.illustration}>
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
              <Grid cols={3} gap={32} className={styles.infoGrid}>
                {/* Column 1: Client info */}
                <div>
                  <Text variant="body/md-strong" as="h3" mb={8} className={styles.colHeader}>Client</Text>
                  <Text variant="label/lg" as="p" color="primary">
                    {invoice.client.firstName} {invoice.client.lastName}
                  </Text>
                  {invoice.client.address && <Text variant="body/md" as="p" color="secondary" mt={2}>{invoice.client.address}</Text>}
                  {invoice.client.ndisNumber && (
                    <Text variant="body/md" as="p" color="secondary" mt={4}>
                      <Text variant="body/md" as="span" color="secondary">NDIS Number:</Text> {invoice.client.ndisNumber}
                    </Text>
                  )}
                  {invoice.client.medicare && (
                    <Text variant="body/md" as="p" color="secondary" mt={4}>
                      <Text variant="body/md" as="span" color="secondary">Medicare:</Text> {invoice.client.medicare}
                    </Text>
                  )}
                  {practitioner && (
                    <Text variant="body/md" as="p" color="secondary" mt={4}>
                      <Text variant="body/md" as="span" color="secondary">Prac No.</Text>
                    </Text>
                  )}

                  {/* Care of client */}
                  {invoice.billingType === "NDIS" && (
                    <div className={styles.careOfBlock}>
                      <Text variant="body/md-strong" as="h3" mb={8} className={styles.colHeader}>
                        Care of client above
                      </Text>
                      <Text variant="label/lg" as="p" color="primary">National Disability Insurance Agency</Text>
                      <Text variant="body/md" as="p" color="secondary" mt={2}>GPO Box 700</Text>
                      <Text variant="body/md" as="p" color="secondary">Canberra ACT 2601</Text>
                    </div>
                  )}
                </div>

                {/* Column 2: From info */}
                <div>
                  <Text variant="body/md-strong" as="h3" mb={8} className={styles.colHeader}>From</Text>
                  <Text variant="label/lg" as="p" color="text">Hands Together Therapies</Text>
                  <Text variant="body/md" as="p" color="secondary" mt={2}>East Clinics</Text>
                  <Text variant="body/md" as="p" color="secondary">4 Williamstown Rd</Text>
                  <Text variant="body/md" as="p" color="secondary">Kingsville VIC 3012</Text>

                  {practitioner && (
                    <div className={styles.subBlock}>
                      <Text variant="body/md-strong" as="p" className={styles.colHeader}>Provider</Text>
                      <Text variant="body/md" as="p" color="secondary" mt={4}>{practitioner.name}</Text>
                    </div>
                  )}

                  <div className={styles.subBlock}>
                    <Text variant="body/md-strong" as="p" className={styles.colHeader}>ABN</Text>
                    <Text variant="body/md" as="p" color="secondary" mt={4}>11 234 567 811</Text>
                  </div>
                </div>

                {/* Column 3: Invoice details */}
                <Flex vertical gap={16}>
                  <div>
                    <Text variant="body/md-strong" as="p" className={styles.colHeader}>Invoice #</Text>
                    <Text variant="body/md" as="p" color="text" mt={4}>{invoice.invoiceNumber}</Text>
                  </div>
                  <div>
                    <Text variant="body/md-strong" as="p" className={styles.colHeader}>Issue date</Text>
                    <Text variant="body/md" as="p" color="text" mt={4}>{formatDate(invoice.date)}</Text>
                  </div>
                  <div>
                    <Text variant="body/md-strong" as="p" className={styles.colHeader}>Due date</Text>
                    <Text variant="body/md" as="p" color="text" mt={4}>{formatDate(invoice.dueDate)}</Text>
                  </div>
                </Flex>
              </Grid>

              {/* Line items table */}
              <div className={styles.lineItemsTable}>
                {(() => {
                  type InvoiceItem = { id: string; description: string; unitPrice: number; quantity: number; total: number };
                  const gstRate = invoice.billingType === "NDIS" ? 0 : 10;
                  const lineItemColumns: ColumnsType<InvoiceItem> = [
                    {
                      key: "itemCode",
                      title: "Item code",
                      render: (_, item, idx) => (
                        <Text variant="body/sm" as="span" color="secondary" className={styles.monoCode}>
                          {generateItemCode(item.description, idx)}
                        </Text>
                      ),
                    },
                    { key: "description", title: "Description", dataIndex: "description" },
                    { key: "unitPrice", title: "Unit price", align: "right" as const, render: (_, item) => `$${item.unitPrice.toFixed(2)}` },
                    { key: "quantity", title: "Quantity", align: "right" as const, render: (_, item) => item.quantity.toFixed(2) },
                    { key: "unit", title: "Unit", align: "right" as const, render: () => <Text variant="body/md" as="span" color="secondary">Hour</Text> },
                    { key: "discount", title: "Discount", align: "right" as const, render: () => <Text variant="body/md" as="span" color="secondary">$0.00</Text> },
                    { key: "gst", title: "GST", align: "right" as const, render: () => <Text variant="body/md" as="span" color="secondary">{gstRate}%</Text> },
                    { key: "total", title: "Amount AUD", align: "right" as const, render: (_, item) => <Text variant="label/lg" as="span" color="text">${item.total.toFixed(2)}</Text> },
                  ];
                  return (
                    <Table
                      columns={lineItemColumns}
                      dataSource={invoice.items as InvoiceItem[]}
                      rowKey="id"
                      pagination={false}
                      locale={{ emptyText: <Text variant="body/md" as="span" color="tertiary">No line items</Text> }}
                    />
                  );
                })()}
              </div>

              {/* Totals section */}
              <Flex justify="end" className={styles.totalsWrapper}>
                <Flex vertical gap={8} className={styles.totalsBlock}>
                  <Flex align="center" justify="space-between" className={styles.totalsRow}>
                    <Text variant="body/md" as="span" color="secondary">Subtotal excl. tax</Text>
                    <Text variant="body/md" as="span" color="text">${invoice.subtotal.toFixed(2)}</Text>
                  </Flex>
                  <Flex align="center" justify="space-between" className={styles.totalsRow}>
                    <Text variant="body/md" as="span" color="secondary">Tax</Text>
                    <Text variant="body/md" as="span" color="text">${invoice.tax.toFixed(2)}</Text>
                  </Flex>
                  <Flex align="center" justify="space-between" className={styles.totalsSeparator}>
                    <Text variant="heading/md" as="span" color="text">Total AUD</Text>
                    <Text variant="heading/md" as="span" color="text">${invoice.total.toFixed(2)}</Text>
                  </Flex>
                  <Flex align="center" justify="space-between" className={styles.amountDueRow}>
                    <Text variant="body/md-strong" as="span" color="text">Total Amount Due AUD</Text>
                    <Text variant="body/md-strong" as="span" color="text">${amountDue.toFixed(2)}</Text>
                  </Flex>
                </Flex>
              </Flex>

              {/* Divider */}
              <Divider spacing="none" />

              {/* Additional Information */}
              <div className={styles.additionalInfo}>
                <Text variant="body/sm" as="h4" color="text" weight="medium" mb={12}>Additional Information</Text>
                <Text variant="body/md" as="p" color="secondary">
                  Please note that the service dates are displayed at the beginning of each line item.
                </Text>
                <div className={styles.bankDetails}>
                  <Text variant="label/lg" as="p" color="text">Direct deposit details:</Text>
                  <Flex vertical gap={4} className={styles.bankDetailsInner}>
                    <Text variant="body/md" as="p" color="secondary">
                      <Text variant="body/md" as="span" color="secondary" className={styles.bankLabel}>Name:</Text>
                      Hands Together Therapies
                    </Text>
                    <Text variant="body/md" as="p" color="secondary">
                      <Text variant="body/md" as="span" color="secondary" className={styles.bankLabel}>Acc:</Text>
                      901802703
                    </Text>
                    <Text variant="body/md" as="p" color="secondary">
                      <Text variant="body/md" as="span" color="secondary" className={styles.bankLabel}>BSB:</Text>
                      505-500
                    </Text>
                  </Flex>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <Flex vertical gap={20} className={styles.sidebar}>
          {/* Payments summary */}
          <Card padding="lg" shadow>
            <Text variant="display/xs" as="h3" weight="medium" mb={12}>Payments</Text>
            <Flex align="baseline" justify="space-between" className={styles.paymentsHeader}>
              <Text variant="body/md" as="span" color="secondary">
                {invoice.status === "Paid" ? invoice.total.toFixed(2) : "0.00"} / {invoice.total.toFixed(2)}
              </Text>
            </Flex>
            {/* Progress bar */}
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: invoice.status === "Paid" ? "100%" : "0%" }}
              />
            </div>
            {invoice.status === "Paid" && (
              <Text variant="body/sm" as="p" color="tertiary" mt={8}>
                Paid in full
              </Text>
            )}
          </Card>

          {/* Stripe CTA card */}
          <Card padding="none" shadow>
            {/* ds-exempt: branding — Stripe banner */}
            <div className={styles.stripeBanner}>
              <span className={styles.stripeWordmark}>stripe</span>
            </div>
            <div className={styles.brandingCardBody}>
              <Text variant="body/sm" as="p" color="secondary" mb={12}>
                Add a &lsquo;Pay now&rsquo; button to invoices for clients and contacts to pay online.
              </Text>
              <Button type="link" href="#">Connect to Stripe</Button>
            </div>
          </Card>

          {/* HICAPS / LanternPay card */}
          <Card padding="none" shadow>
            {/* ds-exempt: branding — HICAPS banner */}
            <div className={styles.hicapsBanner}>
              <span className={styles.hicapsPlus}>+</span>
              <span className={styles.hicapsText}>HICAPS</span>
              <span className={styles.hicapsPlus}>+</span>
            </div>
            <div className={styles.brandingCardBody}>
              <Text variant="body/sm" as="p" color="secondary" mb={12}>
                Submit your claim through LanternPay by validating your invoice first.
              </Text>
              <Button block>Claim</Button>
            </div>
          </Card>

          {/* Note */}
          <Card padding="lg" shadow>
            <Text variant="display/xs" as="h3" weight="medium" mb={8}>Note</Text>
            <textarea
              className={styles.noteTextarea}
              rows={4}
              defaultValue=""
            />
          </Card>

          {/* View change log link */}
          <div className={styles.changelogLink}>
            <Button type="link">View change log</Button>
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
