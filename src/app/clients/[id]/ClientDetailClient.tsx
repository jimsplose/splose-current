"use client";

import { Pencil, ChevronDown } from "lucide-react";

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
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-text">Details</h1>
          <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
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
