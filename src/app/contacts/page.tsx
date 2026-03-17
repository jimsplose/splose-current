import { Plus, ArrowUpDown, Filter, Search } from "lucide-react";
import Link from "next/link";

const mockContacts = [
  { id: "1", type: "", name: "jh", company: "", email: "", workPhone: "", mobilePhone: "" },
  { id: "2", type: "3rd party payer", name: "NDIS", company: "", email: "ruvishka.info@gmail.com", workPhone: "", mobilePhone: "" },
  { id: "3", type: "Doctor", name: "Cheng Contact", company: "woodlake medical centre", email: "cheng@splose.com", workPhone: "", mobilePhone: "" },
  { id: "4", type: "Plan manager", name: "scott", company: "", email: "sctt@splose.com", workPhone: "", mobilePhone: "" },
  { id: "5", type: "Standard", name: "Company A", company: "", email: "", workPhone: "", mobilePhone: "" },
  { id: "6", type: "Parent", name: "Test", company: "", email: "", workPhone: "", mobilePhone: "" },
  { id: "7", type: "3rd party payer", name: "NDIS", company: "", email: "", workPhone: "", mobilePhone: "" },
  { id: "8", type: "Doctor", name: "Wei", company: "This is wei's company", email: "wei.luo@splose.com", workPhone: "", mobilePhone: "+61 423939047" },
  { id: "9", type: "Plan manager", name: "Your Plan Manager", company: "", email: "", workPhone: "", mobilePhone: "" },
  { id: "10", type: "Standard", name: "Harry Mann", company: "", email: "", workPhone: "", mobilePhone: "" },
];

function getTypeBadge(type: string) {
  if (!type) return null;
  const colors: Record<string, string> = {
    "Doctor": "bg-blue-100 text-blue-700",
    "3rd party payer": "bg-purple-100 text-purple-700",
    "Plan manager": "bg-green-100 text-green-700",
    "Parent": "bg-orange-100 text-orange-700",
    "Standard": "bg-gray-100 text-gray-700",
  };
  const cls = colors[type] || "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${cls}`}>
      {type}
    </span>
  );
}

export default function ContactsPage() {
  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Contacts</h1>
        <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          <Plus className="h-4 w-4" />
          New contact
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search for contact name, phone number, email and company name"
            className="h-10 w-full rounded-lg border border-border bg-white pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          Search
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-purple-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <div className="flex items-center gap-1">
                  Type
                  <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                  <Filter className="h-3 w-3 text-text-secondary" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <div className="flex items-center gap-1">
                  Name
                  <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <div className="flex items-center gap-1">
                  Company
                  <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <div className="flex items-center gap-1">
                  Email
                  <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Work phone</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Mobile phone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockContacts.map((contact) => (
              <tr
                key={contact.id}
                className="group relative cursor-pointer transition-colors hover:bg-purple-50/50"
              >
                <td className="px-4 py-3 text-sm text-text-secondary">
                  <Link href={`/contacts/${contact.id}`} className="absolute inset-0" aria-label={`View ${contact.name}`} />
                  {getTypeBadge(contact.type)}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-primary group-hover:underline">
                  {contact.name}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {contact.company}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {contact.email}
                </td>
                <td className="px-4 py-3 text-sm text-primary">
                  {contact.workPhone}
                </td>
                <td className="px-4 py-3 text-sm text-primary">
                  {contact.mobilePhone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
          <span>1-10 of 126 items</span>
          <div className="ml-4 flex items-center gap-1">
            <span className="text-text-secondary">&lt;</span>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">
              1
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary hover:bg-gray-50">
              2
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary hover:bg-gray-50">
              3
            </button>
            <span className="text-text-secondary">...</span>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary hover:bg-gray-50">
              13
            </button>
            <span className="text-text-secondary">&gt;</span>
          </div>
          <span className="ml-4">10 / page</span>
        </div>
      </div>
    </div>
  );
}
