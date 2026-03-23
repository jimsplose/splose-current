"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Dropdown, FormInput, FormSelect, FormTextarea, Badge, statusVariant } from "@/components/ds";
import type { DropdownItem } from "@/components/ds";
import Modal from "@/components/ds/Modal";
import { ChevronDown, Mail } from "lucide-react";

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
    <div className="min-h-[calc(100vh-3rem)]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-display-md text-text">{invoice.invoiceNumber}</h1>
          <Badge variant={statusVariant(invoice.status)}>{invoice.status}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="green" className="rounded-lg px-3 py-1.5 text-label-lg">
            Credit balance: ${invoice.status === "Paid" ? "0.00" : "680.00"}
          </Badge>
          <Dropdown
            trigger={
              <Button variant="secondary">
                Pay
                <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
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
            <Mail className="h-4 w-4 text-text-secondary" />
            Email invoice
          </Button>
          <Dropdown
            trigger={
              <Button variant="secondary">
                Actions
                <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
              </Button>
            }
            items={actionsItems}
            onSelect={(_value) => {
              // All actions are no-ops in the prototype
            }}
            align="right"
          />
        </div>
      </div>

      {/* Invoice document */}
      <div className="mx-auto max-w-4xl p-8">
        {/* Color bar */}
        <div className="h-2 rounded-t-lg bg-gradient-to-r from-primary via-green-500 to-yellow-400" />

        <div className="rounded-b-lg border border-border bg-white p-8 shadow-sm">
          {/* Title and logo */}
          <div className="mb-8 flex items-start justify-between">
            <h2 className="text-display-lg text-text">
              {invoice.status === "Overdue" ? "Overdue Invoice" : invoice.status === "Paid" ? "Tax Invoice" : "Invoice"}
            </h2>
            <div className="text-4xl font-bold italic" style={{ color: "#2d6d40" }}>
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
              {invoice.client.address && <p className="text-text-secondary">{invoice.client.address}</p>}
              {invoice.client.ndisNumber && (
                <>
                  <p className="text-text-secondary">NDIS Number: {invoice.client.ndisNumber}</p>
                  <p className="text-text-secondary">Prac No.</p>
                  <p className="text-text-secondary">Prac No.</p>
                  <p className="text-text-secondary">Prac No.</p>
                </>
              )}
              {invoice.client.medicare && <p className="text-text-secondary">Medicare: {invoice.client.medicare}</p>}
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
              <h3 className="mb-1 font-bold text-text">From</h3>
              <p className="text-text">Hands Together Therapies</p>
              <p className="text-text-secondary">East Clinics</p>
              <p className="text-text-secondary">4 Williamstown Rd</p>
              <p className="text-text-secondary">Kingsville VIC 3012</p>
              <div className="mt-2">
                <p className="font-bold text-text">ABN</p>
                <p className="text-text-secondary">112345678110</p>
              </div>
              {invoice.practitionerName && (
                <div className="mt-2">
                  <p className="font-bold text-text">Provider</p>
                  <p className="text-text-secondary">{invoice.practitionerName}</p>
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
          <table className="mb-6 w-full text-sm">
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
                  <td className="py-3 text-right font-medium text-text">{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mb-8 flex justify-end">
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
              <div className="flex justify-between rounded bg-gray-50 px-2 py-1 font-bold">
                <span className="text-text">Total Amount Due AUD</span>
                <span className="text-text">{invoice.status === "Paid" ? "0.00" : invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Additional information */}
          <div className="border-t border-border pt-4 text-sm text-text-secondary">
            <h4 className="mb-2 font-bold text-text">Additional Information</h4>
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
        <div className="space-y-4">
          {/* Amount */}
          <div>
            <label className="mb-1 block text-label-lg text-text">Amount</label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-sm text-text-secondary">$</span>
              <FormInput
                type="text"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="pl-7"
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
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={[
              { value: "Cash", label: "Cash" },
              { value: "Card", label: "Card" },
              { value: "Bank Transfer", label: "Bank Transfer" },
              { value: "Medicare", label: "Medicare" },
              { value: "NDIS", label: "NDIS" },
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
            className="resize-none"
          />
        </div>
      </Modal>

      {/* Toast notification */}
      {showToast && (
        <div className="animate-in fade-in slide-in-from-bottom-2 fixed right-6 bottom-6 z-50 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-lg">
          Invoice email sent
        </div>
      )}
    </div>
  );
}
