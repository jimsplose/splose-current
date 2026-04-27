"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flex, Form } from "antd";
import {
  HolderOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  ShareAltOutlined,
  FontSizeOutlined,
  NumberOutlined,
  CalendarOutlined,
  SwitcherOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { FormInput, Tab, FormPage, Card, Toggle, FormColorPicker, FormTextarea, Modal, Grid, Breadcrumbs, Tooltip, Text } from "@/components/ds";
import styles from "./FormEdit.module.css";

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
    <FormPage
      backHref="/settings/forms"
      title={title || "Edit form template"}
      breadcrumbs={
        <Breadcrumbs items={[
          { label: "Settings", href: "/settings" },
          { label: "Forms", href: "/settings/forms" },
          { label: title || "Edit form template" },
        ]} />
      }
      maxWidth={99999}
      actions={
        <Flex align="center" gap={8}>
          <Tooltip content="Share & Automate">
            <Button type="text" onClick={() => setSidePanel(sidePanel === "share" ? null : "share")}>
              <ShareAltOutlined className={styles.iconBtn} />
            </Button>
          </Tooltip>
          <Button onClick={() => setActiveTab("preview")}>
            <EyeOutlined className={styles.iconBtn} /> Preview
          </Button>
          <Button type="primary" onClick={() => router.push("/settings/forms")}>Save</Button>
        </Flex>
      }
      className={styles.page}
    >
      <div className={styles.tabBar}>
        <Tab items={editorTabs} value={activeTab} onChange={setActiveTab} />
      </div>

      <Flex className={styles.body}>
        <div className={styles.content}>
          {activeTab === "builder" && (
            <div className={styles.column}>
              <Flex vertical gap={12}>
                <FormInput label="Form title" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.titleInput} />

                {fields.map((field) => {
                  const FieldIcon = FIELD_TYPES.find((t) => t.value === field.type)?.icon || FontSizeOutlined;
                  return (
                    <Card key={field.id} padding="none">
                      <Flex align="center" gap={8} className={styles.fieldRow}>
                        <HolderOutlined className={styles.dragHandle} />
                        <FieldIcon className={styles.fieldIcon} />
                        <input
                          className={styles.fieldLabelInput}
                          value={field.label}
                          onChange={(e) => setFields((prev) => prev.map((f) => f.id === field.id ? { ...f, label: e.target.value } : f))}
                        />
                        <Toggle checked={field.required} onChange={(checked) => setFields((prev) => prev.map((f) => f.id === field.id ? { ...f, required: checked } : f))} label="Required" />
                        <Tooltip content="Remove field">
                          <Button type="text" onClick={() => removeField(field.id)}>
                            <DeleteOutlined className={styles.iconBtn} />
                          </Button>
                        </Tooltip>
                      </Flex>
                    </Card>
                  );
                })}

                <Button onClick={() => setShowAddField(true)}>
                  <PlusOutlined className={styles.iconBtn} /> Add field
                </Button>
              </Flex>
            </div>
          )}

          {activeTab === "settings" && (
            <div className={styles.column}>
              <Flex vertical gap={24}>
                <div>
                  <h3 className={styles.sectionHeading}>Design</h3>
                  <Flex vertical gap={16}>
                    <FormColorPicker label="Theme colour" value={themeColor} onChange={setThemeColor} />
                    <Toggle label="Show header image" checked={headerImage} onChange={setHeaderImage} />
                  </Flex>
                </div>

                <div>
                  <h3 className={styles.sectionHeading}>Form completion</h3>
                  <FormTextarea label="Completion message" value={completionMessage} onChange={(e) => setCompletionMessage(e.target.value)} rows={3} />
                </div>

                <div>
                  <h3 className={styles.sectionHeading}>Email notifications</h3>
                  <Toggle label="Send email notification when form is submitted" checked={emailNotifications} onChange={setEmailNotifications} />
                </div>
              </Flex>
            </div>
          )}

          {activeTab === "preview" && (
            <div className={styles.previewColumn}>
              {/* ds-exempt: borderTopColor is data-driven (themeColor state) */}
              <div className={styles.previewCard} style={{ borderTopColor: themeColor }}>
                <h2 className={styles.previewTitle}>{title}</h2>
                <Flex vertical gap={16}>
                  {fields.map((field) => (
                    <div key={field.id}>
                      <Form.Item label={field.label} required={field.required} className={styles.previewItem}>
                        {field.type === "long-text" ? (
                          <textarea className={styles.previewTextarea} rows={3} disabled />
                        ) : field.type === "boolean" ? (
                          <Flex gap={16}>
                            <span className={styles.previewRadioLabel}><input type="radio" name={`f${field.id}`} disabled /> Yes</span>
                            <span className={styles.previewRadioLabel}><input type="radio" name={`f${field.id}`} disabled /> No</span>
                          </Flex>
                        ) : field.type === "file-upload" ? (
                          <Flex align="center" justify="center" className={styles.previewUploadDrop}>
                            Click or drag to upload
                          </Flex>
                        ) : (
                          <input className={styles.previewInput} type={field.type === "date" ? "date" : "text"} disabled />
                        )}
                      </Form.Item>
                    </div>
                  ))}
                </Flex>
                {/* ds-exempt: backgroundColor is data-driven (themeColor state) */}
                <Button type="primary" className={styles.submitBtn} style={{ backgroundColor: themeColor }}>Submit</Button>
              </div>
            </div>
          )}
        </div>

        {sidePanel === "share" && (
          <div className={styles.sharePanel}>
            <Flex justify="space-between" align="center" className={styles.sharePanelHeader}>
              <h3 className={styles.sharePanelTitle}>Share & Automate</h3>
              <Tooltip content="Close panel">
                <Button type="text" onClick={() => setSidePanel(null)}>&times;</Button>
              </Tooltip>
            </Flex>
            <Flex vertical gap={16}>
              <div>
                <Form.Item label="Form link" className={styles.previewItem}>
                  <div className={styles.shareLinkBox}>
                    https://acme.splose.com/patient-form/81783/view
                  </div>
                </Form.Item>
              </div>
              <Button className={styles.fullWidthBtn}>Copy link</Button>
              <Button className={styles.fullWidthBtn}>Send to client</Button>
              <div className={styles.automationsSection}>
                <h4 className={styles.automationsHeading}>Automations</h4>
                <Text variant="caption/sm" color="secondary">Automatically send this form to new clients or on appointment creation.</Text>
                <Button className={styles.fullWidthBtn} style={{ marginTop: 8 }}>+ Add automation</Button>
              </div>
            </Flex>
          </div>
        )}
      </Flex>

      <Modal open={showAddField} onClose={() => setShowAddField(false)} title="Add field" maxWidth="sm">
        <Grid cols={2} gap="sm">
          {FIELD_TYPES.map(({ icon: Icon, label, value }) => (
            <button
              key={value}
              onClick={() => addField(value)}
              className={styles.fieldTypeBtn}
            >
              <Icon className={styles.fieldTypeBtnIcon} />
              <span className={styles.fieldTypeBtnLabel}>{label}</span>
            </button>
          ))}
        </Grid>
      </Modal>
    </FormPage>
  );
}
