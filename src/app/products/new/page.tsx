"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flex } from "antd";
import { Button, FormPage, Card, FormInput, FormSelect, FormTextarea, Grid, Toggle } from "@/components/ds";

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
    <FormPage
      backHref="/products"
      title="New product"
      maxWidth={768}
      actions={
        <>
          <Button variant="secondary" onClick={() => router.push("/products")}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </>
      }
    >
        <Flex vertical gap={24}>
          <Card title="Product details">
            <Flex vertical gap={16}>
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
            </Flex>
          </Card>

          <Card title="Pricing">
            <Grid cols={2} gap="md">
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
                onChange={(value) => setField("taxRate", value)}
              />
            </Grid>
          </Card>

          <Card title="Settings">
            <Flex vertical gap={16}>
              <FormSelect
                label="Type"
                options={typeOptions}
                value={form.type}
                onChange={(value) => setField("type", value)}
              />
              <Toggle
                label="Track inventory"
                checked={form.trackInventory}
                onChange={(checked) => setField("trackInventory", checked)}
              />
            </Flex>
          </Card>
        </Flex>
    </FormPage>
  );
}
