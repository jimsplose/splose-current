"use client";

import { PageHeader, Button, Card, SearchBar, Pagination, TableHead, Th, TableBody, Td, EmptyState, Dropdown, DropdownTriggerButton } from "@/components/ds";
import { Plus, Minus } from "lucide-react";
import { useState, useMemo, Fragment } from "react";

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

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    let products = mockProducts;
    if (!showArchived) {
      products = products.filter((p) => !p.archived);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter((p) => p.name.toLowerCase().includes(query));
    }
    return products;
  }, [searchQuery, showArchived]);

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
        <table className="w-full">
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(globalIndex);
                          }}
                          className="inline-flex h-5 w-5 items-center justify-center rounded-full text-text-secondary hover:bg-gray-200"
                        >
                          {isExpanded ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        </button>
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
                          onSelect={() => {}}
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
                                    <button className="text-primary hover:underline">Manage Stock</button>
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
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </Card>
    </div>
  );
}
