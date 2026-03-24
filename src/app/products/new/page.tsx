"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Navbar, Card, FormInput, FormSelect, FormTextarea, Toggle } from "@/components/ds";

const taxOptions = [
  { value: "gst", label: "GST (10%)" },
  { value: "no-tax", label: "No tax" },
  { value: "gst-free", label: "GST Free" },
];

const typeOptions = [
  { value: "service", label: "Service" },
  { value: "product", label: "Product" },
  { value: "consumable", label: "Consumable" },
];

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    price: "",
    taxRate: "gst",
    type: "service",
    trackInventory: false,
  });

  const setField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    router.push("/products");
  };

  return (
    <div>
      <Navbar backHref="/products" title="New product">
        <Button variant="secondary" onClick={() => router.push("/products")}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Navbar>

      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <Card title="Product details">
          <div className="space-y-4">
            <FormInput
              label="Name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
            />
            <FormInput
              label="Code"
              value={form.code}
              onChange={(e) => setField("code", e.target.value)}
            />
            <FormTextarea
              label="Description"
              rows={3}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Describe this product..."
            />
          </div>
        </Card>

        <Card title="Pricing">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="Price"
              type="number"
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              placeholder="0.00"
            />
            <FormSelect
              label="Tax rate"
              options={taxOptions}
              value={form.taxRate}
              onChange={(e) => setField("taxRate", e.target.value)}
            />
          </div>
        </Card>

        <Card title="Settings">
          <div className="space-y-4">
            <FormSelect
              label="Type"
              options={typeOptions}
              value={form.type}
              onChange={(e) => setField("type", e.target.value)}
            />
            <Toggle
              label="Track inventory"
              checked={form.trackInventory}
              onChange={(checked) => setField("trackInventory", checked)}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
