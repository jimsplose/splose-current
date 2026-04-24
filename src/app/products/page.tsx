"use client";

import { ListPage, Pagination, EmptyState, Dropdown, DropdownTriggerButton, Modal, Checkbox, Text, Grid, Divider } from "@/components/ds";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, MinusOutlined, MoreOutlined, EditOutlined, CopyOutlined, HistoryOutlined, DeleteOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Select } from "antd";
import Link from "next/link";
import { useState, useMemo, useCallback } from "react";
import { useFormModal } from "@/hooks/useFormModal";
import pStyles from "./products.module.css";

interface ProductVariant {
  name: string;
  sku: string;
  price: number | null;
  stock: number | null;
  unit: string;
}

interface Product {
  name: string;
  category: string;
  vendor: string;
  stock: number | null;
  archived?: boolean;
  variants?: ProductVariant[];
  description?: string;
  usageCount?: number;
  lastUsed?: string;
}

const mockProducts: Product[] = [
  // ── Services ────────────────────────────────────────────────────────────
  {
    name: "Speech Therapy — Initial Assessment",
    category: "Service",
    vendor: "",
    stock: null,
    description: "60-minute initial speech pathology assessment including report.",
    usageCount: 87,
    lastUsed: "23/03/2026",
    variants: [
      { name: "Standard (60 min)", sku: "SPA-60", price: 193.99, stock: null, unit: "Items" },
      { name: "Extended (90 min)", sku: "SPA-90", price: 250.00, stock: null, unit: "Items" },
    ],
  },
  {
    name: "OT Assessment",
    category: "Service",
    vendor: "",
    stock: null,
    description: "Comprehensive occupational therapy functional assessment.",
    usageCount: 64,
    lastUsed: "22/03/2026",
  },
  {
    name: "Psychology Session — Individual",
    category: "Service",
    vendor: "",
    stock: null,
    description: "50-minute individual psychology session (Medicare rebate eligible).",
    usageCount: 142,
    lastUsed: "24/03/2026",
    variants: [
      { name: "Standard (50 min)", sku: "PSY-50", price: 220.00, stock: null, unit: "Items" },
      { name: "Extended (80 min)", sku: "PSY-80", price: 320.00, stock: null, unit: "Items" },
    ],
  },
  {
    name: "Physiotherapy — Follow Up",
    category: "Service",
    vendor: "",
    stock: null,
    description: "30-minute follow-up physiotherapy consultation.",
    usageCount: 203,
    lastUsed: "24/03/2026",
  },
  {
    name: "Dietetics Consultation",
    category: "Service",
    vendor: "",
    stock: null,
    description: "Initial nutrition assessment and meal planning session.",
    usageCount: 31,
    lastUsed: "20/03/2026",
  },
  {
    name: "Exercise Physiology — Group Session",
    category: "Service",
    vendor: "",
    stock: null,
    description: "45-minute supervised group exercise class (max 6 participants).",
    usageCount: 56,
    lastUsed: "21/03/2026",
  },
  {
    name: "Speech Therapy — Review",
    category: "Service",
    vendor: "",
    stock: null,
    description: "30-minute speech pathology follow-up session.",
    usageCount: 95,
    lastUsed: "23/03/2026",
  },

  // ── Products ────────────────────────────────────────────────────────────
  {
    name: "Balance Ball",
    category: "Physiotherapy",
    vendor: "PhysioSupply Co",
    stock: 141,
    description: "Exercise ball for physiotherapy sessions. Available in multiple sizes.",
    usageCount: 48,
    lastUsed: "22/03/2026",
    variants: [
      { name: "Medium (55 cm)", sku: "BB-55", price: 45.00, stock: 60, unit: "Items" },
      { name: "Large (65 cm)", sku: "BB-65", price: 55.00, stock: 50, unit: "Items" },
      { name: "X-Large (75 cm)", sku: "BB-75", price: 65.00, stock: 31, unit: "Items" },
    ],
  },
  {
    name: "Exercise Band — Resistance Set",
    category: "Physiotherapy",
    vendor: "TheraBand",
    stock: 85,
    description: "Latex-free resistance bands in graduated strengths for rehab exercises.",
    usageCount: 72,
    lastUsed: "23/03/2026",
    variants: [
      { name: "Light (Yellow)", sku: "EB-LT", price: 15.00, stock: 30, unit: "Items" },
      { name: "Medium (Red)", sku: "EB-MD", price: 18.00, stock: 30, unit: "Items" },
      { name: "Heavy (Blue)", sku: "EB-HV", price: 22.00, stock: 25, unit: "Items" },
    ],
  },
  {
    name: "Therapy Putty",
    category: "OT Equipment",
    vendor: "Cando",
    stock: 48,
    description: "Colour-coded therapy putty for hand strengthening and fine motor exercises.",
    usageCount: 39,
    lastUsed: "21/03/2026",
    variants: [
      { name: "Soft (Yellow)", sku: "TP-SF", price: 19.95, stock: 16, unit: "Items" },
      { name: "Medium (Red)", sku: "TP-MD", price: 19.95, stock: 16, unit: "Items" },
      { name: "Firm (Green)", sku: "TP-FM", price: 19.95, stock: 16, unit: "Items" },
    ],
  },
  {
    name: "Resistance Loop Band",
    category: "Physiotherapy",
    vendor: "TheraBand",
    stock: 60,
    description: "Mini loop bands for glute activation and lower limb strengthening.",
    usageCount: 28,
    lastUsed: "19/03/2026",
  },
  {
    name: "Foam Roller",
    category: "Physiotherapy",
    vendor: "PhysioSupply Co",
    stock: 12,
    description: "High-density foam roller for myofascial release and muscle recovery.",
    usageCount: 34,
    lastUsed: "20/03/2026",
  },
  {
    name: "Grippy Socks",
    category: "Support Item",
    vendor: "",
    stock: 16,
    description: "Non-slip socks for patient safety during sessions.",
    usageCount: 34,
    lastUsed: "23/03/2026",
  },
  {
    name: "Sensory Fidget Kit",
    category: "OT Equipment",
    vendor: "Sensory Direct",
    stock: 22,
    description: "Assorted fidget tools for sensory regulation and focus activities.",
    usageCount: 18,
    lastUsed: "18/03/2026",
  },
  {
    name: "Weighted Lap Pad (1 kg)",
    category: "OT Equipment",
    vendor: "Sensory Direct",
    stock: 8,
    description: "Calming weighted pad for sensory processing support.",
    usageCount: 14,
    lastUsed: "17/03/2026",
  },

  // ── Consumables ─────────────────────────────────────────────────────────
  {
    name: "Nitrile Gloves — Box of 100",
    category: "Consumable",
    vendor: "Medline",
    stock: 24,
    description: "Powder-free nitrile examination gloves, medium size.",
    usageCount: 112,
    lastUsed: "24/03/2026",
  },
  {
    name: "Disposable Face Masks — Box of 50",
    category: "Consumable",
    vendor: "Medline",
    stock: 18,
    description: "3-ply disposable surgical face masks with ear loops.",
    usageCount: 88,
    lastUsed: "24/03/2026",
  },
  {
    name: "Hand Sanitiser (500 mL)",
    category: "Consumable",
    vendor: "Dettol",
    stock: 30,
    description: "Hospital-grade alcohol-based hand sanitiser pump bottle.",
    usageCount: 156,
    lastUsed: "24/03/2026",
  },
  {
    name: "Kinesiology Tape Roll",
    category: "Consumable",
    vendor: "RockTape",
    stock: 42,
    description: "Hypoallergenic cotton kinesiology tape for muscle support.",
    usageCount: 67,
    lastUsed: "22/03/2026",
  },
  {
    name: "Electrode Pads — Pack of 4",
    category: "Consumable",
    vendor: "TensCare",
    stock: 36,
    description: "Self-adhesive TENS electrode pads for electrotherapy units.",
    usageCount: 45,
    lastUsed: "20/03/2026",
  },

  // ── Archived ────────────────────────────────────────────────────────────
  {
    name: "Resistance Band (Discontinued)",
    category: "Physiotherapy",
    vendor: "Generic",
    stock: 3,
    archived: true,
    description: "Discontinued latex resistance band — replaced by TheraBand set.",
    usageCount: 15,
    lastUsed: "01/02/2026",
  },
  {
    name: "Foam Roller (Old Model)",
    category: "Physiotherapy",
    vendor: "",
    stock: 0,
    archived: true,
    description: "Retired low-density foam roller model.",
    usageCount: 42,
    lastUsed: "10/01/2026",
  },
  {
    name: "Paper Gowns — Pack of 10",
    category: "Consumable",
    vendor: "Medline",
    stock: 0,
    archived: true,
    description: "Disposable paper gowns — discontinued by supplier.",
    usageCount: 23,
    lastUsed: "15/12/2025",
  },
];

const dropdownItems = [
  { label: "Edit", value: "edit", icon: <EditOutlined /> },
  { label: "Duplicate", value: "duplicate", icon: <CopyOutlined /> },
  { label: "Change log", value: "change-log", icon: <HistoryOutlined /> },
  { label: "", value: "divider-1", divider: true },
  { label: "Archive", value: "archive", danger: true, icon: <DeleteOutlined /> },
];

const dropdownItemsWithStock = [
  { label: "Edit", value: "edit", icon: <EditOutlined /> },
  { label: "Manage stock", value: "manage-stock", icon: <AppstoreOutlined /> },
  { label: "Duplicate", value: "duplicate", icon: <CopyOutlined /> },
  { label: "Change log", value: "change-log", icon: <HistoryOutlined /> },
  { label: "", value: "divider-1", divider: true },
  { label: "Archive", value: "archive", danger: true, icon: <DeleteOutlined /> },
];

type ProductForm = {
  [key: string]: unknown;
  name: string;
  code: string;
  price: string;
  tax: string;
  type: string;
};

const taxOptions = [
  { value: "gst", label: "GST (10%)" },
  { value: "gst-free", label: "GST Free" },
  { value: "exempt", label: "Exempt" },
];

const typeOptions = [
  { value: "physical", label: "Physical" },
  { value: "digital", label: "Digital" },
  { value: "service", label: "Service" },
];

interface StockLocation {
  name: string;
  available: boolean;
  trackStock: boolean;
  count: number | null;
}

const mockStockLocations: StockLocation[] = [
  { name: "East Clinics", available: true, trackStock: true, count: 120 },
  { name: "Splose OT", available: false, trackStock: false, count: null },
  { name: "Ploc", available: false, trackStock: false, count: null },
  { name: "Tasks", available: false, trackStock: false, count: null },
  { name: "Sharon's", available: false, trackStock: false, count: null },
  { name: "One service only", available: false, trackStock: false, count: null },
];

const stockDropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Reset count", value: "reset" },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [products, setProducts] = useState(mockProducts);
  const [editForm] = Form.useForm();

  // Manage Stock modal state
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockModalVariant, setStockModalVariant] = useState<string | null>(null);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: "archive" | "delete" | null;
    productIndex: number | null;
  }>({ open: false, title: "", message: "", action: null, productIndex: null });

  const { modalOpen, isEditing, form, setField, openEdit, closeModal, handleSave } =
    useFormModal<ProductForm>({
      defaults: { name: "", code: "", price: "", tax: "gst", type: "physical" },
      onSave: (values, index) => {
        if (index !== null) {
          setProducts((prev) => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              name: values.name,
              category: values.type,
            };
            return updated;
          });
        }
      },
    });

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (!showArchived) {
      filtered = filtered.filter((p) => !p.archived);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(query));
    }
    return filtered;
  }, [searchQuery, showArchived, products]);

  const totalPages = Math.ceil(filteredProducts.length / 20);
  const paginatedProducts = filteredProducts.slice(0, 20);

  const toggleExpand = (index: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleDropdownAction = useCallback(
    (value: string, product: Product, globalIndex: number) => {
      // Find the actual index in the products array (not filtered/paginated)
      const actualIndex = products.indexOf(product);
      if (value === "edit") {
        openEdit(actualIndex, {
          name: product.name,
          code: "",
          price: product.stock !== null ? String(product.stock) : "",
          tax: "gst",
          type: product.category || "physical",
        });
      } else if (value === "archive") {
        setConfirmDialog({
          open: true,
          title: product.archived ? "Unarchive product" : "Archive product",
          message: product.archived
            ? `Are you sure you want to unarchive "${product.name}"?`
            : `Are you sure you want to archive "${product.name}"? Archived products will not appear in search results.`,
          action: "archive",
          productIndex: actualIndex,
        });
      } else if (value === "manage-stock") {
        setStockModalVariant(product.name);
        setStockModalOpen(true);
      } else if (value === "duplicate") {
        setProducts((prev) => {
          const newProduct = { ...product, name: `Copy of ${product.name}` };
          const idx = prev.indexOf(product);
          const updated = [...prev];
          updated.splice(idx + 1, 0, newProduct);
          return updated;
        });
      }
    },
    [products, openEdit],
  );

  const handleConfirmAction = useCallback(() => {
    if (confirmDialog.action === "archive" && confirmDialog.productIndex !== null) {
      setProducts((prev) => {
        const updated = [...prev];
        updated[confirmDialog.productIndex!] = {
          ...updated[confirmDialog.productIndex!],
          archived: !updated[confirmDialog.productIndex!].archived,
        };
        return updated;
      });
    }
    setConfirmDialog({ open: false, title: "", message: "", action: null, productIndex: null });
  }, [confirmDialog]);

  return (
    <>
    <ListPage
      title="Products"
      actions={
        <>
          <Button
            onClick={() => {
              setShowArchived(!showArchived);
            }}
            className={showArchived ? pStyles.activeFilterButton : ""}
          >
            Display archived products
          </Button>
          <Link href="/products/new">
            <Button>
              <PlusOutlined style={{ fontSize: 14, color: 'var(--ant-color-text, #414549)' }} />
              New product
            </Button>
          </Link>
        </>
      }
      searchPlaceholder="Search for product by name"
      onSearch={handleSearch}
    >
        {(() => {
          const variantColumns: ColumnsType<ProductVariant> = [
            { key: "name", title: "Name", render: (_, v) => <Text variant="body/sm" as="span" color="text">{v.name}</Text> },
            { key: "sku", title: "SKU", render: (_, v) => <Text variant="body/sm" as="span" color="secondary">{v.sku}</Text> },
            { key: "price", title: "Price", render: (_, v) => <Text variant="body/sm" as="span" color="secondary">{v.price !== null ? v.price.toFixed(2) : "-"}</Text> },
            { key: "stock", title: "Stock", render: (_, v) => <Text variant="body/sm" as="span" color="secondary">{v.stock !== null ? v.stock : "-"}</Text> },
            { key: "unit", title: "Unit", render: (_, v) => <Text variant="body/sm" as="span" color="secondary">{v.unit}</Text> },
            {
              key: "actions",
              title: "Actions",
              render: (_, v) => (
                <Button type="link" onClick={() => { setStockModalVariant(v.name); setStockModalOpen(true); }}>
                  Manage Stock
                </Button>
              ),
            },
          ];

          const productColumns: ColumnsType<Product> = [
            {
              key: "expand",
              title: "",
              render: (_, product, idx) => (
                <Button
                  type="text"
                  size="small"
                  shape="circle"
                  onClick={(e) => { e.stopPropagation(); toggleExpand(idx); }}
                >
                  {expandedRows.has(idx) ? <MinusOutlined style={{ fontSize: 14, color: 'var(--ant-color-text, #414549)' }} /> : <PlusOutlined style={{ fontSize: 14, color: 'var(--ant-color-text, #414549)' }} />}
                </Button>
              ),
            },
            { key: "name", title: "Name", render: (_, product) => <Text variant="body/md" as="span" color="text">{product.name}</Text> },
            { key: "category", title: "Category", render: (_, product) => <Text variant="body/md" as="span" color="secondary">{product.category}</Text> },
            { key: "vendor", title: "Vendor", render: (_, product) => <Text variant="body/md" as="span" color="secondary">{product.vendor}</Text> },
            { key: "stock", title: "Stock", align: "center" as const, render: (_, product) => <Text variant="body/md" as="span" color="secondary">{product.stock !== null ? product.stock : "-"}</Text> },
            {
              key: "actions",
              title: "Actions",
              align: "center" as const,
              render: (_, product) => (
                <div onClick={(e) => e.stopPropagation()}>
                  <Dropdown
                    align="right"
                    trigger={<DropdownTriggerButton />}
                    items={product.stock !== null ? dropdownItemsWithStock : dropdownItems}
                    onSelect={(value) => handleDropdownAction(value, product, paginatedProducts.indexOf(product))}
                  />
                </div>
              ),
            },
          ];

          return (
            <Table
              columns={productColumns}
              dataSource={paginatedProducts}
              rowKey={(_, idx) => String(idx)}
              pagination={false}
              onRow={(product, idx) => ({
                className: `${pStyles.productRow}${product.archived ? ` ${pStyles.productRowArchived}` : ""}`,
                onClick: () => toggleExpand(idx ?? 0),
              })}
              expandable={{
                expandedRowKeys: Array.from(expandedRows).map(String),
                showExpandColumn: false,
                expandedRowRender: (product, idx) => (
                  <div style={{ padding: "12px 32px" }}>
                    <Grid cols={3} gap="md" style={{ marginBottom: 12 }}>
                      <div>
                        <Text variant="label/md" as="span" color="secondary">Description</Text>
                        <Text variant="body/md" color="text" style={{ marginTop: 2 }}>{product.description || "No description"}</Text>
                      </div>
                      <div>
                        <Text variant="label/md" as="span" color="secondary">Usage count</Text>
                        <Text variant="body/md" color="text" style={{ marginTop: 2 }}>{product.usageCount !== undefined ? `${product.usageCount} times` : "-"}</Text>
                      </div>
                      <div>
                        <Text variant="label/md" as="span" color="secondary">Last used</Text>
                        <Text variant="body/md" color="text" style={{ marginTop: 2 }}>{product.lastUsed || "Never"}</Text>
                      </div>
                    </Grid>
                    {product.variants && product.variants.length > 0 && (
                      <Table
                        columns={variantColumns}
                        dataSource={product.variants}
                        rowKey="sku"
                        pagination={false}
                        rowClassName={pStyles.variantRow}
                      />
                    )}
                  </div>
                ),
              }}
              locale={{ emptyText: <EmptyState message="No products found." style={{ padding: "32px 0" }} /> }}
            />
          );
        })()}

        <Pagination
          currentPage={1}
          totalPages={totalPages}
          totalItems={filteredProducts.length}
          itemsPerPage={20}
          onPageChange={() => {}}
        />
    </ListPage>

      {/* Edit Product Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit product" : "New product"}
        footer={
          <>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <Form form={editForm} layout="vertical">
          <Flex vertical gap={16}>
            <Form.Item label="Name">
              <Input value={form.name} onChange={(e) => setField("name", e.target.value)} />
            </Form.Item>
            <Form.Item label="Code">
              <Input value={form.code} onChange={(e) => setField("code", e.target.value)} />
            </Form.Item>
            <Form.Item label="Price">
              <Input type="number" value={form.price} onChange={(e) => setField("price", e.target.value)} />
            </Form.Item>
            <Form.Item label="Tax">
              <Select options={taxOptions} value={form.tax} onChange={(value) => setField("tax", value)} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Type">
              <Select options={typeOptions} value={form.type} onChange={(value) => setField("type", value)} style={{ width: "100%" }} />
            </Form.Item>
          </Flex>
        </Form>
      </Modal>

      {/* Confirmation Dialog */}
      <Modal
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, title: "", message: "", action: null, productIndex: null })}
        title={confirmDialog.title}
        maxWidth="sm"
        footer={
          <>
            <Button onClick={() => setConfirmDialog({ open: false, title: "", message: "", action: null, productIndex: null })}>
              Cancel
            </Button>
            <Button danger onClick={handleConfirmAction}>
              {confirmDialog.action === "archive" ? "Archive" : "Delete"}
            </Button>
          </>
        }
      >
        <Text variant="body/md" color="secondary">{confirmDialog.message}</Text>
      </Modal>

      {/* Manage Stock Modal */}
      <Modal
        open={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        title={`Manage the stock of ${stockModalVariant ?? ""}`}
        maxWidth="lg"
        footer={
          <>
            <Button onClick={() => setStockModalOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={() => setStockModalOpen(false)}>OK</Button>
          </>
        }
      >
        <div style={{ overflowX: 'auto' }}>
          {(() => {
            const stockColumns: ColumnsType<StockLocation> = [
              { key: "name", title: "Location", render: (_, loc) => <Text variant="body/sm" as="span" color="text">{loc.name}</Text> },
              { key: "available", title: "Available", align: "center" as const, render: (_, loc) => <Checkbox checked={loc.available} readOnly /> },
              { key: "trackStock", title: "Track stock", align: "center" as const, render: (_, loc) => <Checkbox checked={loc.trackStock} readOnly /> },
              { key: "count", title: "Count", align: "center" as const, render: (_, loc) => <Text variant="body/sm" as="span" color="secondary">{loc.trackStock ? loc.count : "N/A"}</Text> },
              {
                key: "actions",
                title: "Actions",
                align: "center" as const,
                render: () => (
                  <Dropdown
                    align="right"
                    trigger={
                      <button className={`inline-flex items-center justify-center rounded-[6px] border-none bg-transparent cursor-pointer ${pStyles.stockActionButton}`} style={{ height: 28, width: 28 }}>
                        <MoreOutlined style={{ fontSize: 14, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
                      </button>
                    }
                    items={stockDropdownItems}
                    onSelect={() => {}}
                  />
                ),
              },
            ];
            return (
              <Table
                columns={stockColumns}
                dataSource={mockStockLocations}
                rowKey="name"
                pagination={false}
                rowClassName={pStyles.stockRow}
              />
            );
          })()}
        </div>
        <div style={{ marginTop: 16 }}>
          <Pagination
            currentPage={1}
            totalPages={1}
            totalItems={mockStockLocations.length}
            itemsPerPage={10}
            onPageChange={() => {}}
          />
        </div>
      </Modal>
    </>
  );
}
