"use client";

import { useState } from "react";
import { Button, FormInput, FormSelect, Toggle, Tab, Modal, Dropdown, HintIcon } from "@/components/ds";

export default function SettingsDetailsPage() {
  const [emailSigTab, setEmailSigTab] = useState<"Business" | "User">("Business");
  const [casesToggle, setCasesToggle] = useState(true);
  const [applyToAll, setApplyToAll] = useState(false);

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-display-lg text-text">Details</h1>
        <Button variant="primary">Save</Button>
      </div>

      <div className="space-y-6">
        <div className="flex gap-8">
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-label-lg text-text mb-1">
                Business name<span className="text-red-500">*</span>
              </label>
              <FormInput type="text" defaultValue="Hands Together Therapies" />
            </div>
            <div>
              <label className="block text-label-lg text-text mb-1">
                Workspace URL{" "}
                <HintIcon />
              </label>
              <FormInput type="text" defaultValue="acme.splose.com" />
            </div>
            <FormInput label="Website" type="text" defaultValue="hands-together-therapy.com" />
            <div>
              <label className="block text-label-lg text-text mb-1">
                Business email<span className="text-red-500">*</span>
              </label>
              <FormInput type="email" defaultValue="hello@hands-together-therapy.com" />
            </div>
          </div>
          <div className="w-48 shrink-0">
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
              <div className="mb-3 text-4xl text-purple-300">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="28" fill="#ede9fe" />
                  <path d="M22 38c0-6 4-16 10-16s10 10 10 16" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="28" cy="26" r="2" fill="#7c3aed" />
                  <circle cx="36" cy="26" r="2" fill="#7c3aed" />
                  <path d="M28 32c2 2 6 2 8 0" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <Button variant="secondary" size="sm">Upload</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-label-lg text-text mb-1">
              Patient terminology{" "}
              <HintIcon />
              <span className="text-red-500">*</span>
            </label>
            <FormSelect options={[{ value: "Client", label: "Client" }, { value: "Patient", label: "Patient" }, { value: "Participant", label: "Participant" }]} />
          </div>
          <div>
            <label className="block text-label-lg text-text mb-1">
              Currency code<span className="text-red-500">*</span>
            </label>
            <FormInput type="text" defaultValue="AUD" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-label-lg text-text mb-1">
              Country<span className="text-red-500">*</span>
            </label>
            <FormSelect options={[{ value: "Australia", label: "Australia" }, { value: "New Zealand", label: "New Zealand" }, { value: "United Kingdom", label: "United Kingdom" }]} />
          </div>
          <div>
            <label className="block text-label-lg text-text mb-1">
              Currency symbol<span className="text-red-500">*</span>
            </label>
            <FormInput type="text" defaultValue="$" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-label-lg text-text mb-1">
              Default appointment communication preferences{" "}
              <HintIcon />
              <span className="text-red-500">*</span>
            </label>
            <FormSelect options={[{ value: "SMS & Email", label: "SMS & Email" }, { value: "SMS only", label: "SMS only" }, { value: "Email only", label: "Email only" }, { value: "None", label: "None" }]} />
            <label className="mt-2 flex items-center gap-2 text-body-md text-text-secondary">
              <input type="checkbox" checked={applyToAll} onChange={(e) => setApplyToAll(e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" />
              Apply to all existing clients and override the current contact preferences
            </label>
          </div>
          <div>
            <label className="block text-label-lg text-text mb-1">
              Tax Label for invoices (E.g. ABN)<span className="text-red-500">*</span>
            </label>
            <FormInput type="text" defaultValue="ABN" />
            <p className="mt-2 text-body-md text-text-secondary">
              Enter your business number in{" "}
              <span className="text-primary cursor-pointer hover:underline">Location settings</span>
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-heading-md text-text mb-3">Email signature</h2>
          <Tab
            items={[
              { label: "Business", value: "Business" },
              { label: "User", value: "User" },
            ]}
            value={emailSigTab}
            onChange={(v) => setEmailSigTab(v as "Business" | "User")}
          />
          <div className="rounded-t-lg border border-border bg-gray-50 px-2 py-1.5 flex items-center gap-1">
            <Button variant="toolbar" className="font-bold">B</Button>
            <Button variant="toolbar" className="italic">I</Button>
            <div className="mx-1 h-4 w-px bg-gray-300" />
            <Button variant="toolbar" className="text-primary">AI</Button>
            <div className="mx-1 h-4 w-px bg-gray-300" />
            <Button variant="toolbar">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h18v18H3V3zm0 6h18M3 15h18M9 3v18M15 3v18" /></svg>
            </Button>
            <Button variant="toolbar">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </Button>
            <Button variant="toolbar">+</Button>
            <div className="mx-1 h-4 w-px bg-gray-300" />
            <Button variant="toolbar">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h10M4 18h16" /></svg>
            </Button>
            <Button variant="toolbar">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M7 12h10M4 18h16" /></svg>
            </Button>
            <Button variant="toolbar">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            </Button>
          </div>
          <div className="rounded-b-lg border border-t-0 border-border bg-white p-4 min-h-[200px] text-body-md text-text relative">
            <p className="line-through">Warm Regards,</p>
            <p className="text-primary mt-1">{"{user_fullName}"}</p>
            <p className="text-primary">{"{user_professionTitle}"}</p>
            <p className="text-primary">{"{user_email}"}</p>
            <p className="mt-2 text-primary">{"{business_name}"}</p>
            <p className="text-primary">{"{business_email}"}</p>
            <p className="text-primary">{"{business_website}"}</p>
            <p className="text-primary">{"{user_signature}"}</p>
            <p className="text-primary">{"{user_workPhoneNumber}{user_professionTitle}"}</p>
            <div className="absolute right-6 bottom-6">
              <span className="text-5xl font-bold text-purple-200 select-none tracking-wide">splose</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-heading-md text-text mb-3">Calendar lock dates</h2>
          <p className="text-body-md text-text-secondary mb-2">
            Prevent users with the practitioner role from making changes on the calendar on and before
          </p>
          <FormInput type="text" defaultValue="19 Dec 2025" className="max-w-xs" />
        </div>

        <div>
          <h2 className="text-heading-md text-text mb-3">Google Tag Manager</h2>
          <FormInput label="Google Tag Manager ID" type="text" defaultValue="GTM-TEST1231" className="max-w-xs" />
        </div>

        <div>
          <h2 className="text-heading-md text-text mb-3">Cases</h2>
          <div className="flex items-center justify-between">
            <p className="text-body-md text-text">Block bookings exceeding case or funding periods (default setting)</p>
            <Toggle checked={casesToggle} onChange={setCasesToggle} />
          </div>
        </div>

        <div>
          <span className="text-body-md text-primary cursor-pointer hover:underline">Business settings change log</span>
        </div>
      </div>
    </div>
  );
}
