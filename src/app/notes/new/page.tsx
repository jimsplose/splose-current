"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, Columns2, Copy, ChevronDown, Save, Lock, ClipboardList } from "lucide-react";
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

export default function NewProgressNotePage() {
  return (
    <Suspense>
      <NewProgressNotePageInner />
    </Suspense>
  );
}

function NewProgressNotePageInner() {
  const router = useRouter();
  const [clientId, setClientId] = useState("");
  const [practitionerId, setPractitionerId] = useState("");
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [template, setTemplate] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"single" | "split">("single");

  const searchParams = useSearchParams();
  const forcedState = searchParams.get("state");

  useEffect(() => {
    if (forcedState === "split-view") {
      setViewMode("split");
    }
  }, [forcedState]);

  const handleSave = async (signed: boolean) => {
    if (!clientId || !practitionerId || !template) {
      alert("Please fill in all required fields: Client, Practitioner, and Template.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          practitionerId,
          date: serviceDate,
          template,
          content,
          signed,
        }),
      });
      if (res.ok) {
        router.push("/notes");
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
      <Navbar backHref="/notes" title="New progress note" badge={<Badge variant="yellow">Unsaved</Badge>}>
        {/* Add new note button */}
        <Button variant="primary" round size="sm" className="bg-green-500 border-green-500 hover:bg-green-600">
          <span className="text-heading-lg leading-none">+</span>
        </Button>
        {/* View toggle */}
        <Filter
          items={[
            { label: <LayoutGrid className="h-4 w-4" />, value: "single" },
            { label: <Columns2 className="h-4 w-4" />, value: "split" },
          ]}
          value={viewMode}
          onChange={(v) => setViewMode(v as "single" | "split")}
        />
        {/* Save buttons */}
        <Button variant="secondary" onClick={() => handleSave(false)} disabled={saving}>
          <Save className="h-4 w-4" />
          Save as draft
        </Button>
        <Button variant="primary" onClick={() => handleSave(true)} disabled={saving}>
          <Lock className="h-3.5 w-3.5" />
          Sign &amp; lock
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </Navbar>

      <div className="flex">
        {/* Left editor panel */}
        <div className={`flex-1 border-r border-border bg-white p-6 ${viewMode === "split" ? "" : ""}`}>
          <div className="mx-auto max-w-2xl">
            {/* Client select */}
            <div className="mb-5">
              <label className="mb-1 block text-label-lg text-text">
                Client <span className="text-danger">*</span>
              </label>
              <ClientSelect value={clientId} onChange={setClientId} />
            </div>

            {/* Practitioner select */}
            <div className="mb-5">
              <label className="mb-1 block text-label-lg text-text">
                Practitioner <span className="text-danger">*</span>
              </label>
              <PractitionerSelect value={practitionerId} onChange={setPractitionerId} />
            </div>

            {/* Service date */}
            <div className="mb-5">
              <FormInput
                label="Service date"
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
              />
            </div>

            {/* Template field */}
            <div className="mb-5">
              <FormSelect
                label="Template *"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
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

/* ------------------------------------------------------------------ */
/* Async select components that fetch data on mount                    */
/* ------------------------------------------------------------------ */

function ClientSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [clients, setClients] = useState<{ id: string; firstName: string; lastName: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
    >
      <option value="">{loading ? "Loading clients..." : "Select client"}</option>
      {clients.map((c) => (
        <option key={c.id} value={c.id}>
          {c.firstName} {c.lastName}
        </option>
      ))}
    </select>
  );
}

function PractitionerSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [practitioners, setPractitioners] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/practitioners")
      .then((r) => r.json())
      .then((data) => {
        setPractitioners(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
    >
      <option value="">{loading ? "Loading practitioners..." : "Select practitioner"}</option>
      {practitioners.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
