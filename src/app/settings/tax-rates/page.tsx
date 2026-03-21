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

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Delete", value: "delete", danger: true },
];

export default function TaxRatesPage() {
  const [rates, setRates] = useState(initialRates);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formRate, setFormRate] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const totalPages = Math.ceil(rates.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = rates.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  function openCreate() {
    setEditingId(null);
    setFormName("");
    setFormRate("");
    setFormDescription("");
    setModalOpen(true);
  }

  function openEdit(rate: TaxRate) {
    setEditingId(rate.id);
    setFormName(rate.name);
    setFormRate(rate.rate);
    setFormDescription(rate.description);
    setModalOpen(true);
  }

  function handleSave() {
    if (editingId !== null) {
      setRates((prev) => prev.map((r) => (r.id === editingId ? { ...r, name: formName, rate: formRate, description: formDescription } : r)));
    } else {
      const newId = Math.max(...rates.map((r) => r.id)) + 1;
      setRates((prev) => [...prev, { id: newId, name: formName, rate: formRate, description: formDescription, status: "Active" }]);
    }
    setModalOpen(false);
  }

  function handleAction(value: string, rate: TaxRate) {
    if (value === "edit") openEdit(rate);
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
          {pageItems.map((rate) => (
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
                  items={dropdownItems}
                  onSelect={(value) => handleAction(value, rate)}
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
        onClose={() => setModalOpen(false)}
        title={editingId !== null ? "Edit tax rate" : "New tax rate"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Name" value={formName} onChange={(e) => setFormName(e.target.value)} />
          <FormInput label="Rate" value={formRate} onChange={(e) => setFormRate(e.target.value)} placeholder="e.g. 10%" />
          <FormInput label="Description" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
