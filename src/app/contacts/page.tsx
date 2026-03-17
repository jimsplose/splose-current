import { Plus, ArrowUpDown, Filter } from "lucide-react";
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
        <input
          type="text"
          placeholder="Search for contact name, phone number, email and company name"
          className="h-10 flex-1 rounded-lg border border-border bg-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
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
                className="cursor-pointer transition-colors hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-sm text-text-secondary">{contact.type}</td>
                <td className="px-4 py-3 text-sm text-text">{contact.name}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{contact.company}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{contact.email}</td>
                <td className="px-4 py-3 text-sm text-primary">{contact.workPhone}</td>
                <td className="px-4 py-3 text-sm text-primary">{contact.mobilePhone}</td>
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
