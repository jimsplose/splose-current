"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Plus, Trash2, Eye, Share2, Settings, Type, Hash, Calendar, ToggleLeft, List, FileText, Upload } from "lucide-react";
import {
  Button,
  FormInput,
  FormSelect,
  Tab,
  Navbar,
  Card,
  Toggle,
  FormColorPicker,
  FormTextarea,
  Modal,
  RichTextEditor,
} from "@/components/ds";

const FIELD_TYPES = [
  { icon: Type, label: "Short text", value: "short-text" },
  { icon: FileText, label: "Long text", value: "long-text" },
  { icon: Hash, label: "Number", value: "number" },
  { icon: Calendar, label: "Date", value: "date" },
  { icon: ToggleLeft, label: "Yes/No", value: "boolean" },
  { icon: List, label: "Multiple choice", value: "multiple-choice" },
  { icon: List, label: "Dropdown", value: "dropdown" },
  { icon: Upload, label: "File upload", value: "file-upload" },
];

interface FormField {
  id: number;
  type: string;
  label: string;
  required: boolean;
}

const editorTabs = [
  { label: "Builder", value: "builder" },
  { label: "Settings", value: "settings" },
  { label: "Preview", value: "preview" },
];

export default function FormTemplateEditorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("builder");
  const [title, setTitle] = useState("Client intake form");
  const [fields, setFields] = useState<FormField[]>([
    { id: 1, type: "short-text", label: "Full name", required: true },
    { id: 2, type: "date", label: "Date of birth", required: true },
    { id: 3, type: "short-text", label: "Phone number", required: true },
    { id: 4, type: "short-text", label: "Email address", required: true },
    { id: 5, type: "long-text", label: "Reason for visit", required: false },
    { id: 6, type: "multiple-choice", label: "How did you hear about us?", required: false },
    { id: 7, type: "boolean", label: "Do you have a referral?", required: false },
    { id: 8, type: "file-upload", label: "Upload referral document", required: false },
  ]);
  const [showAddField, setShowAddField] = useState(false);
  const [themeColor, setThemeColor] = useState("#7c3aed");
  const [headerImage, setHeaderImage] = useState(false);
  const [completionMessage, setCompletionMessage] = useState("Thank you for completing this form. Your information has been securely submitted.");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [sidePanel, setSidePanel] = useState<"share" | null>(null);

  function addField(type: string) {
    const typeLabel = FIELD_TYPES.find((t) => t.value === type)?.label || type;
    setFields((prev) => [...prev, { id: Date.now(), type, label: `New ${typeLabel} field`, required: false }]);
    setShowAddField(false);
  }

  function removeField(id: number) {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar backHref="/settings/forms" title={title || "Edit form template"}>
        <div className="flex items-center gap-2">
          <Button variant="icon" onClick={() => setSidePanel(sidePanel === "share" ? null : "share")} title="Share & Automate">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="secondary" onClick={() => setActiveTab("preview")}>
            <Eye className="h-4 w-4" /> Preview
          </Button>
          <Button variant="primary" onClick={() => router.push("/settings/forms")}>Save</Button>
        </div>
      </Navbar>

      <div className="border-b border-border px-6">
        <Tab items={editorTabs} value={activeTab} onChange={setActiveTab} />
      </div>

      <div className="flex flex-1">
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "builder" && (
            <div className="mx-auto max-w-2xl space-y-3">
              <FormInput label="Form title" value={title} onChange={(e) => setTitle(e.target.value)} className="mb-4" />

              {fields.map((field) => {
                const FieldIcon = FIELD_TYPES.find((t) => t.value === field.type)?.icon || Type;
                return (
                  <Card key={field.id} padding="none" className="group">
                    <div className="flex items-center gap-2 px-4 py-3">
                      <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-text-secondary" />
                      <FieldIcon className="h-4 w-4 shrink-0 text-primary" />
                      <input
                        className="flex-1 border-none bg-transparent text-body-md text-text outline-none"
                        value={field.label}
                        onChange={(e) => setFields((prev) => prev.map((f) => f.id === field.id ? { ...f, label: e.target.value } : f))}
                      />
                      <Toggle checked={field.required} onChange={(checked) => setFields((prev) => prev.map((f) => f.id === field.id ? { ...f, required: checked } : f))} label="Required" />
                      <button onClick={() => removeField(field.id)} className="rounded p-1 text-text-secondary opacity-0 group-hover:opacity-100 hover:text-danger">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </Card>
                );
              })}

              <Button variant="secondary" onClick={() => setShowAddField(true)}>
                <Plus className="h-4 w-4" /> Add field
              </Button>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="mx-auto max-w-2xl space-y-6">
              <div>
                <h3 className="mb-3 text-heading-md text-text">Design</h3>
                <div className="space-y-4">
                  <FormColorPicker label="Theme colour" value={themeColor} onChange={setThemeColor} />
                  <Toggle label="Show header image" checked={headerImage} onChange={setHeaderImage} />
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-heading-md text-text">Form completion</h3>
                <FormTextarea label="Completion message" value={completionMessage} onChange={(e) => setCompletionMessage(e.target.value)} rows={3} />
              </div>

              <div>
                <h3 className="mb-3 text-heading-md text-text">Email notifications</h3>
                <Toggle label="Send email notification when form is submitted" checked={emailNotifications} onChange={setEmailNotifications} />
              </div>
            </div>
          )}

          {activeTab === "preview" && (
            <div className="mx-auto max-w-lg">
              <div className="rounded-lg border border-border p-6" style={{ borderTopColor: themeColor, borderTopWidth: 4 }}>
                <h2 className="mb-6 text-heading-lg text-text">{title}</h2>
                <div className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.id}>
                      <label className="mb-1 block text-label-lg text-text">
                        {field.label} {field.required && <span className="text-danger">*</span>}
                      </label>
                      {field.type === "long-text" ? (
                        <textarea className="w-full rounded-lg border border-border px-3 py-2 text-body-md" rows={3} disabled />
                      ) : field.type === "boolean" ? (
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2"><input type="radio" name={`f${field.id}`} disabled /> Yes</label>
                          <label className="flex items-center gap-2"><input type="radio" name={`f${field.id}`} disabled /> No</label>
                        </div>
                      ) : field.type === "file-upload" ? (
                        <div className="flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-border bg-gray-50 text-caption-md text-text-secondary">
                          Click or drag to upload
                        </div>
                      ) : (
                        <input className="w-full rounded-lg border border-border px-3 py-2 text-body-md" type={field.type === "date" ? "date" : "text"} disabled />
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="primary" className="mt-6 w-full" style={{ backgroundColor: themeColor }}>Submit</Button>
              </div>
            </div>
          )}
        </div>

        {sidePanel === "share" && (
          <div className="w-80 shrink-0 border-l border-border bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-heading-sm text-text">Share & Automate</h3>
              <button onClick={() => setSidePanel(null)} className="rounded p-1 text-text-secondary hover:bg-gray-100">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-label-lg text-text-secondary">Form link</label>
                <div className="rounded-lg border border-border bg-gray-50 px-3 py-2 text-body-sm text-primary break-all">
                  https://acme.splose.com/patient-form/81783/view
                </div>
              </div>
              <Button variant="secondary" className="w-full">Copy link</Button>
              <Button variant="secondary" className="w-full">Send to client</Button>
              <div className="border-t border-border pt-4">
                <h4 className="mb-2 text-label-lg text-text">Automations</h4>
                <p className="text-caption-md text-text-secondary">Automatically send this form to new clients or on appointment creation.</p>
                <Button variant="secondary" className="mt-2">+ Add automation</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal open={showAddField} onClose={() => setShowAddField(false)} title="Add field" maxWidth="sm">
        <div className="grid grid-cols-2 gap-2">
          {FIELD_TYPES.map(({ icon: Icon, label, value }) => (
            <button
              key={value}
              onClick={() => addField(value)}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-left transition-colors hover:border-primary hover:bg-primary/5"
            >
              <Icon className="h-4 w-4 text-primary" />
              <span className="text-body-md text-text">{label}</span>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
