"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flex } from "antd";
import {
  HolderOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  ShareAltOutlined,
  SettingOutlined,
  FontSizeOutlined,
  NumberOutlined,
  CalendarOutlined,
  SwitcherOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  UploadOutlined,
} from "@ant-design/icons";
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
  { icon: FontSizeOutlined, label: "Short text", value: "short-text" },
  { icon: FileTextOutlined, label: "Long text", value: "long-text" },
  { icon: NumberOutlined, label: "Number", value: "number" },
  { icon: CalendarOutlined, label: "Date", value: "date" },
  { icon: SwitcherOutlined, label: "Yes/No", value: "boolean" },
  { icon: UnorderedListOutlined, label: "Multiple choice", value: "multiple-choice" },
  { icon: UnorderedListOutlined, label: "Dropdown", value: "dropdown" },
  { icon: UploadOutlined, label: "File upload", value: "file-upload" },
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar backHref="/settings/forms" title={title || "Edit form template"}>
        <Flex align="center" gap={8}>
          <Button variant="icon" onClick={() => setSidePanel(sidePanel === "share" ? null : "share")} title="Share & Automate">
            <ShareAltOutlined style={{ fontSize: 16 }} />
          </Button>
          <Button variant="secondary" onClick={() => setActiveTab("preview")}>
            <EyeOutlined style={{ fontSize: 16 }} /> Preview
          </Button>
          <Button variant="primary" onClick={() => router.push("/settings/forms")}>Save</Button>
        </Flex>
      </Navbar>

      <div style={{ borderBottom: '1px solid var(--color-border)', padding: '0 24px' }}>
        <Tab items={editorTabs} value={activeTab} onChange={setActiveTab} />
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {activeTab === "builder" && (
            <div style={{ maxWidth: 672, margin: '0 auto' }}>
              <Flex vertical gap={12}>
                <FormInput label="Form title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ marginBottom: 16 }} />

                {fields.map((field) => {
                  const FieldIcon = FIELD_TYPES.find((t) => t.value === field.type)?.icon || FontSizeOutlined;
                  return (
                    <Card key={field.id} padding="none" className="group">
                      <Flex align="center" gap={8} style={{ padding: '12px 16px' }}>
                        <HolderOutlined style={{ fontSize: 16, flexShrink: 0, cursor: 'grab', color: 'var(--color-text-secondary)' }} />
                        <FieldIcon style={{ fontSize: 16, flexShrink: 0, color: 'var(--color-primary)' }} />
                        <input
                          style={{ flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none' }}
                          className="text-body-md text-text"
                          value={field.label}
                          onChange={(e) => setFields((prev) => prev.map((f) => f.id === field.id ? { ...f, label: e.target.value } : f))}
                        />
                        <Toggle checked={field.required} onChange={(checked) => setFields((prev) => prev.map((f) => f.id === field.id ? { ...f, required: checked } : f))} label="Required" />
                        <button onClick={() => removeField(field.id)} style={{ borderRadius: 4, padding: 4, color: 'var(--color-text-secondary)', opacity: 0 }} className="group-hover:opacity-100 hover:text-danger">
                          <DeleteOutlined style={{ fontSize: 14 }} />
                        </button>
                      </Flex>
                    </Card>
                  );
                })}

                <Button variant="secondary" onClick={() => setShowAddField(true)}>
                  <PlusOutlined style={{ fontSize: 16 }} /> Add field
                </Button>
              </Flex>
            </div>
          )}

          {activeTab === "settings" && (
            <div style={{ maxWidth: 672, margin: '0 auto' }}>
              <Flex vertical gap={24}>
                <div>
                  <h3 className="text-heading-md text-text" style={{ marginBottom: 12 }}>Design</h3>
                  <Flex vertical gap={16}>
                    <FormColorPicker label="Theme colour" value={themeColor} onChange={setThemeColor} />
                    <Toggle label="Show header image" checked={headerImage} onChange={setHeaderImage} />
                  </Flex>
                </div>

                <div>
                  <h3 className="text-heading-md text-text" style={{ marginBottom: 12 }}>Form completion</h3>
                  <FormTextarea label="Completion message" value={completionMessage} onChange={(e) => setCompletionMessage(e.target.value)} rows={3} />
                </div>

                <div>
                  <h3 className="text-heading-md text-text" style={{ marginBottom: 12 }}>Email notifications</h3>
                  <Toggle label="Send email notification when form is submitted" checked={emailNotifications} onChange={setEmailNotifications} />
                </div>
              </Flex>
            </div>
          )}

          {activeTab === "preview" && (
            <div style={{ maxWidth: 512, margin: '0 auto' }}>
              <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', padding: 24, borderTopColor: themeColor, borderTopWidth: 4 }}>
                <h2 className="text-heading-lg text-text" style={{ marginBottom: 24 }}>{title}</h2>
                <Flex vertical gap={16}>
                  {fields.map((field) => (
                    <div key={field.id}>
                      <label className="text-label-lg text-text" style={{ display: 'block', marginBottom: 4 }}>
                        {field.label} {field.required && <span className="text-danger">*</span>}
                      </label>
                      {field.type === "long-text" ? (
                        <textarea style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', padding: '8px 12px' }} className="text-body-md" rows={3} disabled />
                      ) : field.type === "boolean" ? (
                        <Flex gap={16}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="radio" name={`f${field.id}`} disabled /> Yes</label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="radio" name={`f${field.id}`} disabled /> No</label>
                        </Flex>
                      ) : field.type === "file-upload" ? (
                        <div style={{ display: 'flex', height: 80, alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: '2px dashed var(--color-border)', backgroundColor: 'var(--color-bg-layout)' }} className="text-caption-md text-text-secondary">
                          Click or drag to upload
                        </div>
                      ) : (
                        <input style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', padding: '8px 12px' }} className="text-body-md" type={field.type === "date" ? "date" : "text"} disabled />
                      )}
                    </div>
                  ))}
                </Flex>
                <Button variant="primary" className="mt-6 w-full" style={{ backgroundColor: themeColor }}>Submit</Button>
              </div>
            </div>
          )}
        </div>

        {sidePanel === "share" && (
          <div style={{ width: 320, flexShrink: 0, borderLeft: '1px solid var(--color-border)', backgroundColor: 'white', padding: 16 }}>
            <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
              <h3 className="text-heading-sm text-text">Share & Automate</h3>
              <button onClick={() => setSidePanel(null)} style={{ borderRadius: 4, padding: 4, color: 'var(--color-text-secondary)' }} className="hover:bg-gray-100">&times;</button>
            </Flex>
            <Flex vertical gap={16}>
              <div>
                <label className="text-label-lg" style={{ display: 'block', marginBottom: 4, color: 'var(--color-text-secondary)' }}>Form link</label>
                <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-layout)', padding: '8px 12px', wordBreak: 'break-all' }} className="text-body-sm text-primary">
                  https://acme.splose.com/patient-form/81783/view
                </div>
              </div>
              <Button variant="secondary" style={{ width: '100%' }}>Copy link</Button>
              <Button variant="secondary" style={{ width: '100%' }}>Send to client</Button>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
                <h4 className="text-label-lg text-text" style={{ marginBottom: 8 }}>Automations</h4>
                <p className="text-caption-md text-text-secondary">Automatically send this form to new clients or on appointment creation.</p>
                <Button variant="secondary" style={{ marginTop: 8 }}>+ Add automation</Button>
              </div>
            </Flex>
          </div>
        )}
      </div>

      <Modal open={showAddField} onClose={() => setShowAddField(false)} title="Add field" maxWidth="sm">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {FIELD_TYPES.map(({ icon: Icon, label, value }) => (
            <button
              key={value}
              onClick={() => addField(value)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 8, border: '1px solid var(--color-border)', padding: '10px 12px', textAlign: 'left', transition: 'all 0.2s', cursor: 'pointer', backgroundColor: 'transparent' }}
              className="hover:border-primary hover:bg-primary/5"
            >
              <Icon style={{ fontSize: 16, color: 'var(--color-primary)' }} />
              <span className="text-body-md text-text">{label}</span>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
