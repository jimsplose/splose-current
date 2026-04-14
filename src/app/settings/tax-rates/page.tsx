"use client";

import { useState } from "react";
import { Flex } from "antd";
import {
  Button,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
  Pagination,
  Modal,
  FormInput,
  PageHeader,
} from "@/components/ds";
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

export default function TaxRatesPage() {
  const [rates, setRates] = useState(initialRates);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(rates.length / pageSize);
  const pageItems = rates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
    <div style={{ padding: 24 }}>
      <PageHeader title="Tax rates">
        <Button variant="secondary" onClick={openCreate}>+ New tax rate</Button>
      </PageHeader>

      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Rate</Th>
        </TableHead>
        <TableBody>
          {pageItems.map((rate, i) => (
            <Tr key={rate.id}>
              <Td>
                <span className="text-text" style={{ fontWeight: 500 }}>{rate.name}</span>
              </Td>
              <Td>{rate.rate}</Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>

      <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={rates.length} itemsPerPage={pageSize} onPageChange={setCurrentPage} />

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
        <Flex vertical gap={16}>
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <FormInput label="Rate" value={form.rate} onChange={(e) => setField("rate", e.target.value)} placeholder="e.g. 10%" />
          <FormInput label="Description" value={form.description} onChange={(e) => setField("description", e.target.value)} />
        </Flex>
      </Modal>
    </div>
  );
}
