"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DownOutlined, MailOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { Button, Dropdown, FormInput, FormSelect, FormTextarea, Badge, statusVariant } from "@/components/ds";
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
          <h1 className="text-display-md text-text">{invoice.invoiceNumber}</h1>
          <Badge variant={statusVariant(invoice.status)}>{invoice.status}</Badge>
        </Flex>
        <Flex align="center" gap={8}>
          <Badge variant="green" className="text-label-lg" style={{ borderRadius: 8, padding: '6px 12px' }}>
            Credit balance: ${invoice.status === "Paid" ? "0.00" : "680.00"}
          </Badge>
          <Dropdown
            trigger={
              <Button variant="secondary">
                Pay
                <DownOutlined style={{ fontSize: 14, color: 'var(--color-text-secondary)' }} />
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
          <Button variant="secondary" onClick={handleEmailInvoice}>
            <MailOutlined style={{ fontSize: 16, color: 'var(--color-text-secondary)' }} />
            Email invoice
          </Button>
          <Dropdown
            trigger={
              <Button variant="secondary">
                Actions
                <DownOutlined style={{ fontSize: 14, color: 'var(--color-text-secondary)' }} />
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
      <div style={{ maxWidth: 896, margin: '0 auto', padding: 32 }}>
        {/* Color bar */}
        <div style={{ height: 8, borderRadius: '8px 8px 0 0', background: 'linear-gradient(to right, var(--color-primary), #22c55e, #facc15)' }} />

        <div style={{ borderRadius: '0 0 8px 8px', border: '1px solid var(--color-border)', borderTop: 'none', background: 'white', padding: 32, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          {/* Title and logo */}
          <Flex align="start" justify="space-between" style={{ marginBottom: 32 }}>
            <h2 className="text-display-lg">
              {invoice.status === "Overdue" ? "Overdue Invoice" : invoice.status === "Paid" ? "Tax Invoice" : "Invoice"}
            </h2>
            <div style={{ fontSize: 36, fontWeight: 700, fontStyle: 'italic', color: 'var(--color-accent)' }}>
              S
            </div>
          </Flex>

          {/* Three column header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginBottom: 32, fontSize: 12 }}>
            {/* Client */}
            <div>
              <h3 style={{ marginBottom: 4, fontWeight: 700, color: 'var(--color-text)' }}>Client</h3>
              <p className="text-primary">
                {invoice.client.firstName} {invoice.client.lastName}
              </p>
              {invoice.client.address && <p style={{ color: 'var(--color-text-secondary)' }}>{invoice.client.address}</p>}
              {invoice.client.ndisNumber && (
                <>
                  <p style={{ color: 'var(--color-text-secondary)' }}>NDIS Number: {invoice.client.ndisNumber}</p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>Prac No.</p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>Prac No.</p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>Prac No.</p>
                </>
              )}
              {invoice.client.medicare && <p style={{ color: 'var(--color-text-secondary)' }}>Medicare: {invoice.client.medicare}</p>}
              {invoice.billingType === "NDIS" && (
                <div style={{ marginTop: 12 }}>
                  <h4 style={{ fontWeight: 700, color: 'var(--color-text)' }}>Care of client above</h4>
                  <p className="text-primary">C/o [Client above]</p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>161 Bay St.</p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>Toronto ON M5J 1C4</p>
                </div>
              )}
            </div>

            {/* From */}
            <div>
              <h3 style={{ marginBottom: 4, fontWeight: 700, color: 'var(--color-text)' }}>From</h3>
              <p style={{ color: 'var(--color-text)' }}>Hands Together Therapies</p>
              <p style={{ color: 'var(--color-text-secondary)' }}>East Clinics</p>
              <p style={{ color: 'var(--color-text-secondary)' }}>4 Williamstown Rd</p>
              <p style={{ color: 'var(--color-text-secondary)' }}>Kingsville VIC 3012</p>
              <div style={{ marginTop: 8 }}>
                <p style={{ fontWeight: 700, color: 'var(--color-text)' }}>ABN</p>
                <p style={{ color: 'var(--color-text-secondary)' }}>112345678110</p>
              </div>
              {invoice.practitionerName && (
                <div style={{ marginTop: 8 }}>
                  <p style={{ fontWeight: 700, color: 'var(--color-text)' }}>Provider</p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{invoice.practitionerName}</p>
                </div>
              )}
            </div>

            {/* Invoice details */}
            <div>
              <Flex vertical gap={8}>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--color-text)' }}>Invoice #</p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{invoice.invoiceNumber}</p>
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--color-text)' }}>Issue date</p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{formatDate(invoice.date)}</p>
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--color-text)' }}>Due date</p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{formatDate(invoice.dueDate)}</p>
                </div>
              </Flex>
            </div>
          </div>

          {/* Line items table */}
          <table style={{ width: '100%', fontSize: 12, marginBottom: 24 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '8px 0', textAlign: 'left', fontWeight: 500, color: 'var(--color-text)' }}>Item code</th>
                <th style={{ padding: '8px 0', textAlign: 'left', fontWeight: 500, color: 'var(--color-text)' }}>Description</th>
                <th style={{ padding: '8px 0', textAlign: 'right', fontWeight: 500, color: 'var(--color-text)' }}>Unit price</th>
                <th style={{ padding: '8px 0', textAlign: 'right', fontWeight: 500, color: 'var(--color-text)' }}>Quantity</th>
                <th style={{ padding: '8px 0', textAlign: 'right', fontWeight: 500, color: 'var(--color-text)' }}>Unit</th>
                <th style={{ padding: '8px 0', textAlign: 'right', fontWeight: 500, color: 'var(--color-text)' }}>Discount</th>
                <th style={{ padding: '8px 0', textAlign: 'right', fontWeight: 500, color: 'var(--color-text)' }}>GST</th>
                <th style={{ padding: '8px 0', textAlign: 'right', fontWeight: 500, color: 'var(--color-text)' }}>Amount AUD</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px 0', color: 'var(--color-text-secondary)' }}>{`299dsdds${3234 + idx}`}</td>
                  <td style={{ padding: '12px 0', color: 'var(--color-text)' }}>{item.description}</td>
                  <td style={{ padding: '12px 0', textAlign: 'right', color: 'var(--color-text)' }}>{item.unitPrice.toFixed(2)}</td>
                  <td style={{ padding: '12px 0', textAlign: 'right', color: 'var(--color-text)' }}>{item.quantity.toFixed(2)}</td>
                  <td style={{ padding: '12px 0', textAlign: 'right', color: 'var(--color-text-secondary)' }}>Hour</td>
                  <td style={{ padding: '12px 0', textAlign: 'right', color: 'var(--color-text-secondary)' }}>0.00</td>
                  <td style={{ padding: '12px 0', textAlign: 'right', color: 'var(--color-text-secondary)' }}>15%</td>
                  <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 500, color: 'var(--color-text)' }}>{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <Flex justify="end" style={{ marginBottom: 32 }}>
            <Flex vertical gap={4} style={{ width: 256, fontSize: 12 }}>
              <Flex justify="space-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal excl. tax</span>
                <span style={{ color: 'var(--color-text)' }}>{invoice.subtotal.toFixed(2)}</span>
              </Flex>
              <Flex justify="space-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Tax</span>
                <span style={{ color: 'var(--color-text)' }}>{invoice.tax.toFixed(2)}</span>
              </Flex>
              <Flex justify="space-between" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 4 }}>
                <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>Total AUD</span>
                <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>{invoice.total.toFixed(2)}</span>
              </Flex>
              <Flex justify="space-between" style={{ borderRadius: 4, background: '#f9fafb', padding: '4px 8px', fontWeight: 700 }}>
                <span style={{ color: 'var(--color-text)' }}>Total Amount Due AUD</span>
                <span style={{ color: 'var(--color-text)' }}>{invoice.status === "Paid" ? "0.00" : invoice.total.toFixed(2)}</span>
              </Flex>
            </Flex>
          </Flex>

          {/* Additional information */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16, fontSize: 12, color: 'var(--color-text-secondary)' }}>
            <h4 style={{ marginBottom: 8, fontWeight: 700, color: 'var(--color-text)' }}>Additional Information</h4>
            <p>Please note that the service dates are displayed at the beginning of each line item.</p>
            <div style={{ marginTop: 16 }}>
              <p>aA Direct deposit details:</p>
              <div style={{ marginTop: 8 }}>
                <p>Please pay to:</p>
                <p>Name: Hands together therapy</p>
                <p>Acc: 901802703</p>
                <p>BSB: 505-500</p>
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
            <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApplyPayment}>
              Apply payment
            </Button>
          </>
        }
      >
        <Flex vertical gap={16}>
          {/* Amount */}
          <div>
            <label className="text-label-lg text-text" style={{ display: 'block', marginBottom: 4 }}>Amount</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '50%', left: 12, zIndex: 10, transform: 'translateY(-50%)', fontSize: 12, color: 'var(--color-text-secondary)' }}>$</span>
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
            <div style={{ borderRadius: 8, border: '1px dashed #d1d5db', background: '#f9fafb', padding: 16 }}>
              <p className="text-label-lg" style={{ marginBottom: 12, color: 'var(--color-text-secondary)' }}>Receipt preview</p>
              <div className="text-body-md">
                <Flex align="center" justify="space-between">
                  <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>Receipt #REC-001</span>
                  <span className="text-label-md" style={{ color: 'var(--color-text-secondary)' }}>{paymentDate ? new Date(paymentDate + "T00:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }) : "\u2014"}</span>
                </Flex>
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 8, marginTop: 8 }}>
                  <Flex justify="space-between">
                    <span style={{ color: 'var(--color-text-secondary)' }}>Invoice</span>
                    <span style={{ color: 'var(--color-text)' }}>{invoice.invoiceNumber}</span>
                  </Flex>
                  <Flex justify="space-between">
                    <span style={{ color: 'var(--color-text-secondary)' }}>Client</span>
                    <span style={{ color: 'var(--color-text)' }}>{invoice.client.firstName} {invoice.client.lastName}</span>
                  </Flex>
                  <Flex justify="space-between">
                    <span style={{ color: 'var(--color-text-secondary)' }}>Method</span>
                    <span style={{ color: 'var(--color-text)' }}>{paymentMethod}</span>
                  </Flex>
                  {referenceNumber && (
                    <Flex justify="space-between">
                      <span style={{ color: 'var(--color-text-secondary)' }}>Reference</span>
                      <span style={{ color: 'var(--color-text)' }}>{referenceNumber}</span>
                    </Flex>
                  )}
                </div>
                <Flex justify="space-between" style={{ borderTop: '1px solid #e5e7eb', paddingTop: 8, marginTop: 8, fontWeight: 500 }}>
                  <span style={{ color: 'var(--color-text)' }}>Amount paid</span>
                  <span style={{ color: 'var(--color-text)' }}>${paymentAmount}</span>
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
