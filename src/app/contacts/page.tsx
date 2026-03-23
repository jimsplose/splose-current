import { Plus, ArrowUpDown, Filter } from "lucide-react";
import Link from "next/link";
import { Button, Card, PageHeader, SearchBar, TableHead, Th, TableBody, Td, Pagination } from "@/components/ds";

const mockContacts = [
  { id: "1", type: "", name: "jh", company: "", email: "", workPhone: "", mobilePhone: "" },
  {
    id: "2",
    type: "3rd party payer",
    name: "NDIS",
    company: "",
    email: "ruvishka.info@gmail.com",
    workPhone: "",
    mobilePhone: "",
  },
  {
    id: "3",
    type: "Doctor",
    name: "Cheng Contact",
    company: "woodlake medical centre",
    email: "cheng@splose.com",
    workPhone: "",
    mobilePhone: "",
  },
  {
    id: "4",
    type: "Plan manager",
    name: "scott",
    company: "",
    email: "sctt@splose.com",
    workPhone: "",
    mobilePhone: "",
  },
  { id: "5", type: "Standard", name: "Company A", company: "", email: "", workPhone: "", mobilePhone: "" },
  { id: "6", type: "Parent", name: "Test", company: "", email: "", workPhone: "", mobilePhone: "" },
  { id: "7", type: "3rd party payer", name: "NDIS", company: "", email: "", workPhone: "", mobilePhone: "" },
  {
    id: "8",
    type: "Doctor",
    name: "Wei",
    company: "This is wei's company",
    email: "wei.luo@splose.com",
    workPhone: "",
    mobilePhone: "+61 423939047",
  },
  { id: "9", type: "Plan manager", name: "Your Plan Manager", company: "", email: "", workPhone: "", mobilePhone: "" },
  { id: "10", type: "Standard", name: "Harry Mann", company: "", email: "", workPhone: "", mobilePhone: "" },
];

function getTypeLabel(type: string) {
  if (!type) return null;
  return <span className="text-sm text-text-secondary">{type}</span>;
}

export default function ContactsPage() {
  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="Contacts">
        <Button>
          <Plus className="h-4 w-4" />
          New contact
        </Button>
      </PageHeader>

      <SearchBar placeholder="Search for contact name, phone number, email and company name" />

      <Card padding="none" className="overflow-x-auto">
        <table className="w-full">
          <TableHead>
            <Th>
              <div className="flex items-center gap-1">
                Type
                <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                <Filter className="h-3 w-3 text-text-secondary" />
              </div>
            </Th>
            <Th>
              <div className="flex items-center gap-1">
                Name
                <ArrowUpDown className="h-3 w-3 text-text-secondary" />
              </div>
            </Th>
            <Th hidden="md">
              <div className="flex items-center gap-1">
                Company
                <ArrowUpDown className="h-3 w-3 text-text-secondary" />
              </div>
            </Th>
            <Th hidden="md">
              <div className="flex items-center gap-1">
                Email
                <ArrowUpDown className="h-3 w-3 text-text-secondary" />
              </div>
            </Th>
            <Th hidden="lg">Work phone</Th>
            <Th hidden="lg">Mobile phone</Th>
          </TableHead>
          <TableBody>
            {mockContacts.map((contact) => (
              <tr key={contact.id} className="group relative cursor-pointer transition-colors hover:bg-purple-50/50">
                <Td className="text-text-secondary">
                  <Link
                    href={`/contacts/${contact.id}`}
                    className="absolute inset-0"
                    aria-label={`View ${contact.name}`}
                  />
                  {getTypeLabel(contact.type)}
                </Td>
                <Td className="font-medium text-primary group-hover:underline">{contact.name}</Td>
                <Td hidden="md" className="text-text-secondary">
                  {contact.company}
                </Td>
                <Td hidden="md" className="text-text-secondary">
                  {contact.email}
                </Td>
                <Td hidden="lg" className="text-primary">
                  {contact.workPhone}
                </Td>
                <Td hidden="lg" className="text-primary">
                  {contact.mobilePhone}
                </Td>
              </tr>
            ))}
          </TableBody>
        </table>
        <Pagination currentPage={1} totalPages={13} totalItems={126} itemsPerPage={10} />
      </Card>
    </div>
  );
}
