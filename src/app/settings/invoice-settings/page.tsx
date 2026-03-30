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
  usePagination,
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

  const { paged: pageReminders, paginationProps: reminderPaginationProps } = usePagination(reminders, { pageKey: "/settings/invoice-items" });
  const { paged: pageTemplates, paginationProps: templatePaginationProps } = usePagination(templates, { pageKey: "/settings/invoice-templates" });

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
    <div style={{ padding: 24 }}>
      <h1 className="text-display-lg" style={{ marginBottom: 24 }}>Invoice Settings</h1>

      {/* Stripe info banner */}
      <Alert variant="info" icon={<InfoCircleOutlined style={{ fontSize: 16 }} />} className="mb-6">
        <p className="text-body-md text-text">
          You need an active Stripe connection for online payments.{" "}
          <a href="#" style={{ fontWeight: 500 }} className="text-primary hover:underline">
            Connect to Stripe
          </a>
        </p>
      </Alert>

      <div style={{ marginBottom: 32 }}>
        <Toggle
          checked={enableOnlinePayments}
          onChange={setEnableOnlinePayments}
          label="Enable online payments for invoices"
        />
      </div>

      {/* Invoice number */}
      <section style={{ marginBottom: 32 }}>
        <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>Invoice number</h2>
        <div style={{ maxWidth: 672 }}>
          <Flex vertical gap={16}>
            <FormInput label="Prefix" defaultValue="INV" />
            <FormInput label="Padding" defaultValue="6" />
            <FormInput label="Next invoice number" defaultValue="6309" />
          </Flex>
        </div>
      </section>

      {/* Credit note number */}
      <section style={{ marginBottom: 32 }}>
        <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>Credit note number</h2>
        <div style={{ maxWidth: 672 }}>
          <Flex vertical gap={16}>
            <FormInput label="Prefix" defaultValue="CR" />
            <FormInput label="Padding" defaultValue="6" />
            <FormInput label="Next credit note number" defaultValue="181" />
          </Flex>
        </div>
      </section>

      <hr className="my-8 border-green-600" />

      {/* Tax */}
      <section style={{ marginBottom: 32 }}>
        <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>Tax</h2>
        <div style={{ maxWidth: 672 }}>
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

      <hr className="my-8 border-green-600" />

      {/* Invoice reminders preferences */}
      <section style={{ marginBottom: 32 }}>
        <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>Invoice reminders preferences</h2>
        <div style={{ maxWidth: 672 }}>
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

      <hr className="my-8 border-green-600" />

      {/* Invoice reminders table */}
      <section style={{ marginBottom: 32 }}>
        <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>Invoice reminders</h2>

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
                    <CalendarOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary)' }} />
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

        <Pagination {...reminderPaginationProps} />

        <div style={{ marginTop: 16 }}>
          <Button variant="secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => openModal("reminder")}>
            + New invoice reminder
          </Button>
        </div>
      </section>

      <hr className="my-8 border-green-600" />

      {/* Invoice templates table */}
      <section style={{ marginBottom: 32 }}>
        <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>Invoice templates</h2>

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

        <Pagination {...templatePaginationProps} />

        <div style={{ marginTop: 16 }}>
          <Button variant="secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => openModal("template")}>
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
                <label className="text-label-lg" style={{ display: 'block', marginBottom: 4, color: 'var(--ant-color-text-secondary)' }}>Body</label>
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
