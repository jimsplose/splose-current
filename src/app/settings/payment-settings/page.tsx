"use client";

import { useState } from "react";
import {
  Button,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
  Badge,
  FormInput,
  FormSelect,
  Pagination,
  Dropdown,
  DropdownTriggerButton,
  Modal,
} from "@/components/ds";
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

const ITEMS_PER_PAGE = 10;

export default function PaymentSettingsPage() {
  const [methods, setMethods] = useState(paymentMethods);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(methods.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = methods.slice(startIdx, startIdx + ITEMS_PER_PAGE);

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

  function handleAction(value: string, index: number) {
    if (value === "edit") {
      const method = methods[index];
      openEdit(index, { name: method.name, description: method.description });
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-display-lg text-text">Payment settings</h1>

      {/* Next payment number */}
      <section className="mb-8">
        <h2 className="mb-4 text-heading-lg text-text">Next payment number</h2>
        <div className="max-w-md space-y-4">
          <FormInput label="Prefix" defaultValue="MYDD" />
          <FormInput label="Padding" defaultValue="5" />
        </div>
      </section>

      {/* PDF settings */}
      <section className="mb-8">
        <h2 className="mb-4 text-heading-lg text-text">PDF settings</h2>
        <div className="max-w-md">
          <label className="mb-1 block text-label-lg text-text-secondary">
            Brand colour
          </label>
          <div className="mb-4 flex items-center gap-3">
            <div
              className="h-10 w-10 rounded border border-border"
              style={{ backgroundColor: "#8690FC" }}
            />
            <FormInput
              type="text"
              defaultValue="#8690FC"
            />
          </div>
          <Button variant="primary" size="sm">
            Save
          </Button>
        </div>
      </section>

      <hr className="my-8 border-border" />

      {/* Accepted forms of payment */}
      <section className="mb-8">
        <h2 className="mb-4 text-heading-lg text-text">Accepted forms of payment</h2>

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
                  <span className="font-medium text-text">{method.name}</span>
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
                    onSelect={(value) => handleAction(value, startIdx + i)}
                  />
                </Td>
              </Tr>
            ))}
          </TableBody>
        </DataTable>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={paymentMethods.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />

        <div className="mt-4">
          <Button variant="secondary" onClick={openCreate}>+ Add payment method</Button>
        </div>
      </section>

      <hr className="my-8 border-border" />

      {/* NDIS bulk upload */}
      <section className="mb-8">
        <h2 className="mb-4 text-heading-lg text-text">NDIS bulk upload</h2>
        <div className="max-w-md space-y-4">
          <FormSelect
            label="Payment method *"
            options={methods.map((m) => ({
              value: String(m.id),
              label: m.name,
            }))}
            defaultValue="1"
          />
          <Button variant="primary" size="sm">
            Save changes
          </Button>
        </div>
      </section>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit payment method" : "New payment method"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <FormInput label="Description" value={form.description} onChange={(e) => setField("description", e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
