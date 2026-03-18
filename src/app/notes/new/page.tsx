"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  LayoutGrid,
  Columns2,
  Copy,
  ChevronDown,
  Save,
  Lock,
  ClipboardList,
} from "lucide-react";
import { Button, Badge } from "@/components/ds";

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
  const router = useRouter();
  const [clientId, setClientId] = useState("");
  const [practitionerId, setPractitionerId] = useState("");
  const [serviceDate, setServiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [template, setTemplate] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"single" | "split">("single");

  const handleSave = async (signed: boolean) => {
    if (!clientId || !practitionerId || !template) {
      alert(
        "Please fill in all required fields: Client, Practitioner, and Template."
      );
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
      <div className="flex items-center justify-between border-b border-border bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/notes"
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-text transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="h-5 w-px bg-border" />
          <h1 className="text-lg font-semibold text-text">
            New progress note
          </h1>
          <Badge variant="yellow">
            Unsaved
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {/* Add new note button */}
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors">
            <span className="text-lg font-bold leading-none">+</span>
          </button>
          {/* View toggle */}
          <div className="flex overflow-hidden rounded-lg border border-border">
            <button
              onClick={() => setViewMode("single")}
              className={`p-2 transition-colors ${
                viewMode === "single"
                  ? "bg-primary text-white"
                  : "bg-white text-text-secondary hover:bg-gray-50"
              }`}
              title="Single view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`p-2 transition-colors ${
                viewMode === "split"
                  ? "bg-primary text-white"
                  : "bg-white text-text-secondary hover:bg-gray-50"
              }`}
              title="Split view"
            >
              <Columns2 className="h-4 w-4" />
            </button>
          </div>
          {/* Save buttons */}
          <Button
            variant="secondary"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            <Save className="h-4 w-4" />
            Save as draft
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            <Lock className="h-3.5 w-3.5" />
            Sign &amp; lock
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Left editor panel */}
        <div
          className={`flex-1 border-r border-border bg-white p-6 ${
            viewMode === "split" ? "" : ""
          }`}
        >
          <div className="mx-auto max-w-2xl">
            {/* Client select */}
            <div className="mb-5">
              <label className="mb-1 block text-sm font-medium text-text">
                Client <span className="text-danger">*</span>
              </label>
              <ClientSelect value={clientId} onChange={setClientId} />
            </div>

            {/* Practitioner select */}
            <div className="mb-5">
              <label className="mb-1 block text-sm font-medium text-text">
                Practitioner <span className="text-danger">*</span>
              </label>
              <PractitionerSelect
                value={practitionerId}
                onChange={setPractitionerId}
              />
            </div>

            {/* Service date */}
            <div className="mb-5">
              <label className="mb-1 block text-sm font-medium text-text">
                Service date
              </label>
              <input
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Template field */}
            <div className="mb-5">
              <label className="mb-1 block text-sm font-medium text-text">
                Template <span className="text-danger">*</span>
              </label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="">Select template</option>
                {TEMPLATES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
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
              <label className="mb-1 block text-sm font-medium text-text">
                Note content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={18}
                placeholder="Start writing your progress note here..."
                className="w-full resize-y rounded-lg border border-border bg-white px-4 py-3 text-sm leading-relaxed text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Right reference panel */}
        {viewMode === "split" && (
          <div className="w-80 shrink-0 bg-white p-6">
            <h3 className="mb-3 text-sm font-semibold text-text">
              Filter previous progress notes
            </h3>
            <input
              type="text"
              placeholder="Search notes"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <div className="mt-16 flex flex-col items-center justify-center text-center">
              <ClipboardList className="mb-4 h-20 w-20 text-primary-light opacity-40" />
              <p className="text-sm text-text-secondary">
                No reference notes found
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                Select a client to see their previous notes
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Async select components that fetch data on mount                    */
/* ------------------------------------------------------------------ */

function ClientSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [clients, setClients] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);
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
      <option value="">
        {loading ? "Loading clients..." : "Select client"}
      </option>
      {clients.map((c) => (
        <option key={c.id} value={c.id}>
          {c.firstName} {c.lastName}
        </option>
      ))}
    </select>
  );
}

function PractitionerSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [practitioners, setPractitioners] = useState<
    { id: string; name: string }[]
  >([]);
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
      <option value="">
        {loading ? "Loading practitioners..." : "Select practitioner"}
      </option>
      {practitioners.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
