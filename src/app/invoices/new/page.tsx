"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import {
  Button,
  Card,
  FormInput,
  FormPage,
  FormSelect,
  FormTextarea,
} from "@/components/ds";

const mockClients = [
  { value: "michael-brooks", label: "Michael Brooks" },
  { value: "lisa-martinez", label: "Lisa Martinez" },
  { value: "tom-nguyen", label: "Tom Nguyen" },
  { value: "sophie-anderson", label: "Sophie Anderson" },
  { value: "david-park", label: "David Park" },
  { value: "jenny-jenkins", label: "Jenny Jenkins" },
  { value: "harry-james", label: "Harry James" },
  { value: "ella-thompson", label: "Ella Thompson" },
  { value: "oliver-wilson", label: "Oliver Wilson" },
  { value: "charlotte-brown", label: "Charlotte Brown" },
  { value: "raj-kapoor", label: "Raj Kapoor" },
  { value: "fiona-mcallister", label: "Fiona McAllister" },
];

const mockContacts = [
  { value: "", label: "Select contact" },
  { value: "self", label: "Self" },
  { value: "parent", label: "Parent/Guardian" },
  { value: "employer", label: "Employer" },
];

const mockLocations = [
  { value: "", label: "Select location" },
  { value: "east-clinics", label: "East Clinics" },
  { value: "west-clinics", label: "West Clinics" },
  { value: "north-clinics", label: "North Clinics" },
];

const mockServices = [
  { value: "", label: "Select service" },
  { value: "initial-consult", label: "Initial Consultation" },
  { value: "standard-consult", label: "Standard Consultation" },
  { value: "review", label: "Review Appointment" },
  { value: "group-session", label: "Group Session" },
  { value: "telehealth", label: "Telehealth Consultation" },
  { value: "report-writing", label: "Report Writing" },
  { value: "ndis-assessment", label: "NDIS Assessment" },
];

const mockTaxOptions = [
  { value: "gst-free", label: "GST Free" },
  { value: "gst", label: "GST (10%)" },
];

const paymentTermsOptions = [
  { value: "", label: "Select payment terms" },
  { value: "due-on-receipt", label: "Due on receipt" },
  { value: "net-7", label: "Net 7 days" },
  { value: "net-14", label: "Net 14 days" },
  { value: "net-30", label: "Net 30 days" },
];

interface LineItem {
  id: number;
  service: string;
  description: string;
  qty: string;
  unitPrice: string;
  tax: string;
}

function getDefaultDate(): string {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function getDueDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().split("T")[0];
}

let nextId = 2;

export default function NewInvoicePage() {
  const router = useRouter();

  const [client, setClient] = useState("");
  const [contact, setContact] = useState("");
  const [invoiceNumber] = useState("INV-00026");
  const [invoiceDate, setInvoiceDate] = useState(getDefaultDate());
  const [dueDate, setDueDate] = useState(getDueDate());
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 1, service: "", description: "", qty: "1", unitPrice: "", tax: "gst-free" },
  ]);

  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      { id: nextId++, service: "", description: "", qty: "1", unitPrice: "", tax: "gst-free" },
    ]);
  };

  const removeLineItem = (id: number) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateLineItem = (id: number, field: keyof LineItem, value: string) => {
    setLineItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const calculateLineTotal = (item: LineItem): number => {
    const qty = parseFloat(item.qty) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    const subtotal = qty * price;
    if (item.tax === "gst") return subtotal * 1.1;
    return subtotal;
  };

  const calculateLineTax = (item: LineItem): number => {
    const qty = parseFloat(item.qty) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    const subtotal = qty * price;
    if (item.tax === "gst") return subtotal * 0.1;
    return 0;
  };

  const subtotal = lineItems.reduce((sum, item) => {
    const qty = parseFloat(item.qty) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    return sum + qty * price;
  }, 0);

  const totalTax = lineItems.reduce((sum, item) => sum + calculateLineTax(item), 0);
  const total = subtotal + totalTax;

  return (
    <FormPage
      title="New invoice"
      backHref="/invoices"
      actions={
        <>
          <Button variant="secondary" onClick={() => router.push("/invoices")}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => router.push("/invoices")}>
            Save
          </Button>
        </>
      }
    >
      <Flex vertical gap={24}>
          {/* Client section */}
          <Card title="Client" headerBar>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              <FormSelect
                label="Client name"
                options={mockClients}
                value={client}
                onChange={setClient}
                placeholder="Select client"
                searchable
              />
              <FormSelect
                label="Contact"
                value={contact}
                onChange={setContact}
                options={mockContacts}
              />
            </div>
          </Card>

          {/* Invoice details */}
          <Card title="Invoice details" headerBar>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              <FormInput
                label="Invoice number"
                value={invoiceNumber}
                readOnly
                className="text-text-secondary"
                style={{ background: '#f9fafb' }}
              />
              <FormInput
                label="Date"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
              <FormInput
                label="Due date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <FormSelect
                label="Location"
                value={location}
                onChange={setLocation}
                options={mockLocations}
              />
            </div>
          </Card>

          {/* Line items */}
          <Card title="Line items" headerBar padding="none">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%' }} className="text-body-md">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', background: '#f9fafb', textAlign: 'left' }} className="text-label-lg text-text-secondary">
                    <th style={{ padding: '10px 16px' }}>Service</th>
                    <th style={{ padding: '10px 16px' }}>Description</th>
                    <th style={{ padding: '10px 16px', width: 80 }}>Qty</th>
                    <th style={{ padding: '10px 16px', width: 112 }}>Unit Price</th>
                    <th style={{ padding: '10px 16px', width: 128 }}>Tax</th>
                    <th style={{ padding: '10px 16px', width: 112, textAlign: 'right' }}>Total</th>
                    <th style={{ padding: '10px 8px', width: 40 }} />
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '8px 12px' }}>
                        <FormSelect
                          value={item.service}
                          onChange={(value) => updateLineItem(item.id, "service", value)}
                          options={mockServices}
                        />
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <FormInput
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                          placeholder="Description"
                        />
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <FormInput
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateLineItem(item.id, "qty", e.target.value)}
                          style={{ textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <FormInput
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(item.id, "unitPrice", e.target.value)}
                          placeholder="0.00"
                          style={{ textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <FormSelect
                          value={item.tax}
                          onChange={(value) => updateLineItem(item.id, "tax", value)}
                          options={mockTaxOptions}
                        />
                      </td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 500, color: 'var(--color-text)' }}>
                        ${calculateLineTotal(item).toFixed(2)}
                      </td>
                      <td style={{ padding: '8px 8px' }}>
                        {lineItems.length > 1 && (
                          <Button
                            variant="icon"
                            size="sm"
                            onClick={() => removeLineItem(item.id)}
                          >
                            <DeleteOutlined style={{ fontSize: 16 }} />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <Button variant="ghost" size="sm" onClick={addLineItem}>
                <PlusOutlined style={{ fontSize: 16 }} />
                Add line item
              </Button>
            </div>
          </Card>

          {/* Totals */}
          <Card padding="md">
            <Flex justify="end">
              <Flex vertical gap={8} style={{ width: 256 }}>
                <Flex align="center" justify="space-between" className="text-body-md">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
                  <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>${subtotal.toFixed(2)}</span>
                </Flex>
                <Flex align="center" justify="space-between" className="text-body-md">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Tax</span>
                  <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>${totalTax.toFixed(2)}</span>
                </Flex>
                <Flex align="center" justify="space-between" className="text-heading-sm" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 8 }}>
                  <span style={{ color: 'var(--color-text)' }}>Total</span>
                  <span style={{ color: 'var(--color-text)' }}>${total.toFixed(2)}</span>
                </Flex>
              </Flex>
            </Flex>
          </Card>

          {/* Additional info */}
          <Card title="Additional information" headerBar>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              <FormTextarea
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes for this invoice..."
                rows={4}
              />
              <FormSelect
                label="Payment terms"
                value={paymentTerms}
                onChange={setPaymentTerms}
                options={paymentTermsOptions}
              />
            </div>
          </Card>
        </Flex>
    </FormPage>
  );
}
