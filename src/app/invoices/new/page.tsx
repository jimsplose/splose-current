"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import {
  Button,
  Card,
  FormInput,
  FormSelect,
  FormTextarea,
  Navbar,
  Select,
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
    <div className="min-h-[calc(100vh-3rem)]">
      <Navbar backHref="/invoices" title="New invoice">
        <Button variant="secondary" onClick={() => router.push("/invoices")}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => router.push("/invoices")}>
          Save
        </Button>
      </Navbar>

      <div className="mx-auto max-w-5xl space-y-6 p-6">
        {/* Client section */}
        <Card title="Client" headerBar>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
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
              onChange={(e) => setContact(e.target.value)}
              options={mockContacts}
            />
          </div>
        </Card>

        {/* Invoice details */}
        <Card title="Invoice details" headerBar>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FormInput
              label="Invoice number"
              value={invoiceNumber}
              readOnly
              className="bg-gray-50 text-text-secondary"
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
              onChange={(e) => setLocation(e.target.value)}
              options={mockLocations}
            />
          </div>
        </Card>

        {/* Line items */}
        <Card title="Line items" headerBar padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-body-md">
              <thead>
                <tr className="border-b border-border bg-gray-50 text-left text-label-lg text-text-secondary">
                  <th className="px-4 py-2.5">Service</th>
                  <th className="px-4 py-2.5">Description</th>
                  <th className="w-20 px-4 py-2.5">Qty</th>
                  <th className="w-28 px-4 py-2.5">Unit Price</th>
                  <th className="w-32 px-4 py-2.5">Tax</th>
                  <th className="w-28 px-4 py-2.5 text-right">Total</th>
                  <th className="w-10 px-2 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <tr key={item.id} className="border-b border-border">
                    <td className="px-3 py-2">
                      <FormSelect
                        value={item.service}
                        onChange={(e) => updateLineItem(item.id, "service", e.target.value)}
                        options={mockServices}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <FormInput
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                        placeholder="Description"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <FormInput
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => updateLineItem(item.id, "qty", e.target.value)}
                        className="text-right"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <FormInput
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateLineItem(item.id, "unitPrice", e.target.value)}
                        placeholder="0.00"
                        className="text-right"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <FormSelect
                        value={item.tax}
                        onChange={(e) => updateLineItem(item.id, "tax", e.target.value)}
                        options={mockTaxOptions}
                      />
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-text">
                      ${calculateLineTotal(item).toFixed(2)}
                    </td>
                    <td className="px-2 py-2">
                      {lineItems.length > 1 && (
                        <Button
                          variant="icon"
                          size="sm"
                          onClick={() => removeLineItem(item.id)}
                          className="hover:text-danger"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3">
            <Button variant="ghost" size="sm" onClick={addLineItem}>
              <Plus className="h-4 w-4" />
              Add line item
            </Button>
          </div>
        </Card>

        {/* Totals */}
        <Card padding="md">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex items-center justify-between text-body-md">
                <span className="text-text-secondary">Subtotal</span>
                <span className="font-medium text-text">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-body-md">
                <span className="text-text-secondary">Tax</span>
                <span className="font-medium text-text">${totalTax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2 text-heading-sm">
                <span className="text-text">Total</span>
                <span className="text-text">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Additional info */}
        <Card title="Additional information" headerBar>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              onChange={(e) => setPaymentTerms(e.target.value)}
              options={paymentTermsOptions}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
