"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, Columns2, Copy, ChevronDown, ClipboardList } from "lucide-react";
import { Button, Badge, EmptyState, Navbar, Filter, FormTextarea, FormInput, FormSelect } from "@/components/ds";

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
    <div className="min-h-[calc(100vh-3rem)] bg-gray-50/30">
      {/* Header bar */}
      <Navbar
        backHref="/"
        title="New progress note"
        badge={
          <div className="flex items-center gap-2">
            <Badge variant="gray">Note has been autosaved</Badge>
            {clientName && <span className="text-body-md text-primary">{clientName}</span>}
          </div>
        }
      >
        {/* View toggle */}
        <Filter
          items={[
            { label: <LayoutGrid className="h-4 w-4" />, value: "single" },
            { label: <Columns2 className="h-4 w-4" />, value: "split" },
          ]}
          value={viewMode}
          onChange={(v) => setViewMode(v as "single" | "split")}
        />
        {/* Save as final button */}
        <Button variant="primary" className="bg-green-500 border-green-500 hover:bg-green-600" onClick={handleSave} disabled={saving}>
          Save as final
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </Navbar>

      <div className="flex">
        {/* Left editor panel */}
        <div className={`flex-1 border-r border-border bg-white p-6 ${viewMode === "split" ? "" : ""}`}>
          <div className="mx-auto max-w-2xl">
            {/* Service select */}
            <div className="mb-5">
              <FormSelect
                label="Service *"
                value={serviceId}
                onChange={setServiceId}
                options={[
                  { value: "", label: "Select service" },
                  ...SERVICE_OPTIONS.map((s) => ({ value: s.value, label: s.label })),
                ]}
              />
            </div>

            {/* Template field */}
            <div className="mb-5">
              <FormSelect
                label="Template *"
                value={template}
                onChange={setTemplate}
                options={[
                  { value: "", label: "Select template" },
                  ...TEMPLATES.map((t) => ({ value: t, label: t })),
                ]}
              />
            </div>

            {/* Quick action buttons */}
            <div className="mb-5 flex items-center gap-2">
              <Button variant="secondary" size="sm">
                <LayoutGrid className="h-3.5 w-3.5" />
                Select
              </Button>
              <Button variant="secondary" size="sm">
                <Copy className="h-3.5 w-3.5" />
                Copy recent note
              </Button>
              <Button variant="secondary" size="sm">
                <Copy className="h-3.5 w-3.5" />
                Copy recent practitioner note
              </Button>
            </div>

            {/* Note content */}
            <div className="mb-4">
              <FormTextarea
                label="Note content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={18}
                placeholder="Start writing your progress note here..."
                className="resize-y px-4 py-3 text-sm leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right reference panel */}
        {viewMode === "split" && (
          <div className="w-80 shrink-0 bg-white p-6">
            <h3 className="mb-3 text-heading-sm text-text">Filter previous progress notes</h3>
            <FormInput
              type="text"
              placeholder="Search notes"
            />
            <EmptyState
              icon={<ClipboardList className="h-10 w-10 text-primary-light opacity-40" />}
              title="No reference notes found"
              message="Select a client to see their previous notes"
              className="mt-16"
            />
          </div>
        )}
      </div>
    </div>
  );
}
