import { Plus } from "lucide-react";

const mockProducts = [
  { name: "Balance ball", category: "Physiotherapy", vendor: "", stock: 141 },
  { name: "Roller", category: "Roller", vendor: "", stock: 5 },
  { name: "Train", category: "transport", vendor: "Tesla", stock: 14 },
  { name: "test add op", category: "", vendor: "", stock: null },
  { name: "Copy of test add op", category: "", vendor: "", stock: 1 },
  { name: "Copy of Roller", category: "Roller", vendor: "", stock: null },
  { name: "Test", category: "", vendor: "", stock: null },
  { name: "Crystal", category: "", vendor: "", stock: null },
  { name: "Grippy socks", category: "Support Item", vendor: "", stock: 16 },
  { name: "Test", category: "", vendor: "", stock: null },
];

export default function ProductsPage() {
  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Products</h1>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Display archived products
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            <Plus className="h-4 w-4" />
            New product
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search for product by name"
          className="h-10 flex-1 rounded-lg border border-border bg-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          Search
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-purple-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Vendor</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text">Stock</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockProducts.map((product, idx) => (
              <tr key={idx} className="cursor-pointer transition-colors hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-text-secondary">+</span>
                    <span className="text-text">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">{product.category}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{product.vendor}</td>
                <td className="px-4 py-3 text-right text-sm text-text-secondary">
                  {product.stock !== null ? product.stock : "-"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-text-secondary hover:text-text">...</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
          <span>1-10 of 24 items</span>
          <div className="ml-4 flex items-center gap-1">
            <span>&lt;</span>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">1</button>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary">2</button>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary">3</button>
            <span>&gt;</span>
          </div>
          <span className="ml-4">10 / page</span>
        </div>
      </div>
    </div>
  );
}
