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
    include: {
      appointments: {
        include: { practitioner: true },
        orderBy: { date: "desc" },
        take: 10,
      },
      clinicalNotes: {
        include: { practitioner: true },
        orderBy: { date: "desc" },
        take: 5,
      },
      invoices: {
        orderBy: { date: "desc" },
        take: 5,
      },
    },
  });

  if (!client) notFound();

  const sidebarSections = [
    { label: "Details", count: null, active: true },
    { label: "Appointments", count: client.appointments.length },
    { label: "Communications", count: 0 },
    { label: "Files", count: 0 },
    { label: "Progress notes", count: client.clinicalNotes.length },
    { label: "Cases", count: 0 },
    { label: "Support activities", count: null },
    { label: "Forms", count: 0 },
    { label: "Invoices", count: client.invoices.length },
    { label: "Payments", count: 0 },
    { label: "Statements", count: null },
    { label: "Letters", count: 0 },
    { label: "Practitioner access", count: null },
  ];

  return (
    <div className="flex min-h-[calc(100vh-3rem)]">
      {/* Left sidebar */}
      <aside className="w-56 shrink-0 border-r border-border bg-white overflow-y-auto">
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-text">Client</h2>
            <span className="text-sm text-text-secondary">
              {client.firstName[0].toLowerCase()}{client.lastName[0].toLowerCase()}
            </span>
          </div>
        </div>
        <nav className="border-t border-border">
          {sidebarSections.map((section) => (
            <button
              key={section.label}
              className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                section.active
                  ? "border-l-2 border-primary bg-purple-50 text-primary font-medium"
                  : "text-text-secondary hover:bg-gray-50"
              }`}
            >
              <span>{section.label}</span>
              {section.count !== null && (
                <span className="text-xs text-text-secondary">{section.count}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top action bar */}
        <div className="flex items-center justify-end gap-2 border-b border-border px-6 py-3">
          <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
            &#9743; New SMS
          </button>
          <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
            &#9993; New email
          </button>
          <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
            Actions &#9660;
          </button>
        </div>

        <div className="p-6">
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
                  <span className="w-28 text-text-secondary">Date of birth:</span>
                  <span>{client.dateOfBirth}</span>
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
              {client.address && (
                <div className="flex gap-16">
                  <span className="w-28 text-text-secondary">Address:</span>
                  <span>{client.address}</span>
                </div>
              )}
            </div>
          </section>

          <hr className="mb-8 border-border" />

          {/* Privacy policy consent */}
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-bold text-text">Privacy policy consent</h2>
            <p className="text-sm text-text-secondary">No response</p>
          </section>

          <hr className="mb-8 border-border" />

          {/* Medications */}
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

          {/* Medicare/NDIS details */}
          {(client.medicare || client.ndisNumber) && (
            <>
              <section className="mb-8">
                <h2 className="mb-4 text-lg font-bold text-text">
                  {client.medicare ? "Medicare details" : "NDIS details"}
                </h2>
                <div className="flex gap-16 text-sm">
                  <span className="w-28 text-text-secondary">
                    {client.medicare ? "Card number:" : "NDIS number:"}
                  </span>
                  <span>{client.medicare || client.ndisNumber}</span>
                </div>
              </section>
              <hr className="mb-8 border-border" />
            </>
          )}

          {/* Associated contacts */}
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-bold text-text">Associated contacts</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 text-left font-medium text-text">Name</th>
                  <th className="pb-2 text-left font-medium text-text">Type</th>
                  <th className="pb-2 text-left font-medium text-text">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3} className="py-4 text-center text-text-secondary">
                    No associated contacts
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <button className="text-sm text-primary hover:underline">View change log</button>
        </div>
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
            <span>They owe</span>
            <span className="font-bold">0.00</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Available credit balance</span>
            <span className="font-bold">0.00</span>
          </div>
        </div>

        {/* Client tags */}
        <div className="mb-4 border-b border-border pb-3">
          <button className="flex w-full items-center justify-between text-sm font-semibold text-text">
            Client tags
            <span className="text-text-secondary">&#9660;</span>
          </button>
          {client.ndisNumber ? (
            <div className="mt-2">
              <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">NDIS</span>
            </div>
          ) : (
            <p className="mt-2 text-xs text-text-secondary">No tags</p>
          )}
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
        <div className="mb-4">
          <button className="flex w-full items-center justify-between text-sm font-semibold text-text">
            Mailchimp
            <span className="text-text-secondary">&#9660;</span>
          </button>
          <p className="mt-2 text-xs text-text-secondary">Not connected</p>
        </div>
      </aside>
    </div>
  );
}
