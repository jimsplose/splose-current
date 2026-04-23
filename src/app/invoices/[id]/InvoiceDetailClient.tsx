"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRegisterCommands } from "@/hooks/useRegisterCommands";
import { DownOutlined, MailOutlined } from "@ant-design/icons";
import Icon from "@/components/ds/Icon";
import { Button, Flex } from "antd";
import { Divider, Dropdown, FormInput, FormSelect, FormTextarea, Grid, PaymentStatusBadge, dbStatusToPaymentStatus, Text } from "@/components/ds";
import type { DropdownItem } from "@/components/ds";
import Modal from "@/components/ds/Modal";

const payItems: DropdownItem[] = [
  { label: "Record payment", value: "record-payment" },
  { label: "Send payment link", value: "send-payment-link" },
];

const actionsItems: DropdownItem[] = [
  { label: "Duplicate invoice", value: "duplicate" },
  { label: "Credit note", value: "credit-note" },
  { label: "Change log", value: "change-log" },
  { label: "", value: "divider-1", divider: true },
  { label: "Void", value: "void", danger: true },
];

interface InvoiceData {
  invoiceNumber: string;
  status: string;
  date: string;
  dueDate: string;
  billingType: string;
  subtotal: number;
  tax: number;
  total: number;
  client: {
    firstName: string;
    lastName: string;
    address: string | null;
    ndisNumber: string | null;
    medicare: string | null;
  };
  items: {
    id: string;
    description: string;
    unitPrice: number;
    quantity: number;
    total: number;
  }[];
  practitionerName: string | null;
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function InvoiceDetailClient({ invoice }: { invoice: InvoiceData }) {
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  const outstandingAmount = invoice.status === "Paid" ? 0 : invoice.total;
  const invoiceClientName = `${invoice.client.firstName} ${invoice.client.lastName}`;

  useRegisterCommands([
    { id: `invoice-${invoice.invoiceNumber}-pay`, label: `Record payment for ${invoice.invoiceNumber}`, group: "Actions", onSelect: openPaymentModal },
    { id: `invoice-${invoice.invoiceNumber}-email`, label: `Email invoice ${invoice.invoiceNumber} to ${invoiceClientName}`, group: "Actions", onSelect: handleEmailInvoice },
    { id: `invoice-${invoice.invoiceNumber}-client`, label: `View client: ${invoiceClientName}`, group: "Navigate", onSelect: () => router.push("/clients") },
  ]);

  function openPaymentModal() {
    setPaymentAmount(outstandingAmount.toFixed(2));
    setPaymentDate(getTodayString());
    setPaymentMethod("Card");
    setReferenceNumber("");
    setPaymentNotes("");
    setShowPaymentModal(true);
  }

  function handleApplyPayment() {
    setShowPaymentModal(false);
  }

  function handleEmailInvoice() {
    setShowToast(true);
  }

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div style={{ minHeight: 'calc(100vh - 3rem)' }}>
      {/* Header bar */}
      <Flex align="center" justify="space-between" style={{ borderBottom: '1px solid var(--color-border)', padding: '12px 24px' }}>
        <Flex align="center" gap={12}>
          <Text variant="display/md" as="h1">{invoice.invoiceNumber}</Text>
          <PaymentStatusBadge status={dbStatusToPaymentStatus(invoice.status)} />
        </Flex>
        <Flex align="center" gap={8}>
          <PaymentStatusBadge status="paid" size="lg" />
          <Dropdown
            trigger={
              <Button>
                Pay
                <Icon as={DownOutlined} tone="secondary" />
              </Button>
            }
            items={payItems}
            onSelect={(value) => {
              if (value === "record-payment") {
                openPaymentModal();
              }
              // "send-payment-link" is a no-op
            }}
            align="right"
          />
          <Button onClick={handleEmailInvoice}>
            <Icon as={MailOutlined} tone="secondary" />
            Email invoice
          </Button>
          <Dropdown
            trigger={
              <Button>
                Actions
                <Icon as={DownOutlined} tone="secondary" />
              </Button>
            }
            items={actionsItems}
            onSelect={(_value) => {
              // All actions are no-ops in the prototype
            }}
            align="right"
          />
        </Flex>
      </Flex>

      {/* Invoice document */}
      <div style={{ padding: 32, maxWidth: 896, margin: '0 auto' }}>
        {/* Color bar */}
        <div style={{ height: 8, borderRadius: '8px 8px 0 0', background: 'linear-gradient(to right, var(--color-primary), #22c55e, #facc15)' }} />

        <div style={{ borderRadius: '0 0 8px 8px', border: '1px solid var(--color-border)', borderTop: 'none', background: 'white', padding: 32, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          {/* Title and logo */}
          <Flex align="start" justify="space-between" style={{ marginBottom: 32 }}>
            <Text variant="display/lg" as="h2">
              {invoice.status === "Overdue" ? "Overdue Invoice" : invoice.status === "Paid" ? "Tax Invoice" : "Invoice"}
            </Text>
            <div style={{ fontSize: 36, fontWeight: 700, fontStyle: 'italic', color: 'var(--color-accent)' }}>
              S
            </div>
          </Flex>

          {/* Three column header */}
          <Grid cols={3} gap={32} style={{ marginBottom: 32, fontSize: 12 }}>
            {/* Client */}
            <div>
              <Text variant="body/sm" as="h3" color="text" weight="bold" style={{ marginBottom: 4 }}>Client</Text>
              <Text variant="body/sm" as="p" color="primary">
                {invoice.client.firstName} {invoice.client.lastName}
              </Text>
              {invoice.client.address && <Text variant="body/sm" as="p" color="secondary">{invoice.client.address}</Text>}
              {invoice.client.ndisNumber && (
                <>
                  <Text variant="body/sm" as="p" color="secondary">NDIS Number: {invoice.client.ndisNumber}</Text>
                  <Text variant="body/sm" as="p" color="secondary">Prac No.</Text>
                  <Text variant="body/sm" as="p" color="secondary">Prac No.</Text>
                  <Text variant="body/sm" as="p" color="secondary">Prac No.</Text>
                </>
              )}
              {invoice.client.medicare && <Text variant="body/sm" as="p" color="secondary">Medicare: {invoice.client.medicare}</Text>}
              {invoice.billingType === "NDIS" && (
                <div style={{ marginTop: 12 }}>
                  <Text variant="body/sm" as="h4" color="text" weight="bold">Care of client above</Text>
                  <Text variant="body/sm" as="p" color="primary">C/o [Client above]</Text>
                  <Text variant="body/sm" as="p" color="secondary">161 Bay St.</Text>
                  <Text variant="body/sm" as="p" color="secondary">Toronto ON M5J 1C4</Text>
                </div>
              )}
            </div>

            {/* From */}
            <div>
              <Text variant="body/sm" as="h3" color="text" weight="bold" style={{ marginBottom: 4 }}>From</Text>
              <Text variant="body/sm" as="p" color="text">Hands Together Therapies</Text>
              <Text variant="body/sm" as="p" color="secondary">East Clinics</Text>
              <Text variant="body/sm" as="p" color="secondary">4 Williamstown Rd</Text>
              <Text variant="body/sm" as="p" color="secondary">Kingsville VIC 3012</Text>
              <div style={{ marginTop: 8 }}>
                <Text variant="body/sm" as="p" color="text" weight="bold">ABN</Text>
                <Text variant="body/sm" as="p" color="secondary">112345678110</Text>
              </div>
              {invoice.practitionerName && (
                <div style={{ marginTop: 8 }}>
                  <Text variant="body/sm" as="p" color="text" weight="bold">Provider</Text>
                  <Text variant="body/sm" as="p" color="secondary">{invoice.practitionerName}</Text>
                </div>
              )}
            </div>

            {/* Invoice details */}
            <div>
              <Flex vertical gap={8}>
                <div>
                  <Text variant="body/sm" as="p" color="text" weight="bold">Invoice #</Text>
                  <Text variant="body/sm" as="p" color="secondary">{invoice.invoiceNumber}</Text>
                </div>
                <div>
                  <Text variant="body/sm" as="p" color="text" weight="bold">Issue date</Text>
                  <Text variant="body/sm" as="p" color="secondary">{formatDate(invoice.date)}</Text>
                </div>
                <div>
                  <Text variant="body/sm" as="p" color="text" weight="bold">Due date</Text>
                  <Text variant="body/sm" as="p" color="secondary">{formatDate(invoice.dueDate)}</Text>
                </div>
              </Flex>
            </div>
          </Grid>

          {/* Line items table */}
          <table style={{ width: '100%', fontSize: 12, marginBottom: 24 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '8px 0', textAlign: 'left' }}><Text variant="label/md" as="span" color="text">Item code</Text></th>
                <th style={{ padding: '8px 0', textAlign: 'left' }}><Text variant="label/md" as="span" color="text">Description</Text></th>
                <th style={{ padding: '8px 0', textAlign: 'right' }}><Text variant="label/md" as="span" color="text">Unit price</Text></th>
                <th style={{ padding: '8px 0', textAlign: 'right' }}><Text variant="label/md" as="span" color="text">Quantity</Text></th>
                <th style={{ padding: '8px 0', textAlign: 'right' }}><Text variant="label/md" as="span" color="text">Unit</Text></th>
                <th style={{ padding: '8px 0', textAlign: 'right' }}><Text variant="label/md" as="span" color="text">Discount</Text></th>
                <th style={{ padding: '8px 0', textAlign: 'right' }}><Text variant="label/md" as="span" color="text">GST</Text></th>
                <th style={{ padding: '8px 0', textAlign: 'right' }}><Text variant="label/md" as="span" color="text">Amount AUD</Text></th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px 0' }}><Text variant="body/sm" as="span" color="secondary">{`299dsdds${3234 + idx}`}</Text></td>
                  <td style={{ padding: '12px 0' }}><Text variant="body/sm" as="span" color="text">{item.description}</Text></td>
                  <td style={{ padding: '12px 0', textAlign: 'right' }}><Text variant="body/sm" as="span" color="text">{item.unitPrice.toFixed(2)}</Text></td>
                  <td style={{ padding: '12px 0', textAlign: 'right' }}><Text variant="body/sm" as="span" color="text">{item.quantity.toFixed(2)}</Text></td>
                  <td style={{ padding: '12px 0', textAlign: 'right' }}><Text variant="body/sm" as="span" color="secondary">Hour</Text></td>
                  <td style={{ padding: '12px 0', textAlign: 'right' }}><Text variant="body/sm" as="span" color="secondary">0.00</Text></td>
                  <td style={{ padding: '12px 0', textAlign: 'right' }}><Text variant="body/sm" as="span" color="secondary">15%</Text></td>
                  <td style={{ padding: '12px 0', textAlign: 'right' }}><Text variant="label/md" as="span" color="text">{item.total.toFixed(2)}</Text></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <Flex justify="end" style={{ marginBottom: 32 }}>
            <Flex vertical gap={4} style={{ width: 256, fontSize: 12 }}>
              <Flex justify="space-between">
                <Text variant="body/sm" as="span" color="secondary">Subtotal excl. tax</Text>
                <Text variant="body/sm" as="span" color="text">{invoice.subtotal.toFixed(2)}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text variant="body/sm" as="span" color="secondary">Tax</Text>
                <Text variant="body/sm" as="span" color="text">{invoice.tax.toFixed(2)}</Text>
              </Flex>
              <Divider spacing="none" />
              <Flex justify="space-between" style={{ paddingTop: 4 }}>
                <Text variant="body/sm" as="span" color="text" weight="bold">Total AUD</Text>
                <Text variant="body/sm" as="span" color="text" weight="bold">{invoice.total.toFixed(2)}</Text>
              </Flex>
              <Flex justify="space-between" style={{ borderRadius: 4, background: '#f9fafb', padding: '4px 8px' }}>
                <Text variant="body/sm" as="span" color="text" weight="bold">Total Amount Due AUD</Text>
                <Text variant="body/sm" as="span" color="text" weight="bold">{invoice.status === "Paid" ? "0.00" : invoice.total.toFixed(2)}</Text>
              </Flex>
            </Flex>
          </Flex>

          {/* Additional information */}
          <Divider spacing="none" />
          <div style={{ paddingTop: 16, fontSize: 12 }}>
            <Text variant="body/sm" as="h4" color="text" weight="bold" style={{ marginBottom: 8 }}>Additional Information</Text>
            <Text variant="body/sm" as="p" color="secondary">Please note that the service dates are displayed at the beginning of each line item.</Text>
            <div style={{ marginTop: 16 }}>
              <Text variant="body/sm" as="p" color="secondary">aA Direct deposit details:</Text>
              <div style={{ marginTop: 8 }}>
                <Text variant="body/sm" as="p" color="secondary">Please pay to:</Text>
                <Text variant="body/sm" as="p" color="secondary">Name: Hands together therapy</Text>
                <Text variant="body/sm" as="p" color="secondary">Acc: 901802703</Text>
                <Text variant="body/sm" as="p" color="secondary">BSB: 505-500</Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title={`Add payment to ${invoice.invoiceNumber}`}
        footer={
          <>
            <Button onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleApplyPayment}>
              Apply payment
            </Button>
          </>
        }
      >
        <Flex vertical gap={16}>
          {/* Amount */}
          <div>
            <Text variant="label/lg" as="label" style={{ display: 'block', marginBottom: 4 }}>Amount</Text>
            <div style={{ position: 'relative' }}>
              <Text variant="body/sm" as="span" color="secondary" style={{ position: 'absolute', top: '50%', left: 12, zIndex: 10, transform: 'translateY(-50%)' }}>$</Text>
              <FormInput
                type="text"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                style={{ paddingLeft: 28 }}
              />
            </div>
          </div>

          {/* Payment date */}
          <FormInput
            label="Payment date"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />

          {/* Payment method */}
          <FormSelect
            label="Payment method"
            value={paymentMethod}
            onChange={setPaymentMethod}
            options={[
              { value: "Credit Card", label: "Credit Card" },
              { value: "Bank Transfer", label: "Bank Transfer" },
              { value: "Cash", label: "Cash" },
              { value: "EFTPOS", label: "EFTPOS" },
              { value: "NDIS", label: "NDIS" },
              { value: "Medicare", label: "Medicare" },
            ]}
          />

          {/* Reference number */}
          <FormInput
            label="Reference number"
            type="text"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="Optional"
          />

          {/* Notes */}
          <FormTextarea
            label="Notes"
            value={paymentNotes}
            onChange={(e) => setPaymentNotes(e.target.value)}
            rows={3}
            placeholder="Optional"
            style={{ resize: 'none' }}
          />

          {/* Receipt preview */}
          {paymentAmount && (
            <div style={{ padding: 16, borderRadius: 8, border: '1px dashed #d1d5db', background: '#f9fafb' }}>
              <Text variant="label/lg" as="p" color="secondary" style={{ marginBottom: 12 }}>Receipt preview</Text>
              <div>
                <Flex align="center" justify="space-between">
                  <Text variant="label/lg" as="span" color="text">Receipt #REC-001</Text>
                  <Text variant="label/md" as="span" color="secondary">{paymentDate ? new Date(paymentDate + "T00:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }) : "\u2014"}</Text>
                </Flex>
                <Divider spacing="none" style={{ margin: '8px 0', borderColor: '#e5e7eb' }} />
                <div style={{ paddingTop: 0 }}>
                  <Flex justify="space-between">
                    <Text variant="body/md" as="span" color="secondary">Invoice</Text>
                    <Text variant="body/md" as="span" color="text">{invoice.invoiceNumber}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text variant="body/md" as="span" color="secondary">Client</Text>
                    <Text variant="body/md" as="span" color="text">{invoice.client.firstName} {invoice.client.lastName}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text variant="body/md" as="span" color="secondary">Method</Text>
                    <Text variant="body/md" as="span" color="text">{paymentMethod}</Text>
                  </Flex>
                  {referenceNumber && (
                    <Flex justify="space-between">
                      <Text variant="body/md" as="span" color="secondary">Reference</Text>
                      <Text variant="body/md" as="span" color="text">{referenceNumber}</Text>
                    </Flex>
                  )}
                </div>
                <Divider spacing="none" style={{ margin: '8px 0', borderColor: '#e5e7eb' }} />
                <Flex justify="space-between" style={{ paddingTop: 0 }}>
                  <Text variant="label/lg" as="span" color="text">Amount paid</Text>
                  <Text variant="label/lg" as="span" color="text">${paymentAmount}</Text>
                </Flex>
              </div>
            </div>
          )}
        </Flex>
      </Modal>

      {/* Toast notification */}
      {showToast && (
        <div style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 50, borderRadius: 8, background: '#111827', padding: '12px 16px', fontSize: 12, color: 'white', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}>
          Invoice email sent
        </div>
      )}
    </div>
  );
}
