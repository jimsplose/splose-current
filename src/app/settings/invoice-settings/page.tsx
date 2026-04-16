"use client";

import { useState, useCallback } from "react";
import { Flex } from "antd";
import { CalendarOutlined, InfoCircleOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
  FormInput,
  FormSelect,
  FormTextarea,
  Pagination,
  Toggle,
  Checkbox,
  Dropdown,
  DropdownTriggerButton,
  Modal,
  RichTextEditor,
  PageHeader,
} from "@/components/ds";
import { SIMPLE_CRUD } from "@/lib/dropdown-presets";
import { useFormModal } from "@/hooks/useFormModal";

const invoiceReminders = [
  { id: 1, name: "Due in 1 day" },
  { id: 2, name: "1 day overdue" },
  { id: 3, name: "2 days overdue" },
  { id: 4, name: "3 days overdue" },
  { id: 5, name: "4 days overdue" },
  { id: 6, name: "10 days overdue" },
  { id: 7, name: "14 days overdue" },
];

const invoiceTemplates = [
  { id: 1, name: "Standard" },
  { id: 2, name: "Non standard" },
  { id: 3, name: "OT - Initial Consult" },
  { id: 4, name: "Invoice Template Demo" },
  { id: 5, name: "What's Back Saving Garbage Can Remedy" },
  { id: 6, name: "Brain Wave Therapy Pty Ltd" },
  { id: 7, name: "Display everything" },
  { id: 8, name: "Check" },
  { id: 9, name: "{client_name}" },
  { id: 10, name: "Test Invoice" },
];

const templateDropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Delete", value: "delete", danger: true },
];

export default function InvoiceSettingsPage() {
  const [enableOnlinePayments, setEnableOnlinePayments] = useState(false);
  const [reminders, setReminders] = useState(invoiceReminders);
  const [templates, setTemplates] = useState(invoiceTemplates);
  const [modalType, setModalType] = useState<"reminder" | "template">("reminder");

  const [reminderPage, setReminderPage] = useState(1);
  const [templatePage, setTemplatePage] = useState(1);
  const pageSize = 10;
  const reminderTotalPages = Math.ceil(reminders.length / pageSize);
  const pageReminders = reminders.slice((reminderPage - 1) * pageSize, reminderPage * pageSize);
  const templateTotalPages = Math.ceil(templates.length / pageSize);
  const pageTemplates = templates.slice((templatePage - 1) * pageSize, templatePage * pageSize);

  const onSave = useCallback((values: { name: string; subject: string; body: string; sendTiming: string }, index: number | null) => {
    if (modalType === "reminder") {
      if (index !== null) {
        setReminders((prev) => prev.map((r, i) => (i === index ? { ...r, name: values.name } : r)));
      } else {
        const newId = Math.max(0, ...reminders.map((r) => r.id)) + 1;
        setReminders((prev) => [...prev, { id: newId, name: values.name }]);
      }
    } else {
      if (index !== null) {
        setTemplates((prev) => prev.map((t, i) => (i === index ? { ...t, name: values.name } : t)));
      } else {
        const newId = Math.max(0, ...templates.map((t) => t.id)) + 1;
        setTemplates((prev) => [...prev, { id: newId, name: values.name }]);
      }
    }
  }, [modalType, reminders, templates]);

  const { modalOpen, isEditing, form, setField, openCreate: rawOpenCreate, openEdit, closeModal, handleSave } = useFormModal<{ name: string; subject: string; body: string; sendTiming: string }>({
    defaults: { name: "", subject: "", body: "", sendTiming: "on-due-date" },
    onSave,
  });

  function openModal(type: "reminder" | "template", index?: number) {
    setModalType(type);
    if (index !== undefined) {
      const list = type === "reminder" ? reminders : templates;
      openEdit(index, { name: list[index].name, subject: "Invoice reminder: {invoice_number}", body: "Hi {client_name},\n\nThis is a reminder that invoice {invoice_number} for {amount_owing} is due on {due_date}.\n\nPlease make payment at your earliest convenience.\n\nRegards,\n{practice_name}", sendTiming: "on-due-date" });
    } else {
      rawOpenCreate();
    }
  }

  return (
    <div className="p-6">
      <PageHeader title="Invoice Settings" />

      {/* Stripe info banner */}
      <Alert variant="info" icon={<InfoCircleOutlined style={{ fontSize: 16 }} />} className="mb-6">
        <p className="text-body-md text-text">
          You need an active Stripe connection for online payments.{" "}
          <a href="#" style={{ fontWeight: 500 }} className="text-primary">
            Connect to Stripe
          </a>
        </p>
      </Alert>

      <div className="mb-8">
        <Toggle
          checked={enableOnlinePayments}
          onChange={setEnableOnlinePayments}
          label="Enable online payments for invoices"
        />
      </div>

      {/* Invoice number */}
      <section className="mb-8">
        <h2 className="mb-4 text-heading-lg text-text">Invoice number</h2>
        <div className="max-w-[672px]">
          <Flex vertical gap={16}>
            <FormInput label="Prefix" defaultValue="INV" />
            <FormInput label="Padding" defaultValue="6" />
            <FormInput label="Next invoice number" defaultValue="6309" />
          </Flex>
        </div>
      </section>

      {/* Credit note number */}
      <section className="mb-8">
        <h2 className="mb-4 text-heading-lg text-text">Credit note number</h2>
        <div className="max-w-[672px]">
          <Flex vertical gap={16}>
            <FormInput label="Prefix" defaultValue="CR" />
            <FormInput label="Padding" defaultValue="6" />
            <FormInput label="Next credit note number" defaultValue="181" />
          </Flex>
        </div>
      </section>

      <hr className="my-8" style={{ borderColor: '#16a34a' }} />

      {/* Tax */}
      <section className="mb-8">
        <h2 className="mb-4 text-heading-lg text-text">Tax</h2>
        <div className="max-w-[672px]">
          <Flex vertical gap={16}>
            <FormSelect
              label="Default tax"
              options={[
                { value: "exclusive", label: "Tax exclusive" },
                { value: "inclusive", label: "Tax inclusive" },
                { value: "none", label: "No tax" },
              ]}
              defaultValue="exclusive"
            />
            <FormSelect
              label="Tax rate"
              options={[
                { value: "gst", label: "GST (10%)" },
                { value: "no-tax", label: "No tax (0%)" },
                { value: "gst-free", label: "GST Free (0%)" },
              ]}
              defaultValue="gst"
            />
          </Flex>
        </div>
      </section>

      <hr className="my-8" style={{ borderColor: '#16a34a' }} />

      {/* Invoice reminders preferences */}
      <section className="mb-8">
        <h2 className="mb-4 text-heading-lg text-text">Invoice reminders preferences</h2>
        <div className="max-w-[672px]">
          <Flex vertical gap={16}>
            <FormSelect
              label="Default invoice reminder preferences"
              options={[
                { value: "on", label: "On" },
                { value: "off", label: "Off" },
              ]}
              defaultValue="on"
            />
            <Checkbox
              label="Apply to all existing clients and override the current invoice reminder preferences."
              defaultChecked
            />
            <FormInput
              label="Don't send reminders for amounts owing on an invoice under"
              defaultValue=""
              placeholder="0"
            />
          </Flex>
        </div>
      </section>

      <hr className="my-8" style={{ borderColor: '#16a34a' }} />

      {/* Invoice reminders table */}
      <section className="mb-8">
        <h2 className="mb-4 text-heading-lg text-text">Invoice reminders</h2>

        <DataTable>
          <TableHead>
            <Th>Name</Th>
            <Th>Actions</Th>
          </TableHead>
          <TableBody>
            {pageReminders.map((reminder, i) => (
              <Tr key={reminder.id}>
                <Td>
                  <Flex align="center" gap={8}>
                    <CalendarOutlined style={{ fontSize: 16, color: 'var(--color-text-secondary)' }} />
                    <span className="text-text">{reminder.name}</span>
                  </Flex>
                </Td>
                <Td>
                  <Flex align="center" justify="flex-end">
                    <Dropdown
                      align="right"
                      trigger={<DropdownTriggerButton />}
                      items={SIMPLE_CRUD}
                      onSelect={(value) => { if (value === "edit") openModal("reminder", reminders.indexOf(reminder)); }}
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}
          </TableBody>
        </DataTable>

        <Pagination currentPage={reminderPage} totalPages={reminderTotalPages} totalItems={reminders.length} itemsPerPage={pageSize} onPageChange={setReminderPage} />

        <div className="mt-4">
          <Button variant="secondary" className="w-full justify-center" onClick={() => openModal("reminder")}>
            + New invoice reminder
          </Button>
        </div>
      </section>

      <hr className="my-8" style={{ borderColor: '#16a34a' }} />

      {/* Invoice templates table */}
      <section className="mb-8">
        <h2 className="mb-4 text-heading-lg text-text">Invoice templates</h2>

        <DataTable>
          <TableHead>
            <Th>Name</Th>
            <Th>Actions</Th>
          </TableHead>
          <TableBody>
            {pageTemplates.map((template, i) => (
              <Tr key={template.id}>
                <Td>
                  <span className="text-text">{template.name}</span>
                </Td>
                <Td>
                  <Flex align="center" justify="flex-end">
                    <Dropdown
                      align="right"
                      trigger={<DropdownTriggerButton />}
                      items={templateDropdownItems}
                      onSelect={(value) => { if (value === "edit") openModal("template", templates.indexOf(template)); }}
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}
          </TableBody>
        </DataTable>

        <Pagination currentPage={templatePage} totalPages={templateTotalPages} totalItems={templates.length} itemsPerPage={pageSize} onPageChange={setTemplatePage} />

        <div className="mt-4">
          <Button variant="secondary" className="w-full justify-center" onClick={() => openModal("template")}>
            + Add invoice template
          </Button>
        </div>
      </section>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          isEditing
            ? `Edit ${modalType === "reminder" ? "invoice reminder" : "invoice template"}`
            : `New ${modalType === "reminder" ? "invoice reminder" : "invoice template"}`
        }
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <Flex vertical gap={16}>
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />

          {modalType === "reminder" && (
            <>
              <FormSelect
                label="Send"
                value={form.sendTiming}
                onChange={(value) => setField("sendTiming", value)}
                options={[
                  { value: "on-due-date", label: "On due date" },
                  { value: "1-day-before", label: "1 day before" },
                  { value: "3-days-after", label: "3 days after" },
                  { value: "7-days-after", label: "7 days after" },
                  { value: "14-days-after", label: "14 days after" },
                ]}
              />
              <FormInput label="Subject" value={form.subject} onChange={(e) => setField("subject", e.target.value)} />
              <div>
                <label className="block mb-1 text-label-lg" style={{ color: 'var(--color-text-secondary)' }}>Body</label>
                <RichTextEditor
                  value={form.body}
                  onChange={(html) => setField("body", html)}
                  rows={8}
                  variables={["client_name", "invoice_number", "amount_owing", "due_date", "practice_name"]}
                />
              </div>
            </>
          )}
        </Flex>
      </Modal>
    </div>
  );
}
