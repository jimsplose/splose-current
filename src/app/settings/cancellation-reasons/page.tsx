"use client";

import { useState } from "react";
import { Flex } from "antd";
import {
  Button,
  Badge,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
  Pagination,
  Dropdown,
  DropdownTriggerButton,
  Modal,
  FormInput,
  FormSelect,
  Toggle,
} from "@/components/ds";
import { SIMPLE_CRUD } from "@/lib/dropdown-presets";
import { useFormModal } from "@/hooks/useFormModal";

interface CancellationReason {
  name: string;
  code: string;
}

const initialReasons: CancellationReason[] = [
  { name: "Condition betteryyy", code: "" },
  { name: "Condition worse", code: "TEST" },
  { name: "Sick", code: "500" },
  { name: "No show due to health reason", code: "NSDH" },
  { name: "No show due to family issues", code: "NSDF" },
  { name: "No show due to unavailability of transport", code: "NSDT" },
  { name: "Cancelled 1", code: "" },
  { name: "No Show - sick", code: "" },
  { name: "Cancel", code: "CANCEL" },
  { name: "No show less than 2 days", code: "" },
];

export default function CancellationReasonsPage() {
  const [reasons, setReasons] = useState(initialReasons);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(reasons.length / pageSize);
  const paged = reasons.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const cancellationWindowOptions = [
    { value: "1h", label: "1 hour" },
    { value: "2h", label: "2 hours" },
    { value: "4h", label: "4 hours" },
    { value: "12h", label: "12 hours" },
    { value: "24h", label: "24 hours" },
    { value: "48h", label: "48 hours" },
  ];

  const { modalOpen, isEditing, form, setField, openCreate, openEdit, closeModal, handleSave } =
    useFormModal<{
      name: string;
      code: string;
      allowCancelOnline: boolean;
      cancellationWindow: string;
      allowRescheduleOnline: boolean;
      reschedulingWindow: string;
    }>({
      defaults: {
        name: "",
        code: "",
        allowCancelOnline: false,
        cancellationWindow: "24h",
        allowRescheduleOnline: false,
        reschedulingWindow: "24h",
      },
      onSave: (values, index) => {
        if (index !== null) {
          setReasons((prev) => prev.map((r, i) => (i === index ? { name: values.name, code: values.code } : r)));
        } else {
          setReasons((prev) => [...prev, { name: values.name, code: values.code }]);
        }
      },
    });

  function handleAction(value: string, index: number) {
    if (value === "edit") openEdit(index, {
      ...reasons[index],
      allowCancelOnline: false,
      cancellationWindow: "24h",
      allowRescheduleOnline: false,
      reschedulingWindow: "24h",
    });
  }

  return (
    <div style={{ padding: 32 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <h1 className="text-display-lg">Cancellation reasons</h1>
        <Flex align="center" gap={8}>
          <Button variant="secondary">Show archived</Button>
          <Button variant="secondary" onClick={openCreate}>+ New reason</Button>
        </Flex>
      </Flex>
      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Code</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {paged.map((r, i) => (
            <Tr key={i}>
              <Td className="text-text">{r.name}</Td>
              <Td>{r.code ? <Badge variant="gray">{r.code}</Badge> : ""}</Td>
              <Td align="right">
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={SIMPLE_CRUD}
                  onSelect={(value) => handleAction(value, i)}
                />
              </Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>

      <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={reasons.length} itemsPerPage={pageSize} onPageChange={setCurrentPage} showPageSize={false} />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit cancellation reason" : "New cancellation reason"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <Flex vertical gap={16}>
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <FormInput label="Code" value={form.code} onChange={(e) => setField("code", e.target.value)} placeholder="Optional" />
        </Flex>

        <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--ant-color-border)' }}>
          <h3 className="text-heading-md text-text" style={{ marginBottom: 16 }}>Cancellation rules</h3>
          <Flex vertical gap={16}>
            <Toggle
              label="Allow clients to cancel online"
              checked={form.allowCancelOnline}
              onChange={(checked) => setField("allowCancelOnline", checked)}
            />
            {form.allowCancelOnline && (
              <FormSelect
                label="Cancellation window"
                options={cancellationWindowOptions}
                value={form.cancellationWindow}
                onChange={(value) => setField("cancellationWindow", value)}
              />
            )}
            <Toggle
              label="Allow clients to reschedule online"
              checked={form.allowRescheduleOnline}
              onChange={(checked) => setField("allowRescheduleOnline", checked)}
            />
            {form.allowRescheduleOnline && (
              <FormSelect
                label="Rescheduling window"
                options={cancellationWindowOptions}
                value={form.reschedulingWindow}
                onChange={(value) => setField("reschedulingWindow", value)}
              />
            )}
          </Flex>
        </div>
      </Modal>
    </div>
  );
}
