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
  Pagination,
  Dropdown,
  DropdownTriggerButton,
  Modal,
  FormInput,
} from "@/components/ds";
import { SIMPLE_CRUD } from "@/lib/dropdown-presets";
import { useFormModal } from "@/hooks/useFormModal";

interface TaxRate {
  id: number;
  name: string;
  rate: string;
  description: string;
  status: string;
}

const initialRates: TaxRate[] = [
  { id: 1, name: "GST", rate: "10%", description: "Goods and Services Tax", status: "Active" },
  { id: 2, name: "No tax", rate: "0%", description: "No tax applied", status: "Active" },
  { id: 3, name: "GST Free", rate: "0%", description: "GST Free supply", status: "Active" },
];

const ITEMS_PER_PAGE = 10;

export default function TaxRatesPage() {
  const [rates, setRates] = useState(initialRates);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(rates.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = rates.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const { modalOpen, isEditing, form, setField, openCreate, openEdit, closeModal, handleSave } =
    useFormModal<{ name: string; rate: string; description: string }>({
      defaults: { name: "", rate: "", description: "" },
      onSave: (values, index) => {
        if (index !== null) {
          setRates((prev) => prev.map((r, i) => (i === index ? { ...r, name: values.name, rate: values.rate, description: values.description } : r)));
        } else {
          const newId = Math.max(...rates.map((r) => r.id)) + 1;
          setRates((prev) => [...prev, { id: newId, name: values.name, rate: values.rate, description: values.description, status: "Active" }]);
        }
      },
    });

  function handleAction(value: string, rate: TaxRate, index: number) {
    if (value === "edit") openEdit(index, { name: rate.name, rate: rate.rate, description: rate.description });
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-display-lg text-text">Tax rates</h1>
        <Button variant="primary" onClick={openCreate}>+ New tax rate</Button>
      </div>

      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Rate</Th>
          <Th>Description</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </TableHead>
        <TableBody>
          {pageItems.map((rate, i) => (
            <tr key={rate.id} className="hover:bg-gray-50">
              <Td>
                <span className="font-medium text-text">{rate.name}</span>
              </Td>
              <Td>{rate.rate}</Td>
              <Td>{rate.description}</Td>
              <Td>
                <Badge variant="green">{rate.status}</Badge>
              </Td>
              <Td>
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={SIMPLE_CRUD}
                  onSelect={(value) => handleAction(value, rate, startIdx + i)}
                />
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={rates.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit tax rate" : "New tax rate"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <FormInput label="Rate" value={form.rate} onChange={(e) => setField("rate", e.target.value)} placeholder="e.g. 10%" />
          <FormInput label="Description" value={form.description} onChange={(e) => setField("description", e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
