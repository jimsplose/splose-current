"use client";

import { useState, useEffect } from "react";
import { PlusOutlined, SwapOutlined, FilterOutlined } from "@ant-design/icons";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { ListPage, Pagination, Skeleton } from "@/components/ds";

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
  return <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{type}</span>;
}

type ContactRow = typeof mockContacts[number];

export default function ContactsPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  const contactColumns: ColumnsType<ContactRow> = [
    {
      key: "type",
      title: (
        <Flex align="center" gap={4}>
          Type
          <SwapOutlined style={{ fontSize: 12, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
          <FilterOutlined style={{ fontSize: 12, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
        </Flex>
      ),
      render: (_, contact) => (
        <div style={{ position: "relative" }}>
          <Link
            href={`/contacts/${contact.id}`}
            style={{ position: "absolute", inset: 0 }}
            aria-label={`View ${contact.name}`}
          />
          {getTypeLabel(contact.type)}
        </div>
      ),
    },
    {
      key: "name",
      title: (
        <Flex align="center" gap={4}>
          Name
          <SwapOutlined style={{ fontSize: 12, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
        </Flex>
      ),
      render: (_, contact) => <span style={{ fontWeight: 500 }}>{contact.name}</span>,
    },
    {
      key: "company",
      title: (
        <Flex align="center" gap={4}>
          Company
          <SwapOutlined style={{ fontSize: 12, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
        </Flex>
      ),
      render: (_, contact) => <span style={{ color: "var(--color-text-secondary)" }}>{contact.company}</span>,
    },
    {
      key: "email",
      title: (
        <Flex align="center" gap={4}>
          Email
          <SwapOutlined style={{ fontSize: 12, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
        </Flex>
      ),
      render: (_, contact) => <span style={{ color: "var(--color-text-secondary)" }}>{contact.email}</span>,
    },
    {
      key: "workPhone",
      title: "Work phone",
      render: (_, contact) =>
        contact.workPhone ? (
          <a href={`tel:${contact.workPhone}`} style={{ textDecoration: "none" }}>
            {contact.workPhone}
          </a>
        ) : null,
    },
    {
      key: "mobilePhone",
      title: "Mobile phone",
      render: (_, contact) =>
        contact.mobilePhone ? (
          <a href={`tel:${contact.mobilePhone}`} style={{ textDecoration: "none" }}>
            {contact.mobilePhone}
          </a>
        ) : null,
    },
  ];

  return (
    <ListPage
      title="Contacts"
      searchPlaceholder="Search for contact name, phone number, email and company name"
      actions={
        <Link href="/contacts/new">
          <Button>
            <PlusOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
            New contact
          </Button>
        </Link>
      }
    >
      <Skeleton.Loading
        loaded={loaded}
        fallback={
          <div style={{ padding: "0 0 8px" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
                <Skeleton.Block width="12%" height={18} />
                <Skeleton.Block width="22%" height={18} />
                <Skeleton.Block width="25%" height={18} />
                <Skeleton.Block width="20%" height={18} />
                <Skeleton.Block width="15%" height={18} />
              </div>
            ))}
          </div>
        }
      >
        <Table
          columns={contactColumns}
          dataSource={mockContacts}
          rowKey="id"
          pagination={false}
          onRow={() => ({ style: { cursor: "pointer" } })}
        />
      </Skeleton.Loading>
      <Pagination
        currentPage={1}
        totalPages={1}
        totalItems={mockContacts.length}
        itemsPerPage={20}
        onPageChange={() => {}}
      />
    </ListPage>
  );
}
