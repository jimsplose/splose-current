"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Pencil } from "lucide-react";
import {
  Avatar,
  Button,
  Badge,
  FileUpload,
  FormInput,
  FormSelect,
  FormTextarea,
  HintIcon,
  List,
  Collapse,
  Toggle,
} from "@/components/ds";

interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  address: string | null;
  medicare: string | null;
  ndisNumber: string | null;
  notes: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function calcAge(dobStr: string): string {
  try {
    const dob = new Date(dobStr + "T00:00:00");
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) years--;
    return `${years} years old`;
  } catch {
    return "";
  }
}

export default function ClientDetailClient({ client }: { client: ClientData }) {
  const [editMode, setEditMode] = useState(false);
  const searchParams = useSearchParams();
  const forcedState = searchParams.get("state");

  useEffect(() => {
    if (forcedState === "edit-mode") {
      setEditMode(true);
    }
  }, [forcedState]);

  if (editMode) {
    return <EditDetailsForm client={client} onCancel={() => setEditMode(false)} />;
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-display-md text-text">Details</h1>
          <Button variant="secondary" size="sm" onClick={() => setEditMode(true)}>
            Edit <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* General details */}
        <section className="mb-8">
          <h2 className="mb-4 text-heading-lg text-text">General details</h2>
          <div className="mb-3 flex items-center gap-4 text-body-md">
            <Avatar name={`${client.firstName} ${client.lastName}`} />
            <span>
              {client.firstName} {client.lastName}
            </span>
          </div>
          <List
            items={[
              ...(client.dateOfBirth
                ? [
                    {
                      label: "Date of birth:",
                      value: `${client.dateOfBirth} (${calcAge(client.dateOfBirth)})`,
                    },
                  ]
                : []),
              { label: "Sex:", value: "Not specified" },
            ]}
          />
        </section>

        <hr className="mb-8 border-border" />

        {/* Client contact details */}
        <section className="mb-8">
          <h2 className="mb-4 text-heading-lg text-text">
            Client contact details
          </h2>
          <List
            items={[
              {
                label: "Email:",
                value: (
                  <span className="text-primary">
                    {client.email || "\u2014"}
                  </span>
                ),
              },
              {
                label: "Phone numbers:",
                value: (
                  <span className="text-primary">
                    {client.phone || "\u2014"}
                  </span>
                ),
              },
              { label: "Preference:", value: "None" },
              ...(client.address
                ? [{ label: "Address:", value: client.address }]
                : []),
              {
                label: "Timezone:",
                value: "GMT+10:30 - Australia/Adelaide",
              },
            ]}
          />
        </section>

        <hr className="mb-8 border-border" />

        {/* Privacy policy consent */}
        <section className="mb-8">
          <h2 className="mb-4 text-heading-lg text-text">
            Privacy policy consent
          </h2>
          <List items={[{ label: "", value: "No response" }]} />
        </section>

        <hr className="mb-8 border-border" />

        {/* Medications, allergies & intolerances */}
        <section className="mb-8">
          <h2 className="mb-4 text-heading-lg text-text">
            Medications, allergies &amp; intolerances
          </h2>
          <List
            items={[
              { label: "Medications:", value: "None" },
              { label: "Allergies:", value: "None" },
              { label: "Intolerances:", value: "None" },
            ]}
          />
        </section>

        <hr className="mb-8 border-border" />

        {/* Medicare details */}
        {client.medicare && (
          <>
            <section className="mb-8">
              <h2 className="mb-4 text-heading-lg text-text">
                Medicare details
              </h2>
              <List
                items={[
                  { label: "Card number:", value: client.medicare },
                ]}
              />
            </section>
            <hr className="mb-8 border-border" />
          </>
        )}

        {client.ndisNumber && (
          <>
            <section className="mb-8">
              <h2 className="mb-4 text-heading-lg text-text">
                NDIS details
              </h2>
              <List
                items={[
                  { label: "NDIS number:", value: client.ndisNumber },
                ]}
              />
            </section>
            <hr className="mb-8 border-border" />
          </>
        )}

        {/* Custom fields */}
        <section className="mb-8">
          <h2 className="mb-4 text-heading-lg text-text">Custom fields</h2>
          <List
            items={[
              { label: "Date since surgery:", value: "25/09/2025" },
              { label: "Note:", value: "Note short text check" },
            ]}
          />
        </section>

        <hr className="mb-8 border-border" />

        {/* Invoicing */}
        <section className="mb-8">
          <h2 className="mb-4 text-heading-lg text-text">Invoicing</h2>
          <List
            items={[
              {
                label: "Invoice reminder preference:",
                value: "On",
              },
            ]}
          />
        </section>

        <hr className="mb-8 border-border" />

        {/* Associated contacts */}
        <section className="mb-8">
          <h2 className="mb-4 text-heading-lg text-text">
            Associated contacts{" "}
            <HintIcon className="ml-1" />
          </h2>
          <table className="w-full text-body-md">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left text-label-lg text-text">Name</th>
                <th className="pb-2 text-left text-label-lg text-text">Type</th>
                <th className="pb-2 text-left text-label-lg text-text">Notes</th>
                <th className="pb-2 text-center text-label-lg text-text">Appts</th>
                <th className="pb-2 text-center text-label-lg text-text">Invoices</th>
                <th className="pb-2 text-center text-label-lg text-text">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2 text-primary">Test doctor</td>
                <td className="py-2">Doctor</td>
                <td className="py-2">hello</td>
                <td className="py-2 text-center"></td>
                <td className="py-2 text-center"></td>
                <td className="py-2 text-center"></td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 text-primary">Jo malone</td>
                <td className="py-2">Standard</td>
                <td className="py-2">N/A</td>
                <td className="py-2 text-center"></td>
                <td className="py-2 text-center"></td>
                <td className="py-2 text-center"></td>
              </tr>
            </tbody>
          </table>
        </section>

        <Button variant="ghost" size="sm" className="text-primary hover:bg-transparent hover:underline">View change log</Button>
      </div>

      {/* Right panel */}
      <aside className="w-[280px] shrink-0 overflow-y-auto border-l border-border bg-white p-4">
        {/* Account balance */}
        <div className="mb-4 rounded-lg bg-primary p-4 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-label-lg">Account balance</h3>
            <HintIcon className="h-5 w-5 border-white/50 text-white/80" />
          </div>
          <div className="mt-2 flex items-center justify-between text-body-md">
            <span className="flex items-center gap-1">
              They owe
              <HintIcon className="border-white/40 text-white/80" />
            </span>
            <span className="text-body-md-strong">3,310.56</span>
          </div>
          <div className="flex items-center justify-between text-body-md">
            <span>Available credit balance</span>
            <span className="text-body-md-strong">0.00</span>
          </div>
        </div>

        {/* Client alerts */}
        <Collapse title="Client alerts" defaultOpen>
          <span className="text-body-md text-text">Include KM</span>
        </Collapse>

        {/* Stripe */}
        <Collapse title="Stripe" defaultOpen>
          <p className="text-body-sm text-text-secondary">
            Connect with Stripe and save a credit card for clients and use for
            future use.
          </p>
        </Collapse>

        {/* Mailchimp */}
        <Collapse title="Mailchimp" defaultOpen>
          <div className="space-y-1 text-body-sm">
            <div className="flex items-center gap-1">
              <span className="text-primary">rakesh.splose@gmail.com</span>
              <Badge variant="orange" className="text-caption-sm">
                ARCHIVED
              </Badge>
            </div>
            <p className="text-text-secondary">a a</p>
            <p className="text-text-secondary">Open rate: 0%</p>
            <p className="text-text-secondary">Click rate: 0%</p>
            <p className="text-text-secondary">
              Opt-in: 11:41 am, 16 Nov 2022
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-2 w-full text-body-sm"
            >
              Unlink
            </Button>
          </div>
        </Collapse>

        {/* QuickBooks */}
        <Collapse title="QuickBooks">
          <p className="text-body-sm text-text-secondary">
            No QuickBooks connection.
          </p>
        </Collapse>
      </aside>
    </div>
  );
}

/* ─── Edit Details Form ────────────────────────────────────────── */

function EditDetailsForm({ client, onCancel }: { client: ClientData; onCancel: () => void }) {
  const dobParts = client.dateOfBirth ? client.dateOfBirth.split("-") : ["2025", "01", "01"];
  const [invoiceReminder, setInvoiceReminder] = useState(true);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-display-md text-text">Edit details</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onCancel}>
            Save
          </Button>
        </div>
      </div>

      <div className="max-w-2xl">
        {/* General details with profile photo side-by-side */}
        <section className="mb-8">
          <h2 className="mb-4 text-heading-lg text-text">General details</h2>
          <div className="flex gap-8">
            {/* Form fields */}
            <div className="flex-1 space-y-4">
              <FormSelect
                label="Title"
                options={[
                  { value: "", label: "Title" },
                  { value: "Mr", label: "Mr" },
                  { value: "Mrs", label: "Mrs" },
                  { value: "Ms", label: "Ms" },
                  { value: "Dr", label: "Dr" },
                ]}
              />

              <div className="grid grid-cols-3 gap-3">
                <FormInput
                  label="First name*"
                  type="text"
                  defaultValue={client.firstName}
                />
                <FormInput
                  label="Middle name"
                  type="text"
                  placeholder="Middle name"
                />
                <FormInput
                  label="Last name*"
                  type="text"
                  defaultValue={client.lastName}
                />
              </div>

              <FormInput label="Preferred name" type="text" />

              <div className="grid grid-cols-3 gap-3">
                <FormSelect
                  label="Day"
                  defaultValue={dobParts[2]}
                  options={Array.from({ length: 31 }, (_, i) => ({
                    value: String(i + 1),
                    label: String(i + 1),
                  }))}
                />
                <FormSelect
                  label="Month"
                  defaultValue={dobParts[1]}
                  options={[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((m, i) => ({
                    value: String(i + 1).padStart(2, "0"),
                    label: m,
                  }))}
                />
                <FormSelect
                  label="Year"
                  defaultValue={dobParts[0]}
                  options={Array.from({ length: 100 }, (_, i) => {
                    const y = 2026 - i;
                    return { value: String(y), label: String(y) };
                  })}
                />
              </div>

              <FormSelect
                label="Sex"
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" },
                  { value: "Not specified", label: "Not specified" },
                ]}
              />

              <FormSelect
                label="Gender identity"
                options={[
                  { value: "", label: "" },
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Non-binary", label: "Non-binary" },
                  { value: "Other", label: "Other" },
                ]}
              />

              <FormInput
                label="Pronouns"
                type="text"
                placeholder="they / them"
              />

              <FormInput label="Occupation" type="text" />
            </div>

            {/* Profile photo - positioned to the right */}
            <div className="shrink-0 pt-6 text-center">
              <FileUpload
                icon={<span className="text-body-md text-text-secondary">Profile photo</span>}
                label="Upload"
                className="h-32 w-32 p-0"
              />
            </div>
          </div>
        </section>

        {/* Other details */}
        <section className="mb-8">
          <h2 className="mb-4 text-heading-lg text-text">Other details</h2>
          <FormTextarea
            defaultValue='For fields that are not available with the splose template, will show up here if they are all included in "Other Details" on the CSV file.'
            rows={4}
          />
        </section>

        {/* Alerts */}
        <section className="mb-8">
          <h2 className="mb-4 text-heading-lg text-text">Alerts</h2>
          <p className="mb-2 text-body-md text-text-secondary">
            Information you add here will be displayed in important places like scheduling appointments.
          </p>
          <FormTextarea defaultValue="Include KM" rows={3} />
        </section>

        {/* Contact details */}
        <section className="mb-8">
          <h2 className="mb-4 text-heading-lg text-text">Contact details</h2>
          <div className="space-y-4">
            <FormInput label="Email" type="email" defaultValue={client.email || ""} />
            <FormInput label="Phone" type="tel" defaultValue={client.phone || ""} />
            <FormInput label="Address" type="text" defaultValue={client.address || ""} />
          </div>
        </section>

        {/* Medicare */}
        {client.medicare && (
          <section>
            <h2 className="mb-4 text-heading-lg text-text">Medicare details</h2>
            <FormInput label="Card number" type="text" defaultValue={client.medicare} />
          </section>
        )}

        {/* NDIS */}
        {client.ndisNumber && (
          <section className="mb-8">
            <h2 className="mb-4 text-heading-lg text-text">NDIS details</h2>
            <FormInput label="NDIS number" type="text" defaultValue={client.ndisNumber} />
          </section>
        )}

        {/* Privacy policy consent */}
        <section className="mb-8">
          <h2 className="mb-4 text-heading-lg text-text">Privacy policy consent</h2>
          <FormSelect
            label="Consent status"
            defaultValue="no-response"
            options={[
              { value: "no-response", label: "No response" },
              { value: "accepted", label: "Accepted" },
              { value: "declined", label: "Declined" },
            ]}
          />
        </section>

        {/* Medications, allergies & intolerances */}
        <section className="mb-8">
          <h2 className="mb-4 text-heading-lg text-text">Medications, allergies &amp; intolerances</h2>
          <div className="space-y-4">
            <FormTextarea label="Medications" defaultValue="" placeholder="None" rows={2} />
            <FormTextarea label="Allergies" defaultValue="" placeholder="None" rows={2} />
            <FormTextarea label="Intolerances" defaultValue="" placeholder="None" rows={2} />
          </div>
        </section>

        {/* Custom fields */}
        <section className="mb-8">
          <h2 className="mb-4 text-heading-lg text-text">Custom fields</h2>
          <div className="space-y-4">
            <FormInput label="Date since surgery" type="text" defaultValue="25/09/2025" />
            <FormInput label="Note" type="text" defaultValue="Note short text check" />
          </div>
        </section>

        {/* Invoicing */}
        <section className="mb-8">
          <h2 className="mb-4 text-heading-lg text-text">Invoicing</h2>
          <div className="flex items-center justify-between">
            <span className="text-body-md text-text">Invoice reminder preference</span>
            <Toggle checked={invoiceReminder} onChange={setInvoiceReminder} />
          </div>
        </section>
      </div>
    </div>
  );
}
