"use client";

import { useState } from "react";
import { Pencil, ChevronDown, Upload } from "lucide-react";

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

  if (editMode) {
    return <EditDetailsForm client={client} onCancel={() => setEditMode(false)} />;
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-text">Details</h1>
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50"
          >
            Edit <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* General details */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-text">General details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-4">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
              >
                {client.firstName[0]}{client.lastName[0]}
              </div>
              <span>{client.firstName} {client.lastName}</span>
            </div>
            {client.dateOfBirth && (
              <div className="flex gap-16">
                <span className="w-28 text-text-secondary">Date of birth:</span>
                <span>{client.dateOfBirth} ({calcAge(client.dateOfBirth)})</span>
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
          <h2 className="mb-4 text-lg font-bold text-text">
            Medications, allergies &amp; intolerances
          </h2>
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

        <button className="text-sm text-primary hover:underline">View change log</button>
      </div>

      {/* Right panel */}
      <aside className="w-[280px] shrink-0 border-l border-border bg-white p-4 overflow-y-auto">
        {/* Account balance */}
        <div className="rounded-lg bg-primary p-4 text-white mb-4">
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
              <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-medium text-orange-600">
                ARCHIVED
              </span>
            </div>
            <p className="text-text-secondary">a a</p>
            <p className="text-text-secondary">Open rate: 0%</p>
            <p className="text-text-secondary">Click rate: 0%</p>
            <p className="text-text-secondary">Opt-in: 11:41 am, 16 Nov 2022</p>
            <button className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-text hover:bg-gray-50">
              Unlink
            </button>
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
  const inputClass = "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";
  const labelClass = "block text-sm font-medium text-text mb-1";

  const dobParts = client.dateOfBirth ? client.dateOfBirth.split("-") : ["2025", "01", "01"];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-text">Edit details</h1>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={onCancel} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            Save
          </button>
        </div>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* General details */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-text">General details</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Title</label>
              <select className={inputClass}>
                <option>Title</option>
                <option>Mr</option>
                <option>Mrs</option>
                <option>Ms</option>
                <option>Dr</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>First name*</label>
                <input type="text" defaultValue={client.firstName} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Middle name</label>
                <input type="text" placeholder="Middle name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Last name*</label>
                <input type="text" defaultValue={client.lastName} className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Preferred name</label>
              <input type="text" className={inputClass} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Day</label>
                <select defaultValue={dobParts[2]} className={inputClass}>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Month</label>
                <select defaultValue={dobParts[1]} className={inputClass}>
                  {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => (
                    <option key={m} value={String(i + 1).padStart(2, "0")}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Year</label>
                <select defaultValue={dobParts[0]} className={inputClass}>
                  {Array.from({ length: 100 }, (_, i) => {
                    const y = 2026 - i;
                    return <option key={y} value={String(y)}>{y}</option>;
                  })}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Sex</label>
              <select className={inputClass}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Not specified</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Gender identity</label>
              <select className={inputClass}>
                <option value=""></option>
                <option>Male</option>
                <option>Female</option>
                <option>Non-binary</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Pronouns</label>
              <input type="text" placeholder="they / them" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Occupation</label>
              <input type="text" className={inputClass} />
            </div>
          </div>
        </section>

        {/* Profile photo */}
        <div className="flex items-start gap-8">
          <div className="flex-1" />
          <div className="text-center">
            <div className="mb-2 h-28 w-28 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-sm text-text-secondary">
              Profile photo
            </div>
            <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
              <Upload className="h-3.5 w-3.5" />
              Upload
            </button>
          </div>
        </div>

        {/* Other details */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-text">Other details</h2>
          <textarea
            defaultValue="For fields that are not available with the splose template, will show up here if they are all included in &quot;Other Details&quot; on the CSV file."
            rows={4}
            className={inputClass}
          />
        </section>

        {/* Alerts */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-text">Alerts</h2>
          <p className="mb-2 text-sm text-text-secondary">Information you add here will be displayed in important places like scheduling appointments.</p>
          <textarea defaultValue="Include KM" rows={3} className={inputClass} />
        </section>

        {/* Contact details */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-text">Contact details</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" defaultValue={client.email || ""} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="tel" defaultValue={client.phone || ""} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <input type="text" defaultValue={client.address || ""} className={inputClass} />
            </div>
          </div>
        </section>

        {/* Medicare */}
        {client.medicare && (
          <section>
            <h2 className="mb-4 text-lg font-bold text-text">Medicare details</h2>
            <div>
              <label className={labelClass}>Card number</label>
              <input type="text" defaultValue={client.medicare} className={inputClass} />
            </div>
          </section>
        )}

        {/* NDIS */}
        {client.ndisNumber && (
          <section>
            <h2 className="mb-4 text-lg font-bold text-text">NDIS details</h2>
            <div>
              <label className={labelClass}>NDIS number</label>
              <input type="text" defaultValue={client.ndisNumber} className={inputClass} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
