"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useRegisterCommands } from "@/hooks/useRegisterCommands";
import { EditOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Select, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { pickTextColor } from "@/lib/color";
import { AlertCallout, PatientAvatar, Divider, FeatureCard, FileUpload, Grid, HintIcon, List, Collapse, Text, Toggle } from "@/components/ds";

interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  address: string | null;
  medicare: string | null;
  ndisNumber: string | null;
  notes: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function formatDOB(dobStr: string): string {
  try {
    const d = new Date(dobStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dobStr;
  }
}

function calcAge(dobStr: string): string {
  try {
    const dob = new Date(dobStr + "T00:00:00");
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) years--;
    return `${years} years old`;
  } catch {
    return "";
  }
}

export default function ClientDetailClient({ client }: { client: ClientData }) {
  const [editMode, setEditMode] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const fullName = `${client.firstName} ${client.lastName}`;
  useRegisterCommands([
    { id: `client-${client.id}-note`, label: `New note for ${fullName}`, group: "Actions", onSelect: () => router.push(`/clients/${client.id}/notes`) },
    { id: `client-${client.id}-invoice`, label: `New invoice for ${fullName}`, group: "Actions", onSelect: () => router.push(`/invoices/new?clientId=${client.id}`) },
    { id: `client-${client.id}-appointment`, label: `New appointment for ${fullName}`, group: "Actions", onSelect: () => router.push(`/calendar?client=${client.id}`) },
  ]);
  const forcedState = searchParams.get("state");

  useEffect(() => {
    if (forcedState === "edit-mode") {
      setEditMode(true);
    }
  }, [forcedState]);

  if (editMode) {
    return <EditDetailsForm client={client} onCancel={() => setEditMode(false)} />;
  }

  return (
    <Flex style={{ flex: 1, overflow: 'hidden' }}>
      {/* Main content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
          <Text variant="display/lg">Details</Text>
          <Button size="small" onClick={() => setEditMode(true)}>
            Edit <EditOutlined style={{ fontSize: 14, color: 'var(--ant-color-text, #414549)' }} />
          </Button>
        </Flex>

        {/* General details */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>General details</Text>
          <Flex align="center" gap={16} style={{ marginBottom: 12 }}>
            <PatientAvatar patient={{ id: client.id, firstName: client.firstName, lastName: client.lastName }} />
            <Text variant="body/md" as="span">
              {client.firstName} {client.lastName}
            </Text>
          </Flex>
          <List
            items={[
              ...(client.dateOfBirth
                ? [
                    {
                      label: "Date of birth:",
                      value: `${formatDOB(client.dateOfBirth)} (${calcAge(client.dateOfBirth)})`,
                    },
                  ]
                : []),
              { label: "Sex:", value: "Not specified" },
            ]}
          />
        </section>

        <Divider variant="primary" spacing="none" style={{ marginBottom: 32 }} />

        {/* Client contact details */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>
            Client contact details
          </Text>
          <List
            items={[
              {
                label: "Email:",
                value: (
                  <Text variant="body/md" as="span" color="primary">
                    {client.email || "\u2014"}
                  </Text>
                ),
              },
              {
                label: "Phone numbers:",
                value: (
                  <Text variant="body/md" as="span" color="primary">
                    {client.phone || "\u2014"}
                  </Text>
                ),
              },
              { label: "Preference:", value: "None" },
              ...(client.address
                ? [{ label: "Address:", value: client.address }]
                : []),
              {
                label: "Timezone:",
                value: "GMT+10:30 - Australia/Adelaide",
              },
            ]}
          />
        </section>

        <Divider variant="primary" spacing="none" style={{ marginBottom: 32 }} />

        {/* Privacy policy consent */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>
            Privacy policy consent
          </Text>
          <List items={[{ label: "", value: "No response" }]} />
        </section>

        <Divider variant="primary" spacing="none" style={{ marginBottom: 32 }} />

        {/* Medications, allergies & intolerances */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>
            Medications, allergies &amp; intolerances
          </Text>
          <List
            items={[
              { label: "Medications:", value: "None" },
              { label: "Allergies:", value: "None" },
              { label: "Intolerances:", value: "None" },
            ]}
          />
        </section>

        <Divider variant="primary" spacing="none" style={{ marginBottom: 32 }} />

        {/* Medicare details */}
        {client.medicare && (
          <>
            <section style={{ marginBottom: 32 }}>
              <Text variant="heading/lg" style={{ marginBottom: 16 }}>
                Medicare details
              </Text>
              <List
                items={[
                  { label: "Card number:", value: client.medicare },
                ]}
              />
            </section>
            <Divider variant="primary" spacing="none" style={{ marginBottom: 32 }} />
          </>
        )}

        {client.ndisNumber && (
          <>
            <section style={{ marginBottom: 32 }}>
              <Text variant="heading/lg" style={{ marginBottom: 16 }}>
                NDIS details
              </Text>
              <List
                items={[
                  { label: "NDIS number:", value: client.ndisNumber },
                ]}
              />
            </section>
            <Divider variant="primary" spacing="none" style={{ marginBottom: 32 }} />
          </>
        )}

        {/* Custom fields */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>Custom fields</Text>
          <List
            items={[
              { label: "Date since surgery:", value: "25/09/2025" },
              { label: "Note:", value: "Note short text check" },
            ]}
          />
        </section>

        <Divider variant="primary" spacing="none" style={{ marginBottom: 32 }} />

        {/* Invoicing */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>Invoicing</Text>
          <List
            items={[
              {
                label: "Invoice reminder preference:",
                value: "On",
              },
            ]}
          />
        </section>

        <Divider variant="primary" spacing="none" style={{ marginBottom: 32 }} />

        {/* Associated contacts */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>
            Associated contacts{" "}
            <HintIcon />
          </Text>
          <AssociatedContactsTable />
        </section>

        <Button type="link" size="small">View change log</Button>
      </div>

      {/* Right panel */}
      <aside style={{ width: 280, flexShrink: 0, overflowY: 'auto', borderLeft: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-container)', padding: 16 }}>
        {/* Account balance */}
        <FeatureCard tone="primary" style={{ marginBottom: 16 }}>
          <Flex justify="space-between" align="center">
            <Text variant="label/lg" as="h3" color="inverted">Account balance</Text>
            <HintIcon tone="inverted" size="lg" />
          </Flex>
          <Flex justify="space-between" align="center" style={{ marginTop: 8 }}>
            <Text variant="body/md" as="span">
              <Flex align="center" gap={4}>
                They owe
                <HintIcon tone="inverted" />
              </Flex>
            </Text>
            <Text variant="body/md-strong" as="span">3,310.56</Text>
          </Flex>
          <Flex justify="space-between" align="center">
            <Text variant="body/md" as="span">Available credit balance</Text>
            <Text variant="body/md-strong" as="span">0.00</Text>
          </Flex>
        </FeatureCard>

        {/* Client alerts */}
        <Collapse title="Client alerts" defaultOpen>
          <AlertCallout variant="warning">
            <Text variant="body/md" as="span">Include KM</Text>
          </AlertCallout>
        </Collapse>

        {/* Client tags */}
        <Collapse title="Client tags" defaultOpen>
          <Flex wrap="wrap" gap={4}>
            <Tag style={{ backgroundColor: 'rgb(106, 176, 76)', color: pickTextColor('rgb(106, 176, 76)'), border: 'none' }}>Plan-managed</Tag>
          </Flex>
        </Collapse>

        {/* Stripe */}
        <Collapse title="Stripe" defaultOpen>
          <Text variant="body/sm" as="p" color="secondary">
            Connect with Stripe and save a credit card for clients and use for
            future use.
          </Text>
        </Collapse>

        {/* Mailchimp */}
        <Collapse title="Mailchimp" defaultOpen>
          <Flex vertical gap={4}>
            <Flex align="center" gap={4}>
              <Text variant="body/sm" as="span" color="primary">rakesh.splose@gmail.com</Text>
              <Tag>ARCHIVED</Tag>
            </Flex>
            <Text variant="body/sm" as="p" color="secondary">a a</Text>
            <Text variant="body/sm" as="p" color="secondary">Open rate: 0%</Text>
            <Text variant="body/sm" as="p" color="secondary">Click rate: 0%</Text>
            <Text variant="body/sm" as="p" color="secondary">
              Opt-in: 11:41 am, 16 Nov 2022
            </Text>
            <Button
              size="small"
              style={{ fontSize: 12, marginTop: 8, width: '100%' }}
            >
              Unlink
            </Button>
          </Flex>
        </Collapse>

        {/* QuickBooks */}
        <Collapse title="QuickBooks">
          <Text variant="body/sm" as="p" color="secondary">
            No QuickBooks connection.
          </Text>
        </Collapse>
      </aside>
    </Flex>
  );
}

/* ─── Associated Contacts Table ────────────────────────────────── */

interface AssociatedContact {
  key: string;
  name: string;
  type: string;
  notes: string;
}

const associatedContactsData: AssociatedContact[] = [
  { key: "1", name: "Test doctor", type: "Doctor", notes: "hello" },
  { key: "2", name: "Jo malone", type: "Standard", notes: "N/A" },
];

const associatedContactsColumns: ColumnsType<AssociatedContact> = [
  {
    key: "name",
    title: "Name",
    dataIndex: "name",
    render: (name: string) => <Text variant="body/md" as="span" color="primary">{name}</Text>,
  },
  { key: "type", title: "Type", dataIndex: "type" },
  { key: "notes", title: "Notes", dataIndex: "notes" },
  { key: "appts", title: "Appts", align: "center" as const, render: () => null },
  { key: "invoices", title: "Invoices", align: "center" as const, render: () => null },
  { key: "notesCol", title: "Notes", align: "center" as const, render: () => null },
];

function AssociatedContactsTable() {
  return (
    <Table
      columns={associatedContactsColumns}
      dataSource={associatedContactsData}
      rowKey="key"
      pagination={false}
      style={{ width: '100%', fontSize: 14 }}
    />
  );
}

/* ─── Edit Details Form ────────────────────────────────────────── */

function EditDetailsForm({ client, onCancel }: { client: ClientData; onCancel: () => void }) {
  const dobParts = client.dateOfBirth ? client.dateOfBirth.split("-") : ["2025", "01", "01"];
  const [invoiceReminder, setInvoiceReminder] = useState(true);
  const [form] = Form.useForm();

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <Text variant="display/md">Edit details</Text>
        <Flex align="center" gap={8}>
          <Button onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" onClick={onCancel}>
            Save
          </Button>
        </Flex>
      </Flex>

      <div style={{ maxWidth: 672 }}>
        {/* General details with profile photo side-by-side */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>General details</Text>
          <Flex gap={32}>
            {/* Form fields */}
            <Form form={form} layout="vertical" style={{ flex: 1 }}>
              <Flex vertical gap={16}>
                <Form.Item label="Title">
                  <Select
                    options={[
                      { value: "", label: "Title" },
                      { value: "Mr", label: "Mr" },
                      { value: "Mrs", label: "Mrs" },
                      { value: "Ms", label: "Ms" },
                      { value: "Dr", label: "Dr" },
                    ]}
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Grid cols={3} gap={12}>
                  <Form.Item label="First name*" required>
                    <Input type="text" defaultValue={client.firstName} />
                  </Form.Item>
                  <Form.Item label="Middle name">
                    <Input type="text" placeholder="Middle name" />
                  </Form.Item>
                  <Form.Item label="Last name*" required>
                    <Input type="text" defaultValue={client.lastName} />
                  </Form.Item>
                </Grid>

                <Form.Item label="Preferred name">
                  <Input type="text" />
                </Form.Item>

                <Grid cols={3} gap={12}>
                  <Form.Item label="Day">
                    <Select
                      defaultValue={dobParts[2]}
                      options={Array.from({ length: 31 }, (_, i) => ({
                        value: String(i + 1),
                        label: String(i + 1),
                      }))}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item label="Month">
                    <Select
                      defaultValue={dobParts[1]}
                      options={[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((m, i) => ({
                        value: String(i + 1).padStart(2, "0"),
                        label: m,
                      }))}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item label="Year">
                    <Select
                      defaultValue={dobParts[0]}
                      options={Array.from({ length: 100 }, (_, i) => {
                        const y = 2026 - i;
                        return { value: String(y), label: String(y) };
                      })}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Grid>

                <Form.Item label="Sex">
                  <Select
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                      { value: "Not specified", label: "Not specified" },
                    ]}
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item label="Gender identity">
                  <Select
                    options={[
                      { value: "", label: "" },
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Non-binary", label: "Non-binary" },
                      { value: "Other", label: "Other" },
                    ]}
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item label="Pronouns">
                  <Input type="text" placeholder="they / them" />
                </Form.Item>

                <Form.Item label="Occupation">
                  <Input type="text" />
                </Form.Item>
              </Flex>
            </Form>

            {/* Profile photo - positioned to the right */}
            <div style={{ flexShrink: 0, paddingTop: 24, textAlign: 'center' }}>
              <FileUpload
                icon={<Text variant="body/md" as="span" color="secondary">Profile photo</Text>}
                label="Upload"
                style={{ height: 128, width: 128, padding: 0 }}
              />
            </div>
          </Flex>
        </section>

        {/* Other details */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>Other details</Text>
          <Form layout="vertical">
            <Form.Item>
              <Input.TextArea
                defaultValue='For fields that are not available with the splose template, will show up here if they are all included in "Other Details" on the CSV file.'
                rows={4}
              />
            </Form.Item>
          </Form>
        </section>

        {/* Alerts */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>Alerts</Text>
          <Text variant="body/md" as="p" color="secondary" style={{ marginBottom: 8 }}>
            Information you add here will be displayed in important places like scheduling appointments.
          </Text>
          <Form layout="vertical">
            <Form.Item>
              <Input.TextArea defaultValue="Include KM" rows={3} />
            </Form.Item>
          </Form>
        </section>

        {/* Contact details */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>Contact details</Text>
          <Form layout="vertical">
            <Flex vertical gap={16}>
              <Form.Item label="Email">
                <Input type="email" defaultValue={client.email || ""} />
              </Form.Item>
              <Form.Item label="Phone">
                <Input type="tel" defaultValue={client.phone || ""} />
              </Form.Item>
              <Form.Item label="Address">
                <Input type="text" defaultValue={client.address || ""} />
              </Form.Item>
            </Flex>
          </Form>
        </section>

        {/* Medicare */}
        {client.medicare && (
          <section>
            <Text variant="heading/lg" style={{ marginBottom: 16 }}>Medicare details</Text>
            <Form layout="vertical">
              <Form.Item label="Card number">
                <Input type="text" defaultValue={client.medicare} />
              </Form.Item>
            </Form>
          </section>
        )}

        {/* NDIS */}
        {client.ndisNumber && (
          <section style={{ marginBottom: 32 }}>
            <Text variant="heading/lg" style={{ marginBottom: 16 }}>NDIS details</Text>
            <Form layout="vertical">
              <Form.Item label="NDIS number">
                <Input type="text" defaultValue={client.ndisNumber} />
              </Form.Item>
            </Form>
          </section>
        )}

        {/* Privacy policy consent */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>Privacy policy consent</Text>
          <Form layout="vertical">
            <Form.Item label="Consent status">
              <Select
                defaultValue="no-response"
                options={[
                  { value: "no-response", label: "No response" },
                  { value: "accepted", label: "Accepted" },
                  { value: "declined", label: "Declined" },
                ]}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Form>
        </section>

        {/* Medications, allergies & intolerances */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>Medications, allergies &amp; intolerances</Text>
          <Form layout="vertical">
            <Flex vertical gap={16}>
              <Form.Item label="Medications">
                <Input.TextArea defaultValue="" placeholder="None" rows={2} />
              </Form.Item>
              <Form.Item label="Allergies">
                <Input.TextArea defaultValue="" placeholder="None" rows={2} />
              </Form.Item>
              <Form.Item label="Intolerances">
                <Input.TextArea defaultValue="" placeholder="None" rows={2} />
              </Form.Item>
            </Flex>
          </Form>
        </section>

        {/* Custom fields */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>Custom fields</Text>
          <Form layout="vertical">
            <Flex vertical gap={16}>
              <Form.Item label="Date since surgery">
                <Input type="text" defaultValue="25/09/2025" />
              </Form.Item>
              <Form.Item label="Note">
                <Input type="text" defaultValue="Note short text check" />
              </Form.Item>
            </Flex>
          </Form>
        </section>

        {/* Invoicing */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>Invoicing</Text>
          <Flex justify="space-between" align="center">
            <Text variant="body/md" as="span">Invoice reminder preference</Text>
            <Toggle checked={invoiceReminder} onChange={setInvoiceReminder} />
          </Flex>
        </section>
      </div>
    </div>
  );
}
