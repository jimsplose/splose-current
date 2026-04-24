"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flex, Form, Input, Select } from "antd";
import { FormPage, Card, Grid, Toggle } from "@/components/ds";

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
  const [antForm] = Form.useForm();
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
          <Button onClick={() => router.push("/products")}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </>
      }
    >
      <Form form={antForm} layout="vertical">
        <Flex vertical gap={24}>
          <Card title="Product details">
            <Flex vertical gap={16}>
              <Form.Item label="Name">
                <Input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Code">
                <Input
                  value={form.code}
                  onChange={(e) => setField("code", e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Description">
                <Input.TextArea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Describe this product..."
                />
              </Form.Item>
            </Flex>
          </Card>

          <Card title="Pricing">
            <Grid cols={2} gap="md">
              <Form.Item label="Price">
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setField("price", e.target.value)}
                  placeholder="0.00"
                />
              </Form.Item>
              <Form.Item label="Tax rate">
                <Select
                  options={taxOptions}
                  value={form.taxRate}
                  onChange={(value) => setField("taxRate", value)}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Grid>
          </Card>

          <Card title="Settings">
            <Flex vertical gap={16}>
              <Form.Item label="Type">
                <Select
                  options={typeOptions}
                  value={form.type}
                  onChange={(value) => setField("type", value)}
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Toggle
                label="Track inventory"
                checked={form.trackInventory}
                onChange={(checked) => setField("trackInventory", checked)}
              />
            </Flex>
          </Card>
        </Flex>
      </Form>
    </FormPage>
  );
}
