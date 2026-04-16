"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { EditOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import {
  Avatar,
  Button,
  Badge,
  Divider,
  FileUpload,
  FormInput,
  FormSelect,
  FormTextarea,
  Grid,
  HintIcon,
  List,
  Collapse,
  Text,
  Toggle,
} from "@/components/ds";

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
          <Button variant="secondary" size="sm" onClick={() => setEditMode(true)}>
            Edit <EditOutlined className="text-[14px]" />
          </Button>
        </Flex>

        {/* General details */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>General details</Text>
          <Flex align="center" gap={16} style={{ marginBottom: 12 }}>
            <Avatar name={`${client.firstName} ${client.lastName}`} />
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
            <HintIcon style={{ marginLeft: 4 }} />
          </Text>
          <table className="w-full text-body-md">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ paddingBottom: 8 }} className="text-left text-label-lg">Name</th>
                <th style={{ paddingBottom: 8 }} className="text-left text-label-lg">Type</th>
                <th style={{ paddingBottom: 8 }} className="text-left text-label-lg">Notes</th>
                <th style={{ paddingBottom: 8 }} className="text-center text-label-lg">Appts</th>
                <th style={{ paddingBottom: 8 }} className="text-center text-label-lg">Invoices</th>
                <th style={{ paddingBottom: 8 }} className="text-center text-label-lg">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ paddingTop: 8, paddingBottom: 8 }}><Text variant="body/md" as="span" color="primary">Test doctor</Text></td>
                <td style={{ paddingTop: 8, paddingBottom: 8 }}>Doctor</td>
                <td style={{ paddingTop: 8, paddingBottom: 8 }}>hello</td>
                <td style={{ paddingTop: 8, paddingBottom: 8 }} className="text-center"></td>
                <td style={{ paddingTop: 8, paddingBottom: 8 }} className="text-center"></td>
                <td style={{ paddingTop: 8, paddingBottom: 8 }} className="text-center"></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ paddingTop: 8, paddingBottom: 8 }}><Text variant="body/md" as="span" color="primary">Jo malone</Text></td>
                <td style={{ paddingTop: 8, paddingBottom: 8 }}>Standard</td>
                <td style={{ paddingTop: 8, paddingBottom: 8 }}>N/A</td>
                <td style={{ paddingTop: 8, paddingBottom: 8 }} className="text-center"></td>
                <td style={{ paddingTop: 8, paddingBottom: 8 }} className="text-center"></td>
                <td style={{ paddingTop: 8, paddingBottom: 8 }} className="text-center"></td>
              </tr>
            </tbody>
          </table>
        </section>

        <Button variant="ghost" size="sm" style={{ color: 'var(--color-primary)' }} onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; e.currentTarget.style.background = 'transparent'; }} onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}>View change log</Button>
      </div>

      {/* Right panel */}
      <aside style={{ width: 280, flexShrink: 0, overflowY: 'auto', borderLeft: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-container)', padding: 16 }}>
        {/* Account balance */}
        <div style={{ marginBottom: 16, borderRadius: 8, backgroundColor: 'var(--color-primary)', padding: 16, color: 'white' }}>
          <Flex justify="space-between" align="center">
            <Text variant="label/lg" as="h3" style={{ color: 'white' }}>Account balance</Text>
            <HintIcon style={{ height: 20, width: 20, borderColor: 'rgba(255,255,255,0.5)', color: 'rgba(255,255,255,0.8)' }} />
          </Flex>
          <Flex justify="space-between" align="center" style={{ marginTop: 8 }}>
            <Text variant="body/md" as="span">
              <Flex align="center" gap={4}>
                They owe
                <HintIcon style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'rgba(255,255,255,0.8)' }} />
              </Flex>
            </Text>
            <Text variant="body/md-strong" as="span">3,310.56</Text>
          </Flex>
          <Flex justify="space-between" align="center">
            <Text variant="body/md" as="span">Available credit balance</Text>
            <Text variant="body/md-strong" as="span">0.00</Text>
          </Flex>
        </div>

        {/* Client alerts */}
        <Collapse title="Client alerts" defaultOpen>
          <Text variant="body/md" as="span">Include KM</Text>
        </Collapse>

        {/* Client tags */}
        <Collapse title="Client tags" defaultOpen>
          <Flex wrap="wrap" gap={4}>
            <Badge variant="blue">Plan-managed</Badge>
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
              <Badge variant="orange" className="text-caption-sm">
                ARCHIVED
              </Badge>
            </Flex>
            <Text variant="body/sm" as="p" color="secondary">a a</Text>
            <Text variant="body/sm" as="p" color="secondary">Open rate: 0%</Text>
            <Text variant="body/sm" as="p" color="secondary">Click rate: 0%</Text>
            <Text variant="body/sm" as="p" color="secondary">
              Opt-in: 11:41 am, 16 Nov 2022
            </Text>
            <Button
              variant="secondary"
              size="sm"
              style={{ marginTop: 8, width: '100%' }}
              className="text-body-sm"
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

/* ─── Edit Details Form ────────────────────────────────────────── */

function EditDetailsForm({ client, onCancel }: { client: ClientData; onCancel: () => void }) {
  const dobParts = client.dateOfBirth ? client.dateOfBirth.split("-") : ["2025", "01", "01"];
  const [invoiceReminder, setInvoiceReminder] = useState(true);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <Text variant="display/md">Edit details</Text>
        <Flex align="center" gap={8}>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onCancel}>
            Save
          </Button>
        </Flex>
      </Flex>

      <div style={{ maxWidth: '42rem' }}>
        {/* General details with profile photo side-by-side */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>General details</Text>
          <Flex gap={32}>
            {/* Form fields */}
            <Flex vertical gap={16} style={{ flex: 1 }}>
              <FormSelect
                label="Title"
                options={[
                  { value: "", label: "Title" },
                  { value: "Mr", label: "Mr" },
                  { value: "Mrs", label: "Mrs" },
                  { value: "Ms", label: "Ms" },
                  { value: "Dr", label: "Dr" },
                ]}
              />

              <Grid cols={3} gap={12}>
                <FormInput
                  label="First name*"
                  type="text"
                  defaultValue={client.firstName}
                />
                <FormInput
                  label="Middle name"
                  type="text"
                  placeholder="Middle name"
                />
                <FormInput
                  label="Last name*"
                  type="text"
                  defaultValue={client.lastName}
                />
              </Grid>

              <FormInput label="Preferred name" type="text" />

              <Grid cols={3} gap={12}>
                <FormSelect
                  label="Day"
                  defaultValue={dobParts[2]}
                  options={Array.from({ length: 31 }, (_, i) => ({
                    value: String(i + 1),
                    label: String(i + 1),
                  }))}
                />
                <FormSelect
                  label="Month"
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
                />
                <FormSelect
                  label="Year"
                  defaultValue={dobParts[0]}
                  options={Array.from({ length: 100 }, (_, i) => {
                    const y = 2026 - i;
                    return { value: String(y), label: String(y) };
                  })}
                />
              </Grid>

              <FormSelect
                label="Sex"
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" },
                  { value: "Not specified", label: "Not specified" },
                ]}
              />

              <FormSelect
                label="Gender identity"
                options={[
                  { value: "", label: "" },
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Non-binary", label: "Non-binary" },
                  { value: "Other", label: "Other" },
                ]}
              />

              <FormInput
                label="Pronouns"
                type="text"
                placeholder="they / them"
              />

              <FormInput label="Occupation" type="text" />
            </Flex>

            {/* Profile photo - positioned to the right */}
            <div style={{ flexShrink: 0, paddingTop: 24 }} className="text-center">
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
          <FormTextarea
            defaultValue='For fields that are not available with the splose template, will show up here if they are all included in "Other Details" on the CSV file.'
            rows={4}
          />
        </section>

        {/* Alerts */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>Alerts</Text>
          <Text variant="body/md" as="p" color="secondary" style={{ marginBottom: 8 }}>
            Information you add here will be displayed in important places like scheduling appointments.
          </Text>
          <FormTextarea defaultValue="Include KM" rows={3} />
        </section>

        {/* Contact details */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>Contact details</Text>
          <Flex vertical gap={16}>
            <FormInput label="Email" type="email" defaultValue={client.email || ""} />
            <FormInput label="Phone" type="tel" defaultValue={client.phone || ""} />
            <FormInput label="Address" type="text" defaultValue={client.address || ""} />
          </Flex>
        </section>

        {/* Medicare */}
        {client.medicare && (
          <section>
            <Text variant="heading/lg" style={{ marginBottom: 16 }}>Medicare details</Text>
            <FormInput label="Card number" type="text" defaultValue={client.medicare} />
          </section>
        )}

        {/* NDIS */}
        {client.ndisNumber && (
          <section style={{ marginBottom: 32 }}>
            <Text variant="heading/lg" style={{ marginBottom: 16 }}>NDIS details</Text>
            <FormInput label="NDIS number" type="text" defaultValue={client.ndisNumber} />
          </section>
        )}

        {/* Privacy policy consent */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>Privacy policy consent</Text>
          <FormSelect
            label="Consent status"
            defaultValue="no-response"
            options={[
              { value: "no-response", label: "No response" },
              { value: "accepted", label: "Accepted" },
              { value: "declined", label: "Declined" },
            ]}
          />
        </section>

        {/* Medications, allergies & intolerances */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>Medications, allergies &amp; intolerances</Text>
          <Flex vertical gap={16}>
            <FormTextarea label="Medications" defaultValue="" placeholder="None" rows={2} />
            <FormTextarea label="Allergies" defaultValue="" placeholder="None" rows={2} />
            <FormTextarea label="Intolerances" defaultValue="" placeholder="None" rows={2} />
          </Flex>
        </section>

        {/* Custom fields */}
        <section style={{ marginBottom: 32 }}>
          <Text variant="heading/lg" style={{ marginBottom: 16 }}>Custom fields</Text>
          <Flex vertical gap={16}>
            <FormInput label="Date since surgery" type="text" defaultValue="25/09/2025" />
            <FormInput label="Note" type="text" defaultValue="Note short text check" />
          </Flex>
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
