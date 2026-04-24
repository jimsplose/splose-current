"use client";

import { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import { Checkbox, FileUpload, FormInput, FormSelect, Toggle, Tab, Modal, Dropdown, HintIcon, PageHeader, Text, Grid, Divider } from "@/components/ds";
import FormLabel from "@/components/ds/FormLabel";

const businessHistory = [
  { date: "15 Jan 2026", description: "Business name changed from 'Acme Therapy' to 'Hands Together Therapies'" },
  { date: "3 Dec 2025", description: "ABN updated" },
  { date: "18 Nov 2025", description: "Workspace URL changed" },
  { date: "1 Sep 2025", description: "Account created" },
];

export default function SettingsDetailsPage() {
  const [emailSigTab, setEmailSigTab] = useState<"Business" | "User">("Business");
  const [casesToggle, setCasesToggle] = useState(true);
  const [applyToAll, setApplyToAll] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <div style={{ maxWidth: 896, padding: 24 }}>
      <PageHeader title="Details">
        <Button type="primary">Save</Button>
      </PageHeader>

      <Flex vertical gap={24}>
        <Flex gap={32}>
          <div style={{ flex: 1 }}>
            <Flex vertical gap={16}>
              <div>
                <Flex align="center" justify="space-between" style={{ marginBottom: 4 }}>
                  <FormLabel size="sm" mb={0} required>
                    Business name
                  </FormLabel>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => setHistoryOpen(true)}
                  >
                    Business history
                  </Button>
                </Flex>
                <FormInput type="text" defaultValue="Hands Together Therapies" />
              </div>
              <div>
                <FormLabel size="sm">
                  Workspace URL{" "}
                  <HintIcon />
                </FormLabel>
                <FormInput type="text" defaultValue="acme.splose.com" />
              </div>
              <FormInput label="Website" type="text" defaultValue="hands-together-therapy.com" />
              <div>
                <FormLabel size="sm" required>
                  Business email
                </FormLabel>
                <FormInput type="email" defaultValue="hello@hands-together-therapy.com" />
              </div>
            </Flex>
          </div>
          <div style={{ width: 192, flexShrink: 0 }}>
            <FileUpload
              icon={
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="28" fill="#ede9fe" />
                  <path d="M22 38c0-6 4-16 10-16s10 10 10 16" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="28" cy="26" r="2" fill="#7c3aed" />
                  <circle cx="36" cy="26" r="2" fill="#7c3aed" />
                  <path d="M28 32c2 2 6 2 8 0" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
              label="Upload"
            />
          </div>
        </Flex>

        <Divider variant="primary" spacing="sm" />

        <Grid cols={2} gap="md">
          <div>
            <FormLabel size="sm" required>
              Patient terminology{" "}
              <HintIcon />
            </FormLabel>
            <FormSelect options={[{ value: "Client", label: "Client" }, { value: "Patient", label: "Patient" }, { value: "Participant", label: "Participant" }]} />
          </div>
          <div>
            <FormLabel size="sm" required>
              Currency code
            </FormLabel>
            <FormInput type="text" defaultValue="AUD" disabled />
          </div>
        </Grid>

        <Grid cols={2} gap="md">
          <div>
            <FormLabel size="sm" required>
              Country
            </FormLabel>
            <FormSelect options={[{ value: "Australia", label: "Australia" }, { value: "New Zealand", label: "New Zealand" }, { value: "United Kingdom", label: "United Kingdom" }]} disabled />
          </div>
          <div>
            <FormLabel size="sm" required>
              Currency symbol
            </FormLabel>
            <FormInput type="text" defaultValue="A$" disabled />
          </div>
        </Grid>

        <Grid cols={2} gap="md">
          <div>
            <FormLabel size="sm" required>
              Default appointment communication preferences{" "}
              <HintIcon />
            </FormLabel>
            <FormSelect options={[{ value: "SMS & Email", label: "SMS & Email" }, { value: "SMS only", label: "SMS only" }, { value: "Email only", label: "Email only" }, { value: "None", label: "None" }]} />
            <div style={{ marginTop: 8 }}>
              <Checkbox
                label="Apply to all existing clients and override the current contact preferences"
                checked={applyToAll}
                onChange={(e) => setApplyToAll(e.target.checked)}
              />
            </div>
          </div>
          <div>
            <FormLabel size="sm" required>
              Tax Label for invoices (E.g. ABN)
            </FormLabel>
            <FormInput type="text" defaultValue="ABN" />
            <Text variant="body/md" color="secondary" style={{ marginTop: 8 }}>
              Enter your business number in{" "}
              <Button type="link" size="small">Location settings</Button>
            </Text>
          </div>
        </Grid>

        <Divider variant="primary" spacing="sm" />

        <div>
          <Text variant="heading/lg" style={{ marginBottom: 12 }}>Email signature</Text>
          <Flex align="center" gap={8} style={{ marginBottom: 12 }}>
            <Button
              type={emailSigTab === "Business" ? "primary" : "default"}
              size="small"
              onClick={() => setEmailSigTab("Business")}
              shape="round"
              style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 4, paddingBottom: 4 }}
            >
              Business <DownOutlined style={{ fontSize: 12, color: 'var(--ant-color-text, #414549)', marginLeft: 4 }} />
            </Button>
            <Button
              type={emailSigTab === "User" ? "primary" : "default"}
              size="small"
              onClick={() => setEmailSigTab("User")}
              shape="round"
              style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 4, paddingBottom: 4 }}
            >
              User <DownOutlined style={{ fontSize: 12, color: 'var(--ant-color-text, #414549)', marginLeft: 4 }} />
            </Button>
          </Flex>
          <Flex align="center" gap={4} style={{ borderRadius: '8px 8px 0 0', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-fill-tertiary)', padding: '6px 8px' }}>
            <Button type="text" style={{ fontWeight: 700 }}>B</Button>
            <Button type="text" style={{ fontStyle: 'italic' }}>I</Button>
            <Divider orientation="vertical" spacing="xs" />
            <Button type="text" style={{ color: 'var(--color-primary)' }}>AI</Button>
            <Divider orientation="vertical" spacing="xs" />
            <Button type="text">
              <svg style={{ height: 16, width: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h18v18H3V3zm0 6h18M3 15h18M9 3v18M15 3v18" /></svg>
            </Button>
            <Button type="text">
              <svg style={{ height: 16, width: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </Button>
            <Button type="text">+</Button>
            <Divider orientation="vertical" spacing="xs" />
            <Button type="text">
              <svg style={{ height: 16, width: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h10M4 18h16" /></svg>
            </Button>
            <Button type="text">
              <svg style={{ height: 16, width: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M7 12h10M4 18h16" /></svg>
            </Button>
            <Button type="text">
              <svg style={{ height: 16, width: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            </Button>
          </Flex>
          <div style={{ borderRadius: '0 0 8px 8px', border: '1px solid var(--color-border)', borderTop: 'none', backgroundColor: 'white', minHeight: 200, position: 'relative', fontSize: 14, padding: 16 }}>
            <p style={{ textDecoration: 'line-through' }}>Warm Regards,</p>
            <p style={{ marginTop: 4, color: 'var(--color-primary)' }}>{"{user_fullName}"}</p>
            <p style={{ color: 'var(--color-primary)' }}>{"{user_professionTitle}"}</p>
            <p style={{ color: 'var(--color-primary)' }}>{"{user_email}"}</p>
            <p style={{ marginTop: 8, color: 'var(--color-primary)' }}>{"{business_name}"}</p>
            <p style={{ color: 'var(--color-primary)' }}>{"{business_email}"}</p>
            <p style={{ color: 'var(--color-primary)' }}>{"{business_website}"}</p>
            <p style={{ color: 'var(--color-primary)' }}>{"{user_signature}"}</p>
            <p style={{ color: 'var(--color-primary)' }}>{"{user_workPhoneNumber}{user_professionTitle}"}</p>
            <div style={{ position: 'absolute', right: 24, bottom: 24 }}>
              <Text as="span" variant="display/lg" style={{ color: '#e9d5ff', userSelect: 'none', letterSpacing: '0.05em' }}>splose</Text>
            </div>
          </div>
        </div>

        <Divider variant="primary" spacing="sm" />

        <div>
          <Text variant="heading/lg" style={{ marginBottom: 12 }}>Calendar lock dates</Text>
          <Text variant="body/md" color="secondary" style={{ marginBottom: 8 }}>
            Prevent users with the practitioner role from making changes on the calendar on and before
          </Text>
          <FormInput type="text" defaultValue="19 Dec 2025" style={{ maxWidth: 320 }} />
        </div>

        <Divider variant="primary" spacing="sm" />

        <div>
          <Text variant="heading/lg" style={{ marginBottom: 12 }}>Google Tag Manager</Text>
          <FormInput label="Google Tag Manager ID" type="text" defaultValue="GTM-TEST1231" style={{ maxWidth: 320 }} />
        </div>

        <Divider variant="primary" spacing="sm" />

        <div>
          <Text variant="heading/lg" style={{ marginBottom: 12 }}>Cases</Text>
          <Flex align="center" justify="space-between">
            <p style={{ fontSize: 14 }}>Block bookings exceeding case or funding periods (default setting)</p>
            <Toggle checked={casesToggle} onChange={setCasesToggle} />
          </Flex>
        </div>

        <div>
          <Button type="link" size="small">Business settings change log</Button>
        </div>
      </Flex>

      <Modal open={historyOpen} onClose={() => setHistoryOpen(false)} title="Business history">
        <ul>
          {businessHistory.map((entry, i) => (
            <li key={i} style={{ paddingTop: i === 0 ? 0 : 12, paddingBottom: i === businessHistory.length - 1 ? 0 : 12, borderTop: i === 0 ? 'none' : '1px solid var(--color-border)' }}>
              <p style={{ fontSize: 14 }}>{entry.description}</p>
              <Text variant="body/sm" color="secondary" style={{ marginTop: 2 }}>{entry.date}</Text>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}
