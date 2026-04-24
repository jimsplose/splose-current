"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppstoreOutlined, ColumnWidthOutlined, CopyOutlined, DownOutlined, SnippetsOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Select, Input } from "antd";
import { Badge, EmptyState, Filter, FormPage, Text } from "@/components/ds";

const TEMPLATES = [
  "Initial Assessment",
  "Progress Note",
  "Discharge Summary",
  "Treatment Plan",
  "SOAP Note",
  "NDIS Progress Note",
  "Default note template all",
];

const SERVICE_OPTIONS = [
  { value: "1", label: "Mon 16 Mar 2026, 10:30am \u2013 Shannon Ford (OT \u2013 Initial Consult)", clientName: "Shannon Ford" },
  { value: "2", label: "Wed 11 Mar 2026, 2:00pm \u2013 Sharon Test 1 (OT \u2013 Review)", clientName: "Sharon Test 1" },
  { value: "3", label: "Mon 3 Mar 2026, 10:30am \u2013 Michael Chen (OT \u2013 Follow Up)", clientName: "Michael Chen" },
];

export default function NewProgressNotePage() {
  return (
    <Suspense>
      <NewProgressNotePageInner />
    </Suspense>
  );
}

function NewProgressNotePageInner() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [serviceId, setServiceId] = useState("");
  const [template, setTemplate] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"single" | "split">("split");

  const searchParams = useSearchParams();
  const forcedState = searchParams.get("state");

  useEffect(() => {
    if (forcedState === "split-view") {
      setViewMode("split");
    }
  }, [forcedState]);

  const selectedService = SERVICE_OPTIONS.find((s) => s.value === serviceId);
  const clientName = selectedService?.clientName ?? "";

  const handleSave = async () => {
    if (!serviceId || !template) {
      alert("Please fill in all required fields: Service and Template.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          template,
          content,
          signed: true,
        }),
      });
      if (res.ok) {
        router.push("/");
      } else {
        alert("Failed to save note. Please try again.");
      }
    } catch {
      alert("Failed to save note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormPage
      title="New progress note"
      backHref="/"
      badge={
        <Flex align="center" gap={8}>
          <Badge variant="gray">Note has been autosaved</Badge>
          {clientName && <Text variant="body/md" as="span" color="primary">{clientName}</Text>}
        </Flex>
      }
      actions={
        <>
          {/* View toggle */}
          <Filter
            items={[
              { label: <AppstoreOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />, value: "single" },
              { label: <ColumnWidthOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />, value: "split" },
            ]}
            value={viewMode}
            onChange={(v) => setViewMode(v as "single" | "split")}
          />
          {/* Save as final button */}
          <Button type="primary" style={{ backgroundColor: 'var(--color-success)', borderColor: 'var(--color-success)' }} onClick={handleSave} disabled={saving}>
            Save as final
            <DownOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
          </Button>
        </>
      }
      maxWidth={99999}
      style={{ minHeight: 'calc(100vh - 3rem)', backgroundColor: 'var(--color-bg-layout)' }}
    >
      <div className="flex" style={{ margin: -24 }}>
        {/* Left editor panel */}
        <div style={{ flex: 1, borderRight: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)', padding: 24 }}>
          <div style={{ maxWidth: 672, margin: '0 auto' }}>
            <Form form={form} layout="vertical">
            {/* Service select */}
            <div style={{ marginBottom: 20 }}>
              <Form.Item label="Service *" required>
                <Select
                  value={serviceId}
                  onChange={setServiceId}
                  style={{ width: "100%" }}
                  options={[
                    { value: "", label: "Select service" },
                    ...SERVICE_OPTIONS.map((s) => ({ value: s.value, label: s.label })),
                  ]}
                />
              </Form.Item>
            </div>

            {/* Template field */}
            <div style={{ marginBottom: 20 }}>
              <Form.Item label="Template *" required>
                <Select
                  value={template}
                  onChange={setTemplate}
                  style={{ width: "100%" }}
                  options={[
                    { value: "", label: "Select template" },
                    ...TEMPLATES.map((t) => ({ value: t, label: t })),
                  ]}
                />
              </Form.Item>
            </div>

            {/* Quick action buttons */}
            <Flex align="center" gap={8} style={{ marginBottom: 20 }}>
              <Button size="small">
                <AppstoreOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
                Select
              </Button>
              <Button size="small">
                <CopyOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
                Copy recent note
              </Button>
              <Button size="small">
                <CopyOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
                Copy recent practitioner note
              </Button>
            </Flex>

            {/* Note content */}
            <div style={{ marginBottom: 16 }}>
              <Form.Item label="Note content">
                <Input.TextArea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={18}
                  placeholder="Start writing your progress note here..."
                  style={{ resize: 'vertical', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, fontSize: 12, lineHeight: 1.625 }}
                />
              </Form.Item>
            </div>
            </Form>
          </div>
        </div>

        {/* Right reference panel */}
        {viewMode === "split" && (
          <div style={{ width: 320, flexShrink: 0, backgroundColor: 'var(--color-bg-base)', padding: 24 }}>
            <Text variant="heading/sm" as="h3" style={{ marginBottom: 12 }}>Filter previous progress notes</Text>
            <Input
              type="text"
              placeholder="Search notes"
            />
            <EmptyState
              icon={<SnippetsOutlined style={{ fontSize: 40, color: 'var(--ant-color-primary, #8250FF)', opacity: 0.4 }} />}
              title="No reference notes found"
              message="Select a client to see their previous notes"
              style={{ marginTop: 64 }}
            />
          </div>
        )}
      </div>
    </FormPage>
  );
}
