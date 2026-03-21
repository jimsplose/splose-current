"use client";

import { useState } from "react";
import {
  Button,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  Badge,
  FormInput,
  FormSelect,
  Pagination,
  Dropdown,
  DropdownTriggerButton,
  Modal,
} from "@/components/ds";

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

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Delete", value: "delete", danger: true },
];

export default function PaymentSettingsPage() {
  const [methods, setMethods] = useState(paymentMethods);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const totalPages = Math.ceil(methods.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = methods.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  function openCreate() {
    setEditingId(null);
    setFormName("");
    setFormDescription("");
    setModalOpen(true);
  }

  function openEdit(method: PaymentMethod) {
    setEditingId(method.id);
    setFormName(method.name);
    setFormDescription(method.description);
    setModalOpen(true);
  }

  function handleSave() {
    if (editingId !== null) {
      setMethods((prev) => prev.map((m) => (m.id === editingId ? { ...m, name: formName, description: formDescription } : m)));
    } else {
      const newId = Math.max(...methods.map((m) => m.id)) + 1;
      setMethods((prev) => [...prev, { id: newId, name: formName, description: formDescription, status: "Active" }]);
    }
    setModalOpen(false);
  }

  function handleAction(value: string, method: PaymentMethod) {
    if (value === "edit") openEdit(method);
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
            <input
              type="text"
              defaultValue="#8690FC"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
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
            {pageItems.map((method) => (
              <tr key={method.id} className="hover:bg-gray-50">
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
                    items={dropdownItems}
                    onSelect={(value) => handleAction(value, method)}
                  />
                </Td>
              </tr>
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
        onClose={() => setModalOpen(false)}
        title={editingId !== null ? "Edit payment method" : "New payment method"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Name" value={formName} onChange={(e) => setFormName(e.target.value)} />
          <FormInput label="Description" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
