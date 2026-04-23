"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import Icon from "@/components/ds/Icon";
import { Button, Flex } from "antd";
import { DataTable, FormInput, FormPage, FormSelect, FormTextarea, Grid, TableBody, TableHead, Td, Text, Th, Tr } from "@/components/ds";

const mockPatients = [
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

const mockInvoiceTo = [
  { value: "", label: "Select..." },
  { value: "self", label: "Self" },
  { value: "parent", label: "Parent/Guardian" },
  { value: "employer", label: "Employer" },
  { value: "ndis", label: "NDIS" },
];

const mockLocations = [
  { value: "", label: "Select location" },
  { value: "east-clinics", label: "East Clinics" },
  { value: "west-clinics", label: "West Clinics" },
  { value: "north-clinics", label: "North Clinics" },
];

const mockPractitioners = [
  { value: "", label: "Select practitioner" },
  { value: "dr-sarah-chen", label: "Dr Sarah Chen" },
  { value: "dr-james-wilson", label: "Dr James Wilson" },
  { value: "emma-davis", label: "Emma Davis" },
];

const mockTypeOptions = [
  { value: "service", label: "Service" },
  { value: "product", label: "Product" },
  { value: "travel", label: "Travel" },
];

const mockTaxRateOptions = [
  { value: "gst-free", label: "GST Free (0%)" },
  { value: "gst", label: "GST (10%)" },
];

const mockUnitOptions = [
  { value: "each", label: "Each" },
  { value: "hour", label: "Hour" },
  { value: "session", label: "Session" },
  { value: "km", label: "Km" },
];

interface LineItem {
  id: number;
  type: string;
  description: string;
  code: string;
  unit: string;
  taxRate: string;
  price: string;
  qty: string;
  discount: string;
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

  const [patient, setPatient] = useState("michael-brooks");
  const [invoiceTo, setInvoiceTo] = useState("");
  const [invoiceNumber] = useState("INV-00026");
  const [reference, setReference] = useState("");
  const [issueDate, setIssueDate] = useState(getDefaultDate());
  const [dueDate, setDueDate] = useState(getDueDate());
  const [extraDetails, setExtraDetails] = useState("");
  const [location, setLocation] = useState("");
  const [practitioner, setPractitioner] = useState("");
  const [providerNumbers, setProviderNumbers] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 1, type: "service", description: "", code: "", unit: "each", taxRate: "gst-free", price: "", qty: "1", discount: "" },
  ]);

  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      { id: nextId++, type: "service", description: "", code: "", unit: "each", taxRate: "gst-free", price: "", qty: "1", discount: "" },
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

  const calcLineSubtotal = (item: LineItem): number => {
    const qty = parseFloat(item.qty) || 0;
    const price = parseFloat(item.price) || 0;
    const discountPct = parseFloat(item.discount) || 0;
    return qty * price * (1 - discountPct / 100);
  };

  const calcLineTax = (item: LineItem): number => {
    const sub = calcLineSubtotal(item);
    if (item.taxRate === "gst") return sub * 0.1;
    return 0;
  };

  const subtotalExclTax = lineItems.reduce((sum, item) => sum + calcLineSubtotal(item), 0);
  const totalDiscount = lineItems.reduce((sum, item) => {
    const qty = parseFloat(item.qty) || 0;
    const price = parseFloat(item.price) || 0;
    const discountPct = parseFloat(item.discount) || 0;
    return sum + qty * price * (discountPct / 100);
  }, 0);
  const totalTax = lineItems.reduce((sum, item) => sum + calcLineTax(item), 0);
  const totalAud = subtotalExclTax + totalTax;

  return (
    <FormPage
      title="Create invoice"
      backHref="/invoices"
      backLabel="Invoices"
      actions={
        <>
          <Button>Show/hide fields</Button>
          <Button>Preview</Button>
          <Button danger onClick={() => router.push("/invoices")}>
            Cancel
          </Button>
          <Button type="primary" onClick={() => router.push("/invoices")}>
            Create
          </Button>
        </>
      }
    >
      {/* Form fields — flat layout, no Card wrappers */}
      <Flex vertical gap={16}>
        <Grid cols={4} gap="md">
          <FormInput
            label="Invoice #"
            value={invoiceNumber}
            readOnly
          />
          <FormInput
            label="Reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Reference"
          />
          <FormInput
            label="Issue date"
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
          <FormInput
            label="Due date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </Grid>

        <Grid cols={2} gap="md">
          <FormSelect
            label="Patient"
            options={mockPatients}
            value={patient}
            onChange={setPatient}
            placeholder="Select patient"
            searchable
          />
          <FormSelect
            label="Invoice to"
            options={mockInvoiceTo}
            value={invoiceTo}
            onChange={setInvoiceTo}
          />
        </Grid>

        <FormTextarea
          label="Extra invoice details"
          value={extraDetails}
          onChange={(e) => setExtraDetails(e.target.value)}
          rows={2}
        />

        <Grid cols={3} gap="md">
          <FormSelect
            label="Location"
            options={mockLocations}
            value={location}
            onChange={setLocation}
          />
          <FormSelect
            label="Practitioner"
            options={mockPractitioners}
            value={practitioner}
            onChange={setPractitioner}
          />
          <FormInput
            label="Provider numbers"
            value={providerNumbers}
            onChange={(e) => setProviderNumbers(e.target.value)}
            placeholder="Provider numbers"
          />
        </Grid>
      </Flex>

      {/* Line items table */}
      {patient && (
        <div style={{ marginTop: 24 }}>
          <div style={{ overflowX: "auto", border: "1px solid var(--color-border)", borderRadius: 8 }}>
            <DataTable style={{ borderCollapse: "collapse" }}>
              <TableHead>
                <Th style={{ width: 100, padding: "10px 12px", fontWeight: 500, color: "var(--color-text-secondary)", backgroundColor: "var(--color-fill-quaternary)" }}>Type</Th>
                <Th style={{ padding: "10px 12px", fontWeight: 500, color: "var(--color-text-secondary)", backgroundColor: "var(--color-fill-quaternary)" }}>Description</Th>
                <Th style={{ width: 100, padding: "10px 12px", fontWeight: 500, color: "var(--color-text-secondary)", backgroundColor: "var(--color-fill-quaternary)" }}>Code</Th>
                <Th style={{ width: 90, padding: "10px 12px", fontWeight: 500, color: "var(--color-text-secondary)", backgroundColor: "var(--color-fill-quaternary)" }}>Unit</Th>
                <Th style={{ width: 120, padding: "10px 12px", fontWeight: 500, color: "var(--color-text-secondary)", backgroundColor: "var(--color-fill-quaternary)" }}>Tax rate</Th>
                <Th align="right" style={{ width: 100, padding: "10px 12px", fontWeight: 500, color: "var(--color-text-secondary)", backgroundColor: "var(--color-fill-quaternary)" }}>Price</Th>
                <Th align="right" style={{ width: 70, padding: "10px 12px", fontWeight: 500, color: "var(--color-text-secondary)", backgroundColor: "var(--color-fill-quaternary)" }}>Qty</Th>
                <Th align="right" style={{ width: 90, padding: "10px 12px", fontWeight: 500, color: "var(--color-text-secondary)", backgroundColor: "var(--color-fill-quaternary)" }}>Discount</Th>
                <Th align="right" style={{ width: 100, padding: "10px 12px", fontWeight: 500, color: "var(--color-text-secondary)", backgroundColor: "var(--color-fill-quaternary)" }}>Amount</Th>
                <Th style={{ width: 40, padding: "10px 8px", backgroundColor: "var(--color-fill-quaternary)" }} />
              </TableHead>
              <TableBody>
                {lineItems.map((item) => (
                  <Tr key={item.id} style={{ borderTop: "1px solid var(--color-border)" }}>
                    <Td style={{ padding: "8px 8px" }}>
                      <FormSelect
                        value={item.type}
                        onChange={(value) => updateLineItem(item.id, "type", value)}
                        options={mockTypeOptions}
                      />
                    </Td>
                    <Td style={{ padding: "8px 8px" }}>
                      <FormInput
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                        placeholder="Description"
                      />
                    </Td>
                    <Td style={{ padding: "8px 8px" }}>
                      <FormInput
                        value={item.code}
                        onChange={(e) => updateLineItem(item.id, "code", e.target.value)}
                        placeholder="Code"
                      />
                    </Td>
                    <Td style={{ padding: "8px 8px" }}>
                      <FormSelect
                        value={item.unit}
                        onChange={(value) => updateLineItem(item.id, "unit", value)}
                        options={mockUnitOptions}
                      />
                    </Td>
                    <Td style={{ padding: "8px 8px" }}>
                      <FormSelect
                        value={item.taxRate}
                        onChange={(value) => updateLineItem(item.id, "taxRate", value)}
                        options={mockTaxRateOptions}
                      />
                    </Td>
                    <Td style={{ padding: "8px 8px" }}>
                      <FormInput
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.price}
                        onChange={(e) => updateLineItem(item.id, "price", e.target.value)}
                        placeholder="0.00"
                        style={{ textAlign: "right" }}
                      />
                    </Td>
                    <Td style={{ padding: "8px 8px" }}>
                      <FormInput
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => updateLineItem(item.id, "qty", e.target.value)}
                        style={{ textAlign: "right" }}
                      />
                    </Td>
                    <Td style={{ padding: "8px 8px" }}>
                      <FormInput
                        type="number"
                        min="0"
                        max="100"
                        value={item.discount}
                        onChange={(e) => updateLineItem(item.id, "discount", e.target.value)}
                        placeholder="0%"
                        style={{ textAlign: "right" }}
                      />
                    </Td>
                    <Td align="right" style={{ padding: "8px 12px", fontWeight: 500, color: "var(--color-text)" }}>
                      ${(calcLineSubtotal(item) + calcLineTax(item)).toFixed(2)}
                    </Td>
                    <Td style={{ padding: "8px 4px" }}>
                      {lineItems.length > 1 && (
                        <Button
                          type="text"
                          size="small"
                          onClick={() => removeLineItem(item.id)}
                        >
                          <Icon as={DeleteOutlined} />
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))}
              </TableBody>
            </DataTable>
          </div>
          <div style={{ padding: "12px 0" }}>
            <Button type="text" size="small" onClick={addLineItem}>
              <Icon as={PlusOutlined} />
              Add line item
            </Button>
          </div>

          {/* Totals */}
          <Flex justify="end" style={{ marginTop: 8 }}>
            <Flex vertical gap={6} style={{ width: 280 }}>
              <Flex align="center" justify="space-between">
                <Text variant="body/md" color="secondary">Subtotal excl. tax</Text>
                <Text variant="body/md-strong">${subtotalExclTax.toFixed(2)}</Text>
              </Flex>
              <Flex align="center" justify="space-between">
                <Text variant="body/md" color="secondary">Total discount</Text>
                <Text variant="body/md-strong">-${totalDiscount.toFixed(2)}</Text>
              </Flex>
              <Flex align="center" justify="space-between">
                <Text variant="body/md" color="secondary">Total tax</Text>
                <Text variant="body/md-strong">${totalTax.toFixed(2)}</Text>
              </Flex>
              <Flex
                align="center"
                justify="space-between"
                style={{ borderTop: "1px solid var(--color-border)", paddingTop: 8, marginTop: 4 }}
              >
                <Text variant="heading/lg">TOTAL AUD</Text>
                <Text variant="heading/lg">${totalAud.toFixed(2)}</Text>
              </Flex>
            </Flex>
          </Flex>

          {/* Additional information */}
          <div style={{ marginTop: 24 }}>
            <Flex align="center" gap={8} style={{ marginBottom: 8 }}>
              <Text variant="label/lg">Additional information</Text>
              <Button type="text" size="small">Apply business default</Button>
            </Flex>
            <FormTextarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={3}
              placeholder="Additional information..."
            />
          </div>
        </div>
      )}
    </FormPage>
  );
}
