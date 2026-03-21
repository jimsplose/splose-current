"use client";

import { useState } from "react";
import { CalendarDays, Info } from "lucide-react";
import {
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
  Dropdown,
  DropdownTriggerButton,
  Modal,
} from "@/components/ds";

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

const reminderDropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Delete", value: "delete", danger: true },
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
  const [reminderPage, setReminderPage] = useState(1);
  const [templatePage, setTemplatePage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"reminder" | "template">("reminder");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");

  const reminderTotalPages = Math.ceil(reminders.length / REMINDERS_PER_PAGE);
  const reminderStartIdx = (reminderPage - 1) * REMINDERS_PER_PAGE;
  const pageReminders = reminders.slice(reminderStartIdx, reminderStartIdx + REMINDERS_PER_PAGE);

  const templateTotalPages = Math.ceil(templates.length / TEMPLATES_PER_PAGE);
  const templateStartIdx = (templatePage - 1) * TEMPLATES_PER_PAGE;
  const pageTemplates = templates.slice(templateStartIdx, templateStartIdx + TEMPLATES_PER_PAGE);

  function openModal(type: "reminder" | "template", id?: number) {
    setModalType(type);
    setEditingId(id ?? null);
    const list = type === "reminder" ? reminders : templates;
    const item = id !== undefined ? list.find((i) => i.id === id) : null;
    setFormName(item?.name ?? "");
    setModalOpen(true);
  }

  function handleSave() {
    if (modalType === "reminder") {
      if (editingId !== null) {
        setReminders((prev) => prev.map((r) => (r.id === editingId ? { ...r, name: formName } : r)));
      } else {
        const newId = Math.max(0, ...reminders.map((r) => r.id)) + 1;
        setReminders((prev) => [...prev, { id: newId, name: formName }]);
      }
    } else {
      if (editingId !== null) {
        setTemplates((prev) => prev.map((t) => (t.id === editingId ? { ...t, name: formName } : t)));
      } else {
        const newId = Math.max(0, ...templates.map((t) => t.id)) + 1;
        setTemplates((prev) => [...prev, { id: newId, name: formName }]);
      }
    }
    setModalOpen(false);
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-display-lg text-text">Invoice Settings</h1>

      {/* Stripe info banner */}
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
        <div>
          <p className="text-body-md text-text">
            You need an active Stripe connection for online payments.{" "}
            <a href="#" className="font-medium text-primary hover:underline">
              Connect to Stripe
            </a>
          </p>
        </div>
      </div>

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
          <label className="flex items-start gap-2 text-body-md text-text">
            <input type="checkbox" className="mt-0.5 rounded border-border" defaultChecked />
            <span>
              Apply to all existing clients and override the current invoice reminder preferences.
            </span>
          </label>
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
            {pageReminders.map((reminder) => (
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
                      items={reminderDropdownItems}
                      onSelect={(value) => { if (value === "edit") openModal("reminder", reminder.id); }}
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
            {pageTemplates.map((template) => (
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
                      onSelect={(value) => { if (value === "edit") openModal("template", template.id); }}
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
        onClose={() => setModalOpen(false)}
        title={
          editingId !== null
            ? `Edit ${modalType === "reminder" ? "invoice reminder" : "invoice template"}`
            : `New ${modalType === "reminder" ? "invoice reminder" : "invoice template"}`
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Name" value={formName} onChange={(e) => setFormName(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
