"use client";

import { Plus, ArrowUpDown, Filter } from "lucide-react";
import Link from "next/link";
import { Button, Card, DataTable, PageHeader, SearchBar, TableHead, Th, TableBody, Tr, Td, Pagination, usePagination } from "@/components/ds";

const mockContacts = [
  {
    id: "1",
    type: "Doctor",
    name: "Dr Sarah Mitchell",
    company: "Royal Adelaide Hospital",
    email: "s.mitchell@rah.sa.gov.au",
    workPhone: "(08) 7074 0000",
    mobilePhone: "",
  },
  {
    id: "2",
    type: "3rd party payer",
    name: "NDIS — NDIA",
    company: "National Disability Insurance Agency",
    email: "enquiries@ndis.gov.au",
    workPhone: "1800 800 110",
    mobilePhone: "",
  },
  {
    id: "3",
    type: "Doctor",
    name: "Dr James Nguyen",
    company: "Woodlake Medical Centre",
    email: "j.nguyen@woodlakemedical.com.au",
    workPhone: "(08) 8234 5678",
    mobilePhone: "+61 412 345 678",
  },
  {
    id: "4",
    type: "Plan manager",
    name: "Laura Bennett",
    company: "My Plan Manager",
    email: "laura.b@myplanmanager.com.au",
    workPhone: "(08) 7200 3400",
    mobilePhone: "+61 423 456 789",
  },
  {
    id: "5",
    type: "Specialist",
    name: "Dr Karen O'Brien",
    company: "Flinders Medical Centre",
    email: "k.obrien@fmc.sa.gov.au",
    workPhone: "(08) 8204 5511",
    mobilePhone: "",
  },
  {
    id: "6",
    type: "Teacher",
    name: "Angela Russo",
    company: "Unley Primary School",
    email: "angela.russo@unleyps.sa.edu.au",
    workPhone: "(08) 8271 2811",
    mobilePhone: "+61 434 567 890",
  },
  {
    id: "7",
    type: "Case manager",
    name: "David Kim",
    company: "SA Health — Disability Services",
    email: "david.kim@sa.gov.au",
    workPhone: "(08) 8226 6000",
    mobilePhone: "+61 445 678 901",
  },
  {
    id: "8",
    type: "Doctor",
    name: "Dr Wei Luo",
    company: "Prospect Family Practice",
    email: "wei.luo@prospectfp.com.au",
    workPhone: "(08) 8344 1122",
    mobilePhone: "+61 423 939 047",
  },
  {
    id: "9",
    type: "Plan manager",
    name: "Scott Henderson",
    company: "Plan Management Partners",
    email: "scott@pmp.com.au",
    workPhone: "",
    mobilePhone: "+61 456 789 012",
  },
  {
    id: "10",
    type: "Standard",
    name: "Harry Mann",
    company: "",
    email: "harry.mann@email.com",
    workPhone: "",
    mobilePhone: "+61 401 234 567",
  },
  {
    id: "11",
    type: "Specialist",
    name: "Dr Priya Desai",
    company: "Women's and Children's Hospital",
    email: "p.desai@wch.sa.gov.au",
    workPhone: "(08) 8161 7000",
    mobilePhone: "",
  },
  {
    id: "12",
    type: "Teacher",
    name: "Mark Thompson",
    company: "Aberfoyle Park High School",
    email: "mark.t@aberfoyleparkhigh.sa.edu.au",
    workPhone: "(08) 8270 4455",
    mobilePhone: "",
  },
  {
    id: "13",
    type: "Case manager",
    name: "Tanya Morales",
    company: "WorkCover SA",
    email: "tanya.morales@workcover.sa.gov.au",
    workPhone: "13 18 55",
    mobilePhone: "+61 467 890 123",
  },
  {
    id: "14",
    type: "3rd party payer",
    name: "DVA — Department of Veterans' Affairs",
    company: "Department of Veterans' Affairs",
    email: "generalenquiries@dva.gov.au",
    workPhone: "1800 555 254",
    mobilePhone: "",
  },
  {
    id: "15",
    type: "Parent",
    name: "Michelle Brooks",
    company: "",
    email: "michelle.brooks@email.com",
    workPhone: "",
    mobilePhone: "+61 478 901 234",
  },
  {
    id: "16",
    type: "Doctor",
    name: "Dr Emily Tran",
    company: "Burnside Village Medical",
    email: "e.tran@burnsidemedical.com.au",
    workPhone: "(08) 8364 2277",
    mobilePhone: "",
  },
  {
    id: "17",
    type: "Standard",
    name: "Sunrise Therapy Supplies",
    company: "Sunrise Therapy Supplies",
    email: "orders@sunrisetherapy.com.au",
    workPhone: "(08) 8333 9900",
    mobilePhone: "",
  },
  {
    id: "18",
    type: "Case manager",
    name: "Rachel Cooper",
    company: "Medicare — Services Australia",
    email: "",
    workPhone: "132 011",
    mobilePhone: "",
  },
];

function getTypeLabel(type: string) {
  if (!type) return null;
  return <span className="text-sm text-text-secondary">{type}</span>;
}

export default function ContactsPage() {
  const { paged, paginationProps } = usePagination(mockContacts, { pageKey: "/contacts" });

  return (
    <div className="px-[22.5px] py-[10px]">
      <PageHeader title="Contacts">
        <Link href="/contacts/new">
          <Button>
            <Plus className="h-4 w-4" />
            New contact
          </Button>
        </Link>
      </PageHeader>

      <SearchBar placeholder="Search for contact name, phone number, email and company name" />

      <Card padding="none" className="overflow-x-auto">
        <DataTable>
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
            {paged.map((contact) => (
              <Tr key={contact.id} clickable className="group relative">
                <Td className="text-text-secondary">
                  <Link
                    href={`/contacts/${contact.id}`}
                    className="absolute inset-0"
                    aria-label={`View ${contact.name}`}
                  />
                  {getTypeLabel(contact.type)}
                </Td>
                <Td className="font-medium text-text">{contact.name}</Td>
                <Td hidden="md" className="text-text-secondary">
                  {contact.company}
                </Td>
                <Td hidden="md" className="text-text-secondary">
                  {contact.email}
                </Td>
                <Td hidden="lg">
                  {contact.workPhone && (
                    <a href={`tel:${contact.workPhone}`} className="text-text no-underline hover:text-text">
                      {contact.workPhone}
                    </a>
                  )}
                </Td>
                <Td hidden="lg">
                  {contact.mobilePhone && (
                    <a href={`tel:${contact.mobilePhone}`} className="text-text no-underline hover:text-text">
                      {contact.mobilePhone}
                    </a>
                  )}
                </Td>
              </Tr>
            ))}
          </TableBody>
        </DataTable>
        <Pagination {...paginationProps} />
      </Card>
    </div>
  );
}
