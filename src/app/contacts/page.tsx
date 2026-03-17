import { Plus, ArrowUpDown, Filter } from "lucide-react";
import Link from "next/link";

const mockContacts = [
  { id: "1", type: "3rd party payer", name: "NDIS", company: "", email: "ndis.claims@email.com", workPhone: "", mobilePhone: "" },
  { id: "2", type: "Doctor", name: "Dr. Sarah Mitchell", company: "Melbourne Medical Centre", email: "s.mitchell@mmc.com.au", workPhone: "+61 3 9876 5432", mobilePhone: "" },
  { id: "3", type: "Plan manager", name: "Plan Partners", company: "Plan Partners Pty Ltd", email: "claims@planpartners.com.au", workPhone: "+61 3 9000 1234", mobilePhone: "" },
  { id: "4", type: "Standard", name: "Company A", company: "", email: "", workPhone: "", mobilePhone: "" },
  { id: "5", type: "Parent", name: "Margaret Anderson", company: "", email: "m.anderson@email.com", workPhone: "", mobilePhone: "+61 412 345 678" },
  { id: "6", type: "3rd party payer", name: "WorkCover Victoria", company: "", email: "claims@workcover.vic.gov.au", workPhone: "+61 3 9641 1444", mobilePhone: "" },
  { id: "7", type: "Doctor", name: "Dr. James Lee", company: "Carlton Family Practice", email: "j.lee@cfp.com.au", workPhone: "+61 3 9347 8888", mobilePhone: "" },
  { id: "8", type: "Plan manager", name: "My Plan Manager", company: "My Plan Manager", email: "invoices@myplanmanager.com.au", workPhone: "+61 1800 861 272", mobilePhone: "" },
  { id: "9", type: "Standard", name: "Harry Mann", company: "", email: "", workPhone: "", mobilePhone: "" },
  { id: "10", type: "Doctor", name: "Dr. Wei Chen", company: "Richmond Health", email: "wei.chen@richmondhealth.com.au", workPhone: "+61 3 9421 5555", mobilePhone: "+61 423 939 047" },
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
