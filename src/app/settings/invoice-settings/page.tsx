"use client";

import { useState, useCallback } from "react";
import { CalendarDays, Info } from "lucide-react";
import {
  Alert,
  Button,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  FormInput,
  FormSelect,
  Pagination,
  Toggle,
  Checkbox,
  Dropdown,
  DropdownTriggerButton,
  Modal,
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

const REMINDERS_PER_PAGE = 10;
const TEMPLATES_PER_PAGE = 10;

const templateDropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Delete", value: "delete", danger: true },
];

export default function InvoiceSettingsPage() {
  const [enableOnlinePayments, setEnableOnlinePayments] = useState(false);
  const [reminders, setReminders] = useState(invoiceReminders);
  const [templates, setTemplates] = useState(invoiceTemplates);
  const [reminderPage, setReminderPage] = useState(1);
  const [templatePage, setTemplatePage] = useState(1);
  const [modalType, setModalType] = useState<"reminder" | "template">("reminder");

  const reminderTotalPages = Math.ceil(reminders.length / REMINDERS_PER_PAGE);
  const reminderStartIdx = (reminderPage - 1) * REMINDERS_PER_PAGE;
  const pageReminders = reminders.slice(reminderStartIdx, reminderStartIdx + REMINDERS_PER_PAGE);

  const templateTotalPages = Math.ceil(templates.length / TEMPLATES_PER_PAGE);
  const templateStartIdx = (templatePage - 1) * TEMPLATES_PER_PAGE;
  const pageTemplates = templates.slice(templateStartIdx, templateStartIdx + TEMPLATES_PER_PAGE);

  const onSave = useCallback((values: { name: string }, index: number | null) => {
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

  const { modalOpen, isEditing, form, setField, openCreate: rawOpenCreate, openEdit, closeModal, handleSave } = useFormModal<{ name: string }>({
    defaults: { name: "" },
    onSave,
  });

  function openModal(type: "reminder" | "template", index?: number) {
    setModalType(type);
    if (index !== undefined) {
      const list = type === "reminder" ? reminders : templates;
      openEdit(index, { name: list[index].name });
    } else {
      rawOpenCreate();
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-display-lg text-text">Invoice Settings</h1>

      {/* Stripe info banner */}
      <Alert variant="info" icon={<Info className="h-4 w-4" />} className="mb-6">
        <p className="text-body-md text-text">
          You need an active Stripe connection for online payments.{" "}
          <a href="#" className="font-medium text-primary hover:underline">
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
        <div className="max-w-md space-y-4">
          <FormInput label="Prefix" defaultValue="INV" />
          <FormInput label="Padding" defaultValue="6" />
          <FormInput label="Next invoice number" defaultValue="6309" />
        </div>
      </section>

      {/* Credit note number */}
      <section className="mb-8">
        <h2 className="mb-4 text-heading-lg text-text">Credit note number</h2>
        <div className="max-w-md space-y-4">
          <FormInput label="Prefix" defaultValue="CR" />
          <FormInput label="Padding" defaultValue="6" />
          <FormInput label="Next credit note number" defaultValue="181" />
        </div>
      </section>

      <hr className="my-8 border-border" />

      {/* Tax */}
      <section className="mb-8">
        <h2 className="mb-4 text-heading-lg text-text">Tax</h2>
        <div className="max-w-md space-y-4">
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
        </div>
      </section>

      <hr className="my-8 border-border" />

      {/* Invoice reminders preferences */}
      <section className="mb-8">
        <h2 className="mb-4 text-heading-lg text-text">Invoice reminders preferences</h2>
        <div className="max-w-md space-y-4">
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
        </div>
      </section>

      <hr className="my-8 border-border" />

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
              <tr key={reminder.id} className="hover:bg-gray-50">
                <Td>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-text-secondary" />
                    <span className="text-text">{reminder.name}</span>
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center justify-end">
                    <Dropdown
                      align="right"
                      trigger={<DropdownTriggerButton />}
                      items={SIMPLE_CRUD}
                      onSelect={(value) => { if (value === "edit") openModal("reminder", reminderStartIdx + i); }}
                    />
                  </div>
                </Td>
              </tr>
            ))}
          </TableBody>
        </DataTable>

        <Pagination
          currentPage={reminderPage}
          totalPages={reminderTotalPages}
          totalItems={reminders.length}
          itemsPerPage={REMINDERS_PER_PAGE}
          onPageChange={setReminderPage}
        />

        <div className="mt-4">
          <Button variant="secondary" className="w-full justify-center" onClick={() => openModal("reminder")}>
            + New invoice reminder
          </Button>
        </div>
      </section>

      <hr className="my-8 border-border" />

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
              <tr key={template.id} className="hover:bg-gray-50">
                <Td>
                  <span className="text-text">{template.name}</span>
                </Td>
                <Td>
                  <div className="flex items-center justify-end">
                    <Dropdown
                      align="right"
                      trigger={<DropdownTriggerButton />}
                      items={templateDropdownItems}
                      onSelect={(value) => { if (value === "edit") openModal("template", templateStartIdx + i); }}
                    />
                  </div>
                </Td>
              </tr>
            ))}
          </TableBody>
        </DataTable>

        <Pagination
          currentPage={templatePage}
          totalPages={templateTotalPages}
          totalItems={templates.length}
          itemsPerPage={TEMPLATES_PER_PAGE}
          onPageChange={setTemplatePage}
        />

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
        <div className="space-y-4">
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
