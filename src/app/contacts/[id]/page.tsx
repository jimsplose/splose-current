import { Mail, Phone, MapPin, Building2 } from "lucide-react";
import { Avatar, Button, DataTable, TableHead, Th, TableBody, Tr, Td, LinkCell, EmptyState } from "@/components/ds";

const mockContacts = [
  {
    id: "1",
    type: "",
    name: "jh",
    company: "",
    email: "",
    workPhone: "",
    mobilePhone: "",
    address: "",
    notes: "",
    associatedClients: [] as { id: string; name: string }[],
  },
  {
    id: "2",
    type: "3rd party payer",
    name: "NDIS",
    company: "",
    email: "ruvishka.info@gmail.com",
    workPhone: "",
    mobilePhone: "",
    address: "",
    notes: "National Disability Insurance Scheme",
    associatedClients: [
      { id: "c1", name: "Alex Anders" },
      { id: "c2", name: "Ruvishka Perera" },
    ],
  },
  {
    id: "3",
    type: "Doctor",
    name: "Cheng Contact",
    company: "woodlake medical centre",
    email: "cheng@splose.com",
    workPhone: "",
    mobilePhone: "",
    address: "123 Woodlake Rd, Adelaide SA 5000",
    notes: "",
    associatedClients: [{ id: "c3", name: "Sarah Johnson" }],
  },
  {
    id: "4",
    type: "Plan manager",
    name: "scott",
    company: "",
    email: "sctt@splose.com",
    workPhone: "",
    mobilePhone: "",
    address: "",
    notes: "",
    associatedClients: [] as { id: string; name: string }[],
  },
  {
    id: "5",
    type: "Standard",
    name: "Company A",
    company: "",
    email: "",
    workPhone: "",
    mobilePhone: "",
    address: "",
    notes: "",
    associatedClients: [] as { id: string; name: string }[],
  },
  {
    id: "6",
    type: "Parent",
    name: "Test",
    company: "",
    email: "",
    workPhone: "",
    mobilePhone: "",
    address: "",
    notes: "",
    associatedClients: [{ id: "c4", name: "Emma Wilson" }],
  },
  {
    id: "7",
    type: "3rd party payer",
    name: "NDIS",
    company: "",
    email: "",
    workPhone: "",
    mobilePhone: "",
    address: "",
    notes: "",
    associatedClients: [] as { id: string; name: string }[],
  },
  {
    id: "8",
    type: "Doctor",
    name: "Wei",
    company: "This is wei's company",
    email: "wei.luo@splose.com",
    workPhone: "",
    mobilePhone: "+61 423939047",
    address: "45 Collins St, Melbourne VIC 3000",
    notes: "Preferred GP for referrals",
    associatedClients: [
      { id: "c5", name: "James Chen" },
      { id: "c6", name: "Lily Tran" },
    ],
  },
  {
    id: "9",
    type: "Plan manager",
    name: "Your Plan Manager",
    company: "",
    email: "",
    workPhone: "",
    mobilePhone: "",
    address: "",
    notes: "",
    associatedClients: [] as { id: string; name: string }[],
  },
  {
    id: "10",
    type: "Standard",
    name: "Harry Mann",
    company: "",
    email: "",
    workPhone: "",
    mobilePhone: "",
    address: "",
    notes: "",
    associatedClients: [] as { id: string; name: string }[],
  },
];

function getTypeColor(type: string): string {
  switch (type) {
    case "Doctor":
      return "bg-blue-100 text-blue-700";
    case "3rd party payer":
      return "bg-purple-100 text-purple-700";
    case "Plan manager":
      return "bg-green-100 text-green-700";
    case "Parent":
      return "bg-orange-100 text-orange-700";
    case "Standard":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contact = mockContacts.find((c) => c.id === id);

  if (!contact) {
    return (
      <div className="p-6">
        <p className="text-text-secondary">Contact not found.</p>
      </div>
    );
  }

  return (
    <div className="flex" style={{ height: "calc(100vh - 48px)" }}>
      {/* Sidebar */}
      <aside className="w-[180px] shrink-0 border-r border-border bg-white p-4">
        <div className="mb-4">
          <h2 className="text-body-md-strong text-text">Contact</h2>
          <p className="text-caption-md text-text-secondary">{contact.name}</p>
        </div>
        <nav className="space-y-0.5">
          {[
            { label: "Details", active: true },
            { label: "Cases", count: 0 },
            { label: "Letters", count: 0 },
            { label: "Invoices", count: contact.associatedClients.length > 0 ? 96 : 0 },
          ].map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className={`w-full justify-between text-sm ${
                "active" in item && item.active
                  ? "border-l-2 border-primary bg-primary/5 font-medium text-primary"
                  : "text-text-secondary hover:bg-gray-50"
              }`}
            >
              {item.label}
              {"count" in item && item.count ? <span className="text-xs text-text-secondary">{item.count}</span> : null}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top action bar */}
        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <div className="flex items-center gap-2">
            <h2 className="text-heading-lg text-text">Contact</h2>
            <span className="text-body-md text-text-secondary">{contact.name}</span>
          </div>
          <Button variant="secondary" size="sm">
            Actions
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </div>

        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-display-md text-text">Details</h1>
            <Button variant="secondary" size="sm">
              Edit
            </Button>
          </div>

          {/* General details */}
          <section className="mb-8">
            <h2 className="mb-4 text-heading-lg text-text">General details</h2>
            <div className="flex items-start gap-6">
              <Avatar name={contact.name} size="lg" />
              <div className="space-y-2 text-sm">
                <div className="flex gap-16">
                  <span className="w-28 shrink-0 text-text-secondary">Name:</span>
                  <span className="font-medium text-text">{contact.name}</span>
                </div>
                <div className="flex gap-16">
                  <span className="w-28 shrink-0 text-text-secondary">Type:</span>
                  <span>
                    {contact.type ? (
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-label-md ${getTypeColor(contact.type)}`}
                      >
                        {contact.type}
                      </span>
                    ) : (
                      <span className="text-text-secondary">Not set</span>
                    )}
                  </span>
                </div>
                <div className="flex gap-16">
                  <span className="w-28 shrink-0 text-text-secondary">Company:</span>
                  <span className="text-text">
                    {contact.company || <span className="text-text-secondary">Not provided</span>}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <hr className="mb-8 border-border" />

          {/* Contact information */}
          <section className="mb-8">
            <h2 className="mb-4 text-heading-lg text-text">Contact information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex gap-16">
                <span className="w-28 shrink-0 text-text-secondary">Email:</span>
                {contact.email ? (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-text-secondary" />
                    <span className="text-primary">{contact.email}</span>
                  </span>
                ) : (
                  <span className="text-text-secondary">Not provided</span>
                )}
              </div>
              <div className="flex gap-16">
                <span className="w-28 shrink-0 text-text-secondary">Work phone:</span>
                {contact.workPhone ? (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-text-secondary" />
                    <span className="text-primary">{contact.workPhone}</span>
                  </span>
                ) : (
                  <span className="text-text-secondary">Not provided</span>
                )}
              </div>
              <div className="flex gap-16">
                <span className="w-28 shrink-0 text-text-secondary">Mobile phone:</span>
                {contact.mobilePhone ? (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-text-secondary" />
                    <span className="text-primary">{contact.mobilePhone}</span>
                  </span>
                ) : (
                  <span className="text-text-secondary">Not provided</span>
                )}
              </div>
              <div className="flex gap-16">
                <span className="w-28 shrink-0 text-text-secondary">Address:</span>
                {contact.address ? (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-text-secondary" />
                    <span className="text-text">{contact.address}</span>
                  </span>
                ) : (
                  <span className="text-text-secondary">Not provided</span>
                )}
              </div>
            </div>
          </section>

          <hr className="mb-8 border-border" />

          {/* Notes */}
          <section className="mb-8">
            <h2 className="mb-4 text-heading-lg text-text">Notes</h2>
            {contact.notes ? (
              <p className="text-sm text-text">{contact.notes}</p>
            ) : (
              <p className="text-sm text-text-secondary">No notes</p>
            )}
          </section>

          <hr className="mb-8 border-border" />

          {/* Associated clients */}
          <section className="mb-8">
            <h2 className="mb-4 text-heading-lg text-text">Associated clients</h2>
            {contact.associatedClients.length > 0 ? (
              <DataTable>
                <TableHead>
                  <Th>Name</Th>
                  <Th>DOB</Th>
                  <Th align="center">Appts</Th>
                  <Th align="center">Invoices</Th>
                  <Th align="center">Notes</Th>
                </TableHead>
                <TableBody>
                  {contact.associatedClients.map((client) => (
                    <Tr key={client.id}>
                      <Td><LinkCell>{client.name}</LinkCell></Td>
                      <Td className="text-text-secondary">5 Jun 2011</Td>
                      <Td align="center" className="text-text-secondary"></Td>
                      <Td align="center" className="text-text-secondary"></Td>
                      <Td align="center" className="text-text-secondary"></Td>
                    </Tr>
                  ))}
                </TableBody>
              </DataTable>
            ) : (
              <EmptyState
                icon={<Building2 className="h-10 w-10 text-gray-400" />}
                message="No associated clients"
              />
            )}
          </section>

          <hr className="mb-8 border-border" />

          {/* Custom fields */}
          <section className="mb-8">
            <h2 className="mb-4 text-heading-lg text-text">Custom fields</h2>
            <p className="text-sm text-text-secondary">No custom fields</p>
          </section>

          <Button variant="ghost" size="sm" className="text-primary hover:underline">
            View change log
          </Button>
        </div>
      </div>
    </div>
  );
}
