"use client";

import { useState } from "react";
import { Button, FormInput, Badge, EmptyState } from "@/components/ds";

const formTemplates = [
  { name: "New Client Intake Form", description: "Collects personal details, medical history, and consent", status: "Published" as const, responses: 142, lastModified: "12 Mar 2026" },
  { name: "NDIS Service Agreement", description: "NDIS participant service agreement and plan details", status: "Published" as const, responses: 67, lastModified: "10 Mar 2026" },
  { name: "Mental Health Screening (K10)", description: "Kessler Psychological Distress Scale questionnaire", status: "Published" as const, responses: 89, lastModified: "8 Mar 2026" },
  { name: "Consent to Telehealth", description: "Telehealth session consent and technology requirements", status: "Published" as const, responses: 203, lastModified: "5 Mar 2026" },
  { name: "Client Feedback Survey", description: "Post-appointment satisfaction and feedback survey", status: "Draft" as const, responses: 0, lastModified: "15 Mar 2026" },
  { name: "Workplace Injury Report", description: "WorkCover injury details and employer information", status: "Published" as const, responses: 31, lastModified: "1 Mar 2026" },
  { name: "Paediatric Referral Form", description: "Referral details for paediatric OT and speech therapy", status: "Draft" as const, responses: 0, lastModified: "14 Mar 2026" },
  { name: "COVID-19 Screening", description: "Pre-appointment COVID-19 symptoms and exposure check", status: "Archived" as const, responses: 1520, lastModified: "20 Jan 2026" },
];

export default function FormsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Published" | "Draft" | "Archived">("all");
  const filtered = formTemplates.filter((f) => {
    if (statusFilter !== "all" && f.status !== statusFilter) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-display-lg text-text">Forms</h1>
          <p className="mt-1 text-body-md text-text-secondary">Create and manage forms that clients can fill out online</p>
        </div>
        <Button variant="primary">+ New form</Button>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-64"><FormInput type="text" placeholder="Search forms..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <div className="flex rounded-lg border border-border bg-white overflow-hidden">
          {(["all", "Published", "Draft", "Archived"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 text-label-lg transition-colors ${s !== "all" ? "border-l border-border" : ""} ${statusFilter === s ? "bg-primary text-white" : "text-text-secondary hover:bg-gray-50"}`}>{s === "all" ? "All" : s}</button>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-border bg-gray-50"><th className="px-4 py-3 text-left text-label-lg text-text">Form name</th><th className="px-4 py-3 text-left text-label-lg text-text">Description</th><th className="px-4 py-3 text-center text-label-lg text-text">Status</th><th className="px-4 py-3 text-center text-label-lg text-text">Responses</th><th className="px-4 py-3 text-left text-label-lg text-text">Last modified</th><th className="px-4 py-3 text-right text-label-lg text-text">Actions</th></tr></thead>
          <tbody className="divide-y divide-border">
            {filtered.map((form) => (
              <tr key={form.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-label-lg text-text">{form.name}</td>
                <td className="px-4 py-3 text-body-md text-text-secondary max-w-xs truncate">{form.description}</td>
                <td className="px-4 py-3 text-center"><Badge variant={form.status === "Published" ? "green" : form.status === "Draft" ? "yellow" : "gray"}>{form.status}</Badge></td>
                <td className="px-4 py-3 text-center text-body-md text-text-secondary">{form.responses}</td>
                <td className="px-4 py-3 text-body-md text-text-secondary">{form.lastModified}</td>
                <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-2"><button className="text-body-md text-primary hover:underline">Edit</button><button className="text-body-md text-text-secondary hover:text-text">...</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState message="No forms found" className="py-8" />}
      </div>
    </div>
  );
}
