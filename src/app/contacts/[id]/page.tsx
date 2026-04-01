import { MailOutlined, PhoneOutlined, EnvironmentOutlined, BankOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { Button, DataTable, TableHead, Th, TableBody, Tr, Td, LinkCell, EmptyState, Text } from "@/components/ds";

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
              variant="ghost"
              className={"active" in item && item.active ? "text-primary" : "text-text-secondary"}
              style={{
                fontSize: 12,
                width: '100%',
                justifyContent: 'space-between',
                ...("active" in item && item.active
                  ? { borderLeft: '2px solid var(--color-primary)', background: 'rgba(var(--color-primary-rgb, 124, 58, 237), 0.05)', fontWeight: 500 }
                  : {}),
              }}
            >
              {item.label}
              {"count" in item && item.count ? <span style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>{item.count}</span> : null}
            </Button>
          ))}
        </Flex>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Top action bar */}
        <Flex align="center" justify="space-between" style={{ borderBottom: '1px solid var(--color-border)', padding: '12px 24px' }}>
          <Flex align="center" gap={8}>
            <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Sprig Sans', 'Inter', sans-serif", color: "rgb(66, 105, 74)" }}>Contact</h2>
            <span className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>{contact.name}</span>
          </Flex>
          <Button variant="secondary" size="sm">
            Actions
            <svg style={{ height: 14, width: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </Flex>

        <div style={{ padding: 24 }}>
          <Flex align="center" justify="space-between" style={{ marginBottom: 24 }}>
            <Text variant="display/lg">Details</Text>
            <Button variant="secondary" size="sm">
              Edit
            </Button>
          </Flex>

          {/* General details */}
          <section style={{ marginBottom: 32 }}>
            <Text variant="heading/lg" color="text" as="h2" style={{ marginBottom: 16 }}>General details</Text>
            <Flex align="start" gap={24}>
              <Flex vertical gap={8} style={{ fontSize: 12 }}>
                <Flex gap={64}>
                  <span style={{ width: 112, flexShrink: 0, color: 'var(--color-text-secondary)' }}>Name:</span>
                  <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{contact.name}</span>
                </Flex>
                <Flex gap={64}>
                  <span style={{ width: 112, flexShrink: 0, color: 'var(--color-text-secondary)' }}>Type:</span>
                  <span>
                    {contact.type ? (
                      <span
                        className="text-label-md"
                        style={{
                          display: 'inline-block',
                          borderRadius: 4,
                          padding: '2px 8px',
                          ...getTypeColor(contact.type),
                        }}
                      >
                        {contact.type}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-text-secondary)' }}>Not set</span>
                    )}
                  </span>
                </Flex>
                <Flex gap={64}>
                  <span style={{ width: 112, flexShrink: 0, color: 'var(--color-text-secondary)' }}>Company:</span>
                  <span style={{ color: 'var(--color-text)' }}>
                    {contact.company || <span style={{ color: 'var(--color-text-secondary)' }}>Not provided</span>}
                  </span>
                </Flex>
              </Flex>
            </Flex>
          </section>

          <hr style={{ marginBottom: 32, border: 'none', borderTop: '1px solid var(--color-border)' }} />

          {/* Contact information */}
          <section style={{ marginBottom: 32 }}>
            <Text variant="heading/lg" color="text" as="h2" style={{ marginBottom: 16 }}>Contact details</Text>
            <Flex vertical gap={12} style={{ fontSize: 12 }}>
              <Flex gap={64}>
                <span style={{ width: 112, flexShrink: 0, color: 'var(--color-text-secondary)' }}>Email:</span>
                {contact.email ? (
                  <Flex align="center" gap={6}>
                    <MailOutlined style={{ fontSize: 14, color: 'var(--color-text-secondary)' }} />
                    <span className="text-primary">{contact.email}</span>
                  </Flex>
                ) : (
                  <span style={{ color: 'var(--color-text-secondary)' }}>Not provided</span>
                )}
              </Flex>
              <Flex gap={64}>
                <span style={{ width: 112, flexShrink: 0, color: 'var(--color-text-secondary)' }}>Work phone:</span>
                {contact.workPhone ? (
                  <Flex align="center" gap={6}>
                    <PhoneOutlined style={{ fontSize: 14, color: 'var(--color-text-secondary)' }} />
                    <span className="text-primary">{contact.workPhone}</span>
                  </Flex>
                ) : (
                  <span style={{ color: 'var(--color-text-secondary)' }}>Not provided</span>
                )}
              </Flex>
              <Flex gap={64}>
                <span style={{ width: 112, flexShrink: 0, color: 'var(--color-text-secondary)' }}>Mobile phone:</span>
                {contact.mobilePhone ? (
                  <Flex align="center" gap={6}>
                    <PhoneOutlined style={{ fontSize: 14, color: 'var(--color-text-secondary)' }} />
                    <span className="text-primary">{contact.mobilePhone}</span>
                  </Flex>
                ) : (
                  <span style={{ color: 'var(--color-text-secondary)' }}>Not provided</span>
                )}
              </Flex>
              <Flex gap={64}>
                <span style={{ width: 112, flexShrink: 0, color: 'var(--color-text-secondary)' }}>Address:</span>
                {contact.address ? (
                  <Flex align="center" gap={6}>
                    <EnvironmentOutlined style={{ fontSize: 14, color: 'var(--color-text-secondary)' }} />
                    <span style={{ color: 'var(--color-text)' }}>{contact.address}</span>
                  </Flex>
                ) : (
                  <span style={{ color: 'var(--color-text-secondary)' }}>Not provided</span>
                )}
              </Flex>
              <Flex gap={64}>
                <span style={{ width: 112, flexShrink: 0, color: 'var(--color-text-secondary)' }}>Note:</span>
                <span style={{ color: 'var(--color-text)' }}>
                  {contact.notes || <span style={{ color: 'var(--color-text-secondary)' }}>Not provided</span>}
                </span>
              </Flex>
            </Flex>
          </section>

          <hr style={{ marginBottom: 32, border: 'none', borderTop: '1px solid var(--color-border)' }} />

          {/* Associated clients */}
          <section style={{ marginBottom: 32 }}>
            <Text variant="heading/lg" color="text" as="h2" style={{ marginBottom: 16 }}>Associated clients</Text>
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
                icon={<BankOutlined style={{ fontSize: 40, color: '#9ca3af' }} />}
                message="No associated clients"
              />
            )}
          </section>

          <hr style={{ marginBottom: 32, border: 'none', borderTop: '1px solid var(--color-border)' }} />

          {/* Custom fields */}
          <section style={{ marginBottom: 32 }}>
            <Text variant="heading/lg" color="text" as="h2" style={{ marginBottom: 16 }}>Custom fields</Text>
            <Text variant="body/sm" color="secondary">No custom fields</Text>
          </section>

          <Button variant="ghost" size="sm" className="text-primary">
            View change log
          </Button>
        </div>
      </div>
    </Flex>
  );
}
