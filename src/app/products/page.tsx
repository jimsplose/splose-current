"use client";

import { PageHeader, Button, Card, DataTable, SearchBar, Pagination, TableHead, Th, TableBody, Td, EmptyState, Dropdown, DropdownTriggerButton, Modal, FormInput, FormSelect } from "@/components/ds";
import { Plus, Minus } from "lucide-react";
import { useState, useMemo, useCallback, Fragment } from "react";
import { useFormModal } from "@/hooks/useFormModal";

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
}

const mockProducts: Product[] = [
  {
    name: "Balance ball",
    category: "Physiotherapy",
    vendor: "",
    stock: 141,
    variants: [
      { name: "Medium", sku: "55", price: 110.0, stock: 120, unit: "Milligrams" },
      { name: "Large", sku: "12", price: 150.0, stock: 21, unit: "Milligrams" },
      { name: "X Large", sku: "", price: 170.0, stock: null, unit: "Items" },
    ],
  },
  { name: "Roller", category: "Roller", vendor: "", stock: 5 },
  { name: "Train", category: "transport", vendor: "Tesla", stock: 14 },
  { name: "test add op", category: "", vendor: "", stock: null },
  { name: "Copy of test add op", category: "", vendor: "", stock: 1 },
  { name: "Copy of Roller", category: "Roller", vendor: "", stock: null },
  { name: "Test", category: "", vendor: "", stock: null },
  { name: "Crystal", category: "", vendor: "", stock: null },
  { name: "Grippy socks", category: "Support Item", vendor: "", stock: 16 },
  { name: "Test", category: "", vendor: "", stock: null },
  { name: "Resistance band", category: "Physiotherapy", vendor: "", stock: 30, archived: true },
  { name: "Foam roller (old)", category: "Roller", vendor: "", stock: 0, archived: true },
];

const ITEMS_PER_PAGE = 10;

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "", value: "divider-1", divider: true },
  { label: "Archive", value: "archive", danger: true },
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

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState(mockProducts);

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

  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
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
    setCurrentPage(1);
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
    <div className="p-4 sm:p-6">
      <PageHeader title="Products">
        <Button
          variant="secondary"
          onClick={() => {
            setShowArchived(!showArchived);
            setCurrentPage(1);
          }}
          className={showArchived ? "border-primary bg-primary/5 text-primary" : ""}
        >
          Display archived products
        </Button>
        <Button variant="secondary">
          <Plus className="h-4 w-4" />
          New product
        </Button>
      </PageHeader>

      <SearchBar
        placeholder="Search for product by name"
        onSearch={handleSearch}
        defaultValue={searchQuery}
      />

      <Card padding="none" className="overflow-x-auto">
        <DataTable>
          <TableHead>
            <Th className="w-8 px-2">{/* expand */}</Th>
            <Th>Name</Th>
            <Th hidden="sm">Category</Th>
            <Th hidden="md">Vendor</Th>
            <Th align="center">Stock</Th>
            <Th align="center" className="w-16">
              Actions
            </Th>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product, idx) => {
              const globalIndex = startIndex + idx;
              const isExpanded = expandedRows.has(globalIndex);
              const hasVariants = product.variants && product.variants.length > 0;

              return (
                <Fragment key={globalIndex}>
                  <tr
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                      product.archived ? "opacity-60" : ""
                    }`}
                    onClick={() => hasVariants && toggleExpand(globalIndex)}
                  >
                    <td className="px-2 py-3 text-center">
                      {hasVariants ? (
                        <Button
                          variant="icon"
                          size="sm"
                          round
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(globalIndex);
                          }}
                        >
                          {isExpanded ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        </Button>
                      ) : (
                        <span className="inline-flex h-5 w-5 items-center justify-center text-text-secondary">
                          <Plus className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </td>
                    <Td className="text-text">{product.name}</Td>
                    <Td hidden="sm" className="text-text-secondary">
                      {product.category}
                    </Td>
                    <Td hidden="md" className="text-text-secondary">
                      {product.vendor}
                    </Td>
                    <Td align="center" className="text-text-secondary">
                      {product.stock !== null ? product.stock : "-"}
                    </Td>
                    <Td align="center">
                      <div onClick={(e) => e.stopPropagation()}>
                        <Dropdown
                          align="right"
                          trigger={<DropdownTriggerButton />}
                          items={dropdownItems}
                          onSelect={(value) => handleDropdownAction(value, product, globalIndex)}
                        />
                      </div>
                    </Td>
                  </tr>

                  {isExpanded && hasVariants && (
                    <tr>
                      <td colSpan={6} className="bg-gray-50/50 px-0 py-0">
                        <div className="px-8 py-2">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="px-4 py-2 text-left text-label-lg text-text">Name</th>
                                <th className="px-4 py-2 text-left text-label-lg text-text">SKU</th>
                                <th className="px-4 py-2 text-left text-label-lg text-text">Price</th>
                                <th className="px-4 py-2 text-left text-label-lg text-text">Stock</th>
                                <th className="px-4 py-2 text-left text-label-lg text-text">Unit</th>
                                <th className="px-4 py-2 text-left text-label-lg text-primary">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {product.variants!.map((variant, vIdx) => (
                                <tr key={vIdx} className="hover:bg-gray-50">
                                  <td className="px-4 py-2 text-sm text-text">{variant.name}</td>
                                  <td className="px-4 py-2 text-sm text-text-secondary">{variant.sku}</td>
                                  <td className="px-4 py-2 text-sm text-text-secondary">
                                    {variant.price !== null ? variant.price.toFixed(2) : "-"}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-text-secondary">
                                    {variant.stock !== null ? variant.stock : "-"}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-text-secondary">{variant.unit}</td>
                                  <td className="px-4 py-2 text-sm">
                                    <Button variant="link">Manage Stock</Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}

            {paginatedProducts.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState message="No products found." className="py-8" />
                </td>
              </tr>
            )}
          </TableBody>
        </DataTable>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </Card>

      {/* Edit Product Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit product" : "New product"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <FormInput label="Code" value={form.code} onChange={(e) => setField("code", e.target.value)} />
          <FormInput label="Price" type="number" value={form.price} onChange={(e) => setField("price", e.target.value)} />
          <FormSelect label="Tax" options={taxOptions} value={form.tax} onChange={(e) => setField("tax", e.target.value)} />
          <FormSelect label="Type" options={typeOptions} value={form.type} onChange={(e) => setField("type", e.target.value)} />
        </div>
      </Modal>

      {/* Confirmation Dialog */}
      <Modal
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, title: "", message: "", action: null, productIndex: null })}
        title={confirmDialog.title}
        maxWidth="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDialog({ open: false, title: "", message: "", action: null, productIndex: null })}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmAction}>
              {confirmDialog.action === "archive" ? "Archive" : "Delete"}
            </Button>
          </>
        }
      >
        <p className="text-body-md text-text-secondary">{confirmDialog.message}</p>
      </Modal>
    </div>
  );
}
