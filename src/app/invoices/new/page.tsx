"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Select, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FormPage, Grid, Text } from "@/components/ds";
import styles from "./InvoicesNew.module.css";

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
  const [form] = Form.useForm();

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
      <Form form={form} layout="vertical">
        <Flex vertical gap={16}>
          <Grid cols={4} gap="md">
            <Form.Item label="Invoice #">
              <Input value={invoiceNumber} readOnly />
            </Form.Item>
            <Form.Item label="Reference">
              <Input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Reference"
              />
            </Form.Item>
            <Form.Item label="Issue date">
              <Input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Due date">
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </Form.Item>
          </Grid>

          <Grid cols={2} gap="md">
            <Form.Item label="Patient">
              <Select
                options={mockPatients}
                value={patient}
                onChange={setPatient}
                placeholder="Select patient"
                showSearch={true}
                className={styles.fullWidthSelect}
              />
            </Form.Item>
            <Form.Item label="Invoice to">
              <Select
                options={mockInvoiceTo}
                value={invoiceTo}
                onChange={setInvoiceTo}
                className={styles.fullWidthSelect}
              />
            </Form.Item>
          </Grid>

          <Form.Item label="Extra invoice details">
            <Input.TextArea
              value={extraDetails}
              onChange={(e) => setExtraDetails(e.target.value)}
              rows={2}
            />
          </Form.Item>

          <Grid cols={3} gap="md">
            <Form.Item label="Location">
              <Select
                options={mockLocations}
                value={location}
                onChange={setLocation}
                className={styles.fullWidthSelect}
              />
            </Form.Item>
            <Form.Item label="Practitioner">
              <Select
                options={mockPractitioners}
                value={practitioner}
                onChange={setPractitioner}
                className={styles.fullWidthSelect}
              />
            </Form.Item>
            <Form.Item label="Provider numbers">
              <Input
                value={providerNumbers}
                onChange={(e) => setProviderNumbers(e.target.value)}
                placeholder="Provider numbers"
              />
            </Form.Item>
          </Grid>
        </Flex>
      </Form>

      {/* Line items table */}
      {patient && (
        <div className={styles.lineItems}>
          {(() => {
            const lineItemColumns: ColumnsType<LineItem> = [
              {
                key: "type",
                title: "Type",
                width: 100,
                render: (_, item) => (
                  <Select
                    value={item.type}
                    onChange={(value) => updateLineItem(item.id, "type", value)}
                    options={mockTypeOptions}
                    className={styles.fullWidthSelect}
                  />
                ),
              },
              {
                key: "description",
                title: "Description",
                render: (_, item) => (
                  <Input
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                    placeholder="Description"
                  />
                ),
              },
              {
                key: "code",
                title: "Code",
                width: 100,
                render: (_, item) => (
                  <Input
                    value={item.code}
                    onChange={(e) => updateLineItem(item.id, "code", e.target.value)}
                    placeholder="Code"
                  />
                ),
              },
              {
                key: "unit",
                title: "Unit",
                width: 90,
                render: (_, item) => (
                  <Select
                    value={item.unit}
                    onChange={(value) => updateLineItem(item.id, "unit", value)}
                    options={mockUnitOptions}
                    className={styles.fullWidthSelect}
                  />
                ),
              },
              {
                key: "taxRate",
                title: "Tax rate",
                width: 120,
                render: (_, item) => (
                  <Select
                    value={item.taxRate}
                    onChange={(value) => updateLineItem(item.id, "taxRate", value)}
                    options={mockTaxRateOptions}
                    className={styles.fullWidthSelect}
                  />
                ),
              },
              {
                key: "price",
                title: "Price",
                align: "right" as const,
                width: 100,
                render: (_, item) => (
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.price}
                    onChange={(e) => updateLineItem(item.id, "price", e.target.value)}
                    placeholder="0.00"
                    className={styles.rightAlignInput}
                  />
                ),
              },
              {
                key: "qty",
                title: "Qty",
                align: "right" as const,
                width: 70,
                render: (_, item) => (
                  <Input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => updateLineItem(item.id, "qty", e.target.value)}
                    className={styles.rightAlignInput}
                  />
                ),
              },
              {
                key: "discount",
                title: "Discount",
                align: "right" as const,
                width: 90,
                render: (_, item) => (
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={item.discount}
                    onChange={(e) => updateLineItem(item.id, "discount", e.target.value)}
                    placeholder="0%"
                    className={styles.rightAlignInput}
                  />
                ),
              },
              {
                key: "amount",
                title: "Amount",
                align: "right" as const,
                width: 100,
                render: (_, item) => (
                  <span className={styles.amountCell}>
                    ${(calcLineSubtotal(item) + calcLineTax(item)).toFixed(2)}
                  </span>
                ),
              },
              {
                key: "delete",
                title: "",
                width: 40,
                render: (_, item) =>
                  lineItems.length > 1 ? (
                    <Button
                      type="text"
                      size="small"
                      onClick={() => removeLineItem(item.id)}
                      icon={<DeleteOutlined className={styles.deleteIcon} />}
                    />
                  ) : null,
              },
            ];
            return (
              <div className={styles.lineItemsTable}>
                <Table
                  columns={lineItemColumns}
                  dataSource={lineItems}
                  rowKey="id"
                  pagination={false}
                />
              </div>
            );
          })()}
          <div className={styles.addItemRow}>
            <Button
              type="text"
              size="small"
              onClick={addLineItem}
              icon={<PlusOutlined className={styles.addItemIcon} />}
            >
              Add line item
            </Button>
          </div>

          {/* Totals */}
          <Flex justify="end" className={styles.totalsWrap}>
            <Flex vertical gap={6} className={styles.totalsCol}>
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
                className={styles.totalsTotalRow}
              >
                <Text variant="heading/lg">TOTAL AUD</Text>
                <Text variant="heading/lg">${totalAud.toFixed(2)}</Text>
              </Flex>
            </Flex>
          </Flex>

          {/* Additional information */}
          <div className={styles.additionalInfo}>
            <Flex align="center" gap={8} className={styles.additionalInfoHeader}>
              <Text variant="label/lg">Additional information</Text>
              <Button type="text" size="small">Apply business default</Button>
            </Flex>
            <Input.TextArea
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
