import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
  });

  if (!client) notFound();

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text">Details</h1>
          <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
            Edit <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* General details */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-text">General details</h2>
          <div className="flex items-start gap-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-white">
              {client.firstName[0]}{client.lastName[0]}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex gap-16">
                <span className="w-28 text-text-secondary">Name:</span>
                <span>Ms {client.firstName} ({client.firstName.slice(0, 3)}) {client.lastName}</span>
              </div>
              <div className="flex gap-16">
                <span className="w-28 text-text-secondary">Date of birth:</span>
                <span>{client.dateOfBirth}{client.dateOfBirth ? ` (${calcAge(client.dateOfBirth)})` : ""}</span>
              </div>
              <div className="flex gap-16">
                <span className="w-28 text-text-secondary">Gender:</span>
                <span>Woman or female</span>
              </div>
              <div className="flex gap-16">
                <span className="w-28 text-text-secondary">Occupation:</span>
                <span>N/A</span>
              </div>
            </div>
          </div>
        </section>

        <hr className="mb-8 border-border" />

        {/* Contact details */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-text">Client contact details</h2>
          <div className="space-y-3 text-sm">
            {client.email && (
              <div className="flex gap-16">
                <span className="w-28 text-text-secondary">Email:</span>
                <span className="text-primary">{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex gap-16">
                <span className="w-28 text-text-secondary">Phone numbers:</span>
                <span>
                  <span className="text-primary">{client.phone}</span>
                  <span className="ml-1 text-text-secondary">(Mobile)</span>
                </span>
              </div>
            )}
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
          <p className="text-sm text-text">Accepted</p>
        </section>

        <hr className="mb-8 border-border" />

        {/* Medications */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-text">Medications, allergies &amp; intolerances</h2>
          <div className="space-y-3 text-sm">
            <div className="flex gap-16">
              <span className="w-28 text-text-secondary">Medications:</span>
              <span>sdfghjkl; 1/120</span>
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

        {/* Medicare/NDIS details */}
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
          <p className="text-sm text-text-secondary">No custom fields</p>
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
          <h2 className="mb-4 text-lg font-bold text-text">Associated contacts</h2>
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
              <tr>
                <td colSpan={6} className="py-4 text-center text-text-secondary">
                  No associated contacts
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <button className="text-sm text-primary hover:underline">View change log</button>
      </div>

      {/* Right panel */}
      <aside className="w-64 shrink-0 border-l border-border bg-white p-4 overflow-y-auto">
        {/* Account balance */}
        <div className="rounded-lg bg-green-600 p-4 text-white mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Account balance</h3>
            <span className="text-xs">&#9432;</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span>They owe &#9432;</span>
            <span className="font-bold">38,209.21</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Available credit balance</span>
            <span className="font-bold">6,127.40</span>
          </div>
        </div>

        {/* Client tags */}
        <div className="mb-4 border-b border-border pb-3">
          <button className="flex w-full items-center justify-between text-sm font-semibold text-text">
            Client tags
            <span className="text-text-secondary">&#9660;</span>
          </button>
          <div className="mt-2">
            <span className="rounded bg-orange-500 px-2 py-0.5 text-xs font-medium text-white">Dual funding</span>
          </div>
        </div>

        {/* Stripe */}
        <div className="mb-4 border-b border-border pb-3">
          <button className="flex w-full items-center justify-between text-sm font-semibold text-text">
            Stripe
            <span className="text-text-secondary">&#9660;</span>
          </button>
          <p className="mt-2 text-xs text-text-secondary">
            Connect with Stripe and save a credit card for clients and use for future use.
          </p>
        </div>

        {/* Mailchimp */}
        <div className="mb-4 border-b border-border pb-3">
          <button className="flex w-full items-center justify-between text-sm font-semibold text-text">
            Mailchimp
            <span className="text-text-secondary">&#9660;</span>
          </button>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-primary">ruvi.r@splose.com</span>
              <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-medium text-orange-600">ARCHIVED</span>
            </div>
            <p className="text-text-secondary">{client.firstName} {client.lastName}</p>
            <p className="text-text-secondary">Open rate: 0%</p>
            <p className="text-text-secondary">Click rate: 0%</p>
            <p className="text-text-secondary">Opt-in: 4:16 pm, 24 Mar 2025</p>
            <button className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-text hover:bg-gray-50">
              Unlink
            </button>
          </div>
        </div>

        {/* QuickBooks */}
        <div className="mb-4">
          <button className="flex w-full items-center justify-between text-sm font-semibold text-text">
            QuickBooks
            <span className="text-text-secondary">&#9660;</span>
          </button>
        </div>
      </aside>
    </div>
  );
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
