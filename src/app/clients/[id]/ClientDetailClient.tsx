"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Pencil, ChevronDown, Upload } from "lucide-react";
import { Button, Badge, FormInput, FormSelect } from "@/components/ds";

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
          <h1 className="text-xl font-bold text-text">Details</h1>
          <Button variant="secondary" size="sm" onClick={() => setEditMode(true)}>
            Edit <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* General details */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-text">General details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {client.firstName[0]}
                {client.lastName[0]}
              </div>
              <span>
                {client.firstName} {client.lastName}
              </span>
            </div>
            {client.dateOfBirth && (
              <div className="flex gap-16">
                <span className="w-28 text-text-secondary">Date of birth:</span>
                <span>
                  {client.dateOfBirth} ({calcAge(client.dateOfBirth)})
                </span>
              </div>
            )}
            <div className="flex gap-16">
              <span className="w-28 text-text-secondary">Sex:</span>
              <span>Not specified</span>
            </div>
          </div>
        </section>

        <hr className="mb-8 border-border" />

        {/* Client contact details */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-text">Client contact details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex gap-16">
              <span className="w-28 text-text-secondary">Email:</span>
              <span className="text-primary">{client.email || "—"}</span>
            </div>
            <div className="flex gap-16">
              <span className="w-28 text-text-secondary">Phone numbers:</span>
              <span className="text-primary">{client.phone || "—"}</span>
            </div>
            <div className="flex gap-16">
              <span className="w-28 text-text-secondary">Preference:</span>
              <span>None</span>
            </div>
            {client.address && (
              <div className="flex gap-16">
                <span className="w-28 text-text-secondary">Address:</span>
                <span>{client.address}</span>
              </div>
            )}
            <div className="flex gap-16">
              <span className="w-28 text-text-secondary">Timezone:</span>
              <span>GMT+10:30 - Australia/Adelaide</span>
            </div>
          </div>
        </section>

        <hr className="mb-8 border-border" />

        {/* Privacy policy consent */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-text">Privacy policy consent</h2>
          <div className="flex gap-16 text-sm">
            <span className="w-28 text-text-secondary"></span>
            <span>No response</span>
          </div>
        </section>

        <hr className="mb-8 border-border" />

        {/* Medications, allergies & intolerances */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-text">Medications, allergies &amp; intolerances</h2>
          <div className="space-y-3 text-sm">
            <div className="flex gap-16">
              <span className="w-28 text-text-secondary">Medications:</span>
              <span>None</span>
            </div>
            <div className="flex gap-16">
              <span className="w-28 text-text-secondary">Allergies:</span>
              <span>None</span>
            </div>
            <div className="flex gap-16">
              <span className="w-28 text-text-secondary">Intolerances:</span>
              <span>None</span>
            </div>
          </div>
        </section>

        <hr className="mb-8 border-border" />

        {/* Medicare details */}
        {client.medicare && (
          <>
            <section className="mb-8">
              <h2 className="mb-4 text-lg font-bold text-text">Medicare details</h2>
              <div className="flex gap-16 text-sm">
                <span className="w-28 text-text-secondary">Card number:</span>
                <span>{client.medicare}</span>
              </div>
            </section>
            <hr className="mb-8 border-border" />
          </>
        )}

        {client.ndisNumber && (
          <>
            <section className="mb-8">
              <h2 className="mb-4 text-lg font-bold text-text">NDIS details</h2>
              <div className="flex gap-16 text-sm">
                <span className="w-28 text-text-secondary">NDIS number:</span>
                <span>{client.ndisNumber}</span>
              </div>
            </section>
            <hr className="mb-8 border-border" />
          </>
        )}

        {/* Custom fields */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-text">Custom fields</h2>
          <div className="space-y-3 text-sm">
            <div className="flex gap-16">
              <span className="w-28 text-text-secondary">Date since surgery:</span>
              <span>25/09/2025</span>
            </div>
            <div className="flex gap-16">
              <span className="w-28 text-text-secondary">Note:</span>
              <span>Note short text check</span>
            </div>
          </div>
        </section>

        <hr className="mb-8 border-border" />

        {/* Invoicing */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-text">Invoicing</h2>
          <div className="flex gap-16 text-sm">
            <span className="w-28 text-text-secondary">Invoice reminder preference:</span>
            <span>On</span>
          </div>
        </section>

        <hr className="mb-8 border-border" />

        {/* Associated contacts */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-text">
            Associated contacts{" "}
            <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-text-secondary text-[10px] text-text-secondary">
              ?
            </span>
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left font-medium text-text">Name</th>
                <th className="pb-2 text-left font-medium text-text">Type</th>
                <th className="pb-2 text-left font-medium text-text">Notes</th>
                <th className="pb-2 text-center font-medium text-text">Appts</th>
                <th className="pb-2 text-center font-medium text-text">Invoices</th>
                <th className="pb-2 text-center font-medium text-text">Notes</th>
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
            <h3 className="text-sm font-medium">Account balance</h3>
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/50 text-[10px]">
              i
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              They owe
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/40 text-[9px]">
                i
              </span>
            </span>
            <span className="font-bold">3,310.56</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Available credit balance</span>
            <span className="font-bold">0.00</span>
          </div>
        </div>

        {/* Client alerts */}
        <div className="mb-4 border-b border-border pb-3">
          <button className="flex w-full items-center justify-between text-sm font-semibold text-text">
            Client alerts
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          </button>
          <div className="mt-2">
            <span className="text-sm text-text">Include KM</span>
          </div>
        </div>

        {/* Stripe */}
        <div className="mb-4 border-b border-border pb-3">
          <button className="flex w-full items-center justify-between text-sm font-semibold text-text">
            Stripe
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          </button>
          <p className="mt-2 text-xs text-text-secondary">
            Connect with Stripe and save a credit card for clients and use for future use.
          </p>
        </div>

        {/* Mailchimp */}
        <div className="mb-4 border-b border-border pb-3">
          <button className="flex w-full items-center justify-between text-sm font-semibold text-text">
            Mailchimp
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          </button>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-primary">rakesh.splose@gmail.com</span>
              <Badge variant="orange" className="text-[10px]">ARCHIVED</Badge>
            </div>
            <p className="text-text-secondary">a a</p>
            <p className="text-text-secondary">Open rate: 0%</p>
            <p className="text-text-secondary">Click rate: 0%</p>
            <p className="text-text-secondary">Opt-in: 11:41 am, 16 Nov 2022</p>
            <Button variant="secondary" size="sm" className="mt-2 w-full text-xs">
              Unlink
            </Button>
          </div>
        </div>

        {/* QuickBooks */}
        <div className="mb-4">
          <button className="flex w-full items-center justify-between text-sm font-semibold text-text">
            QuickBooks
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          </button>
        </div>
      </aside>
    </div>
  );
}

/* ─── Edit Details Form ────────────────────────────────────────── */

function EditDetailsForm({ client, onCancel }: { client: ClientData; onCancel: () => void }) {
  const dobParts = client.dateOfBirth ? client.dateOfBirth.split("-") : ["2025", "01", "01"];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-text">Edit details</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onCancel}>
            Save
          </Button>
        </div>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* General details */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-text">General details</h2>
          <div className="space-y-4">
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
              <FormInput label="First name*" type="text" defaultValue={client.firstName} />
              <FormInput label="Middle name" type="text" placeholder="Middle name" />
              <FormInput label="Last name*" type="text" defaultValue={client.lastName} />
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
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December",
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

            <FormInput label="Pronouns" type="text" placeholder="they / them" />

            <FormInput label="Occupation" type="text" />
          </div>
        </section>

        {/* Profile photo */}
        <div className="flex items-start gap-8">
          <div className="flex-1" />
          <div className="text-center">
            <div className="mb-2 flex h-28 w-28 items-center justify-center rounded-lg border-2 border-dashed border-border text-sm text-text-secondary">
              Profile photo
            </div>
            <Button variant="secondary" size="sm">
              <Upload className="h-3.5 w-3.5" />
              Upload
            </Button>
          </div>
        </div>

        {/* Other details */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-text">Other details</h2>
          <textarea
            defaultValue='For fields that are not available with the splose template, will show up here if they are all included in "Other Details" on the CSV file.'
            rows={4}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </section>

        {/* Alerts */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-text">Alerts</h2>
          <p className="mb-2 text-sm text-text-secondary">
            Information you add here will be displayed in important places like scheduling appointments.
          </p>
          <textarea defaultValue="Include KM" rows={3} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" />
        </section>

        {/* Contact details */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-text">Contact details</h2>
          <div className="space-y-4">
            <FormInput label="Email" type="email" defaultValue={client.email || ""} />
            <FormInput label="Phone" type="tel" defaultValue={client.phone || ""} />
            <FormInput label="Address" type="text" defaultValue={client.address || ""} />
          </div>
        </section>

        {/* Medicare */}
        {client.medicare && (
          <section>
            <h2 className="mb-4 text-lg font-bold text-text">Medicare details</h2>
            <FormInput label="Card number" type="text" defaultValue={client.medicare} />
          </section>
        )}

        {/* NDIS */}
        {client.ndisNumber && (
          <section>
            <h2 className="mb-4 text-lg font-bold text-text">NDIS details</h2>
            <FormInput label="NDIS number" type="text" defaultValue={client.ndisNumber} />
          </section>
        )}
      </div>
    </div>
  );
}
