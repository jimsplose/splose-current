"use client";

import { MailOutlined, PhoneOutlined, EnvironmentOutlined, BankOutlined } from "@ant-design/icons";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { List, EmptyState, Text, Divider } from "@/components/ds";

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

function getTypeColor(type: string): { background: string; color: string } {
  switch (type) {
    case "Doctor":
      return { background: '#dbeafe', color: '#1d4ed8' };
    case "3rd party payer":
      return { background: '#f3e8ff', color: 'var(--color-primary)' };
    case "Plan manager":
      return { background: '#dcfce7', color: '#15803d' };
    case "Parent":
      return { background: '#ffedd5', color: '#c2410c' };
    case "Standard":
      return { background: 'var(--color-fill-secondary)', color: 'var(--color-text)' };
    default:
      return { background: 'var(--color-fill-secondary)', color: 'var(--color-text)' };
  }
}

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contact = mockContacts.find((c) => c.id === id);

  if (!contact) {
    return (
      <div style={{ padding: 24 }}>
        <Text variant="body/md" color="secondary">Contact not found.</Text>
      </div>
    );
  }

  return (
    <Flex style={{ height: "calc(100vh - 48px)" }}>
      {/* Sidebar */}
      <aside style={{ width: 180, flexShrink: 0, borderRight: '1px solid var(--color-border)', background: 'white', padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <Text variant="body/md-strong" color="text" as="h2">Contact</Text>
          <Text variant="caption/md" color="secondary">{contact.name}</Text>
        </div>
        <Flex vertical gap={2}>
          {[
            { label: "Details", active: true },
            { label: "Cases", count: 0 },
            { label: "Letters", count: 0 },
            { label: "Invoices", count: contact.associatedClients.length > 0 ? 96 : 0 },
          ].map((item) => (
            <Button
              key={item.label}
              type="text"
              style={{
                width: '100%',
                justifyContent: 'space-between',
                fontSize: 12,
                color: "active" in item && item.active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: "active" in item && item.active ? 500 : undefined,
                ...("active" in item && item.active
                  ? { borderLeft: '2px solid var(--color-primary)', background: 'rgba(var(--color-primary-rgb, 124, 58, 237), 0.05)' }
                  : {}),
              }}
            >
              {item.label}
              {"count" in item && item.count ? <Text variant="caption/sm" color="secondary" as="span">{item.count}</Text> : null}
            </Button>
          ))}
        </Flex>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Top action bar */}
        <Flex align="center" justify="space-between" style={{ borderBottom: '1px solid var(--color-border)', padding: '12px 24px' }}>
          <Flex align="center" gap={8}>
            <Text variant="display/sm" as="h2" color="rgb(66, 105, 74)">Contact</Text>
            <Text variant="body/md" color="secondary" as="span">{contact.name}</Text>
          </Flex>
          <Button size="small">
            Actions
            <svg style={{ height: 14, width: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </Flex>

        <div style={{ padding: 24 }}>
          <Flex align="center" justify="space-between" style={{ marginBottom: 24 }}>
            <Text variant="display/lg">Details</Text>
            <Button size="small">
              Edit
            </Button>
          </Flex>

          {/* General details */}
          <section style={{ marginBottom: 32 }}>
            <Text variant="heading/lg" color="text" as="h2" style={{ marginBottom: 16 }}>General details</Text>
            <List
              items={[
                {
                  label: "Name:",
                  value: <Text variant="label/md" color="text" as="span">{contact.name}</Text>,
                },
                {
                  label: "Type:",
                  value: contact.type ? (
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: 12,
                        fontWeight: 500,
                        borderRadius: 4,
                        padding: '2px 8px',
                        ...getTypeColor(contact.type),
                      }}
                    >
                      {contact.type}
                    </span>
                  ) : (
                    <Text variant="body/sm" color="secondary" as="span">Not set</Text>
                  ),
                },
                {
                  label: "Company:",
                  value: contact.company
                    ? <Text variant="body/sm" color="text" as="span">{contact.company}</Text>
                    : <Text variant="body/sm" color="secondary" as="span">Not provided</Text>,
                },
              ]}
            />
          </section>

          <Divider spacing="none" style={{ marginBottom: 32 }} />

          {/* Contact information */}
          <section style={{ marginBottom: 32 }}>
            <Text variant="heading/lg" color="text" as="h2" style={{ marginBottom: 16 }}>Contact details</Text>
            <List
              items={[
                {
                  label: "Email:",
                  value: contact.email ? (
                    <Flex align="center" gap={6}>
                      <MailOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
                      <Text variant="body/sm" color="primary" as="span">{contact.email}</Text>
                    </Flex>
                  ) : (
                    <Text variant="body/sm" color="secondary" as="span">Not provided</Text>
                  ),
                },
                {
                  label: "Work phone:",
                  value: contact.workPhone ? (
                    <Flex align="center" gap={6}>
                      <PhoneOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
                      <Text variant="body/sm" color="primary" as="span">{contact.workPhone}</Text>
                    </Flex>
                  ) : (
                    <Text variant="body/sm" color="secondary" as="span">Not provided</Text>
                  ),
                },
                {
                  label: "Mobile phone:",
                  value: contact.mobilePhone ? (
                    <Flex align="center" gap={6}>
                      <PhoneOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
                      <Text variant="body/sm" color="primary" as="span">{contact.mobilePhone}</Text>
                    </Flex>
                  ) : (
                    <Text variant="body/sm" color="secondary" as="span">Not provided</Text>
                  ),
                },
                {
                  label: "Address:",
                  value: contact.address ? (
                    <Flex align="center" gap={6}>
                      <EnvironmentOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
                      <Text variant="body/sm" color="text" as="span">{contact.address}</Text>
                    </Flex>
                  ) : (
                    <Text variant="body/sm" color="secondary" as="span">Not provided</Text>
                  ),
                },
                {
                  label: "Note:",
                  value: contact.notes
                    ? <Text variant="body/sm" color="text" as="span">{contact.notes}</Text>
                    : <Text variant="body/sm" color="secondary" as="span">Not provided</Text>,
                },
              ]}
            />
          </section>

          <Divider spacing="none" style={{ marginBottom: 32 }} />

          {/* Associated clients */}
          <section style={{ marginBottom: 32 }}>
            <Text variant="heading/lg" color="text" as="h2" style={{ marginBottom: 16 }}>Associated clients</Text>
            {contact.associatedClients.length > 0 ? (() => {
              const associatedClientsColumns: ColumnsType<{ id: string; name: string }> = [
                { key: "name", title: "Name", dataIndex: "name" },
                { key: "dob", title: "DOB", render: () => <Text color="secondary" as="span">5 Jun 2011</Text> },
                { key: "appts", title: "Appts", align: "center", render: () => <span></span> },
                { key: "invoices", title: "Invoices", align: "center", render: () => <span></span> },
                { key: "notes", title: "Notes", align: "center", render: () => <span></span> },
              ];
              return <Table columns={associatedClientsColumns} dataSource={contact.associatedClients} rowKey="id" pagination={false} />;
            })() : (
              <EmptyState
                icon={<BankOutlined style={{ fontSize: 40, color: '#9ca3af' }} />}
                message="No associated clients"
              />
            )}
          </section>

          <Divider spacing="none" style={{ marginBottom: 32 }} />

          {/* Custom fields */}
          <section style={{ marginBottom: 32 }}>
            <Text variant="heading/lg" color="text" as="h2" style={{ marginBottom: 16 }}>Custom fields</Text>
            <Text variant="body/sm" color="secondary">No custom fields</Text>
          </section>

          <Button type="text" size="small" style={{ color: 'var(--color-primary)' }}>
            View change log
          </Button>
        </div>
      </div>
    </Flex>
  );
}
