"use client";

import { useState } from "react";
import { Button, Flex } from "antd";
import { DataTable, TableHead, Th, TableBody, Tr, Td, Badge, FormInput, FormSelect, Pagination, Dropdown, DropdownTriggerButton, Modal, PageHeader } from "@/components/ds";
import FormLabel from "@/components/ds/FormLabel";
import { SIMPLE_CRUD } from "@/lib/dropdown-presets";
import { useFormModal } from "@/hooks/useFormModal";

interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  status: string;
}

const paymentMethods: PaymentMethod[] = [
  { id: 1, name: "Credit Card", description: "stripe payment", status: "Active" },
  { id: 2, name: "EFTPOS", description: "", status: "Active" },
  { id: 3, name: "Medicare", description: "", status: "Active" },
  { id: 4, name: "HICAPS", description: "", status: "Active" },
  { id: 5, name: "Cash", description: "Pay by cash", status: "Active" },
  { id: 6, name: "Bank Transfer (Xero)", description: "", status: "Active" },
  { id: 7, name: "DVA", description: "", status: "Active" },
  { id: 8, name: "Other", description: "", status: "Active" },
  { id: 9, name: "CC", description: "Credit Card", status: "Active" },
  { id: 10, name: "PE CC", description: "PE Credit Card", status: "Active" },
];

const PAYMENT_TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: "Credit Card", value: "Credit Card" },
  { label: "EFTPOS", value: "EFTPOS" },
  { label: "Medicare", value: "Medicare" },
  { label: "HICAPS", value: "HICAPS" },
  { label: "Cash", value: "Cash" },
  { label: "Bank Transfer", value: "Bank Transfer" },
  { label: "DVA", value: "DVA" },
];

export default function PaymentSettingsPage() {
  const [methods, setMethods] = useState(paymentMethods);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(methods.length / pageSize);
  const pageItems = methods.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const { modalOpen, isEditing, form, setField, openCreate, openEdit, closeModal, handleSave } = useFormModal<{ name: string; description: string }>({
    defaults: { name: "", description: "" },
    onSave: (values, index) => {
      if (index !== null) {
        setMethods((prev) => prev.map((m, i) => (i === index ? { ...m, name: values.name, description: values.description } : m)));
      } else {
        const newId = Math.max(...methods.map((m) => m.id)) + 1;
        setMethods((prev) => [...prev, { id: newId, name: values.name, description: values.description, status: "Active" }]);
      }
    },
  });

  function handleAddPaymentType(value: string) {
    const newId = Math.max(...methods.map((m) => m.id)) + 1;
    setMethods((prev) => [...prev, { id: newId, name: value, description: "", status: "Active" }]);
  }

  function handleAction(value: string, index: number) {
    if (value === "edit") {
      const method = methods[index];
      openEdit(index, { name: method.name, description: method.description });
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Payment settings" />

      {/* Next payment number */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Next payment number</h2>
        <Flex vertical gap={16} style={{ maxWidth: 672 }}>
          <FormInput label="Prefix" defaultValue="MYDD" />
          <FormInput label="Padding" defaultValue="5" />
        </Flex>
      </section>

      {/* PDF settings */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>PDF settings</h2>
        <div style={{ maxWidth: 672 }}>
          <FormLabel size="small" style={{ color: 'var(--color-text-secondary)' }}>
            Brand colour
          </FormLabel>
          <Flex align="center" gap={12} style={{ marginBottom: 16 }}>
            <div
              style={{ height: 40, width: 40, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: "#8690FC" }}
            />
            <FormInput
              type="text"
              defaultValue="#8690FC"
            />
          </Flex>
          <Button type="primary" size="small">
            Save
          </Button>
        </div>
      </section>

      <hr style={{ margin: '32px 0', borderColor: '#16a34a' }} />

      {/* Accepted forms of payment */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Accepted forms of payment</h2>

        <DataTable>
          <TableHead>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </TableHead>
          <TableBody>
            {pageItems.map((method, i) => (
              <Tr key={method.id}>
                <Td>
                  <span style={{ fontWeight: 500 }}>{method.name}</span>
                </Td>
                <Td>{method.description}</Td>
                <Td>
                  <Badge variant="green">{method.status}</Badge>
                </Td>
                <Td>
                  <Dropdown
                    align="right"
                    trigger={<DropdownTriggerButton />}
                    items={SIMPLE_CRUD}
                    onSelect={(value) => handleAction(value, methods.indexOf(method))}
                  />
                </Td>
              </Tr>
            ))}
          </TableBody>
        </DataTable>

        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={methods.length} itemsPerPage={pageSize} onPageChange={setCurrentPage} />

        <div style={{ marginTop: 16 }}>
          <Dropdown
            trigger={<Button>+ Add payment method</Button>}
            items={PAYMENT_TYPE_OPTIONS}
            onSelect={handleAddPaymentType}
          />
        </div>
      </section>

      <hr style={{ margin: '32px 0', borderColor: '#16a34a' }} />

      {/* NDIS bulk upload */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>NDIS bulk upload</h2>
        <Flex vertical gap={16} style={{ maxWidth: 672 }}>
          <FormSelect
            label="Payment method *"
            options={methods.map((m) => ({
              value: String(m.id),
              label: m.name,
            }))}
            defaultValue="1"
          />
          <Button type="primary" size="small">
            Save changes
          </Button>
        </Flex>
      </section>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit payment method" : "New payment method"}
        footer={
          <>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>{isEditing ? "Edit" : "Create"}</Button>
          </>
        }
      >
        <Flex vertical gap={16}>
          <FormInput label="Name *" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <FormInput label="Description" value={form.description} onChange={(e) => setField("description", e.target.value)} />
        </Flex>
      </Modal>
    </div>
  );
}
