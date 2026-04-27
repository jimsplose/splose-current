"use client";

import { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Select } from "antd";
import { Checkbox, FileUpload, FormInput, Toggle, Modal, HintIcon, PageHeader, Text, Grid, Divider } from "@/components/ds";
import styles from "./SettingsDetails.module.css";

const businessHistory = [
  { date: "15 Jan 2026", description: "Business name changed from 'Acme Therapy' to 'Hands Together Therapies'" },
  { date: "3 Dec 2025", description: "ABN updated" },
  { date: "18 Nov 2025", description: "Workspace URL changed" },
  { date: "1 Sep 2025", description: "Account created" },
];

export default function SettingsDetailsPage() {
  const [form] = Form.useForm();
  const [emailSigTab, setEmailSigTab] = useState<"Business" | "User">("Business");
  const [casesToggle, setCasesToggle] = useState(true);
  const [applyToAll, setApplyToAll] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <PageHeader title="Details">
        <Button type="primary">Save</Button>
      </PageHeader>

      <Flex vertical gap={24}>
        <Flex gap={32}>
          <div className={styles.formCol}>
            <Flex vertical gap={16}>
              <Form layout="vertical" form={form}>
              <Form.Item
                label={
                  <Flex align="center" justify="space-between">
                    Business name
                    <Button type="link" size="small" onClick={() => setHistoryOpen(true)}>
                      Business history
                    </Button>
                  </Flex>
                }
                required
              >
                <Input defaultValue="Hands Together Therapies" />
              </Form.Item>
              <Form.Item label={<span>Workspace URL <HintIcon /></span>}>
                <Input defaultValue="acme.splose.com" />
              </Form.Item>
              <Form.Item label="Website">
                <Input defaultValue="hands-together-therapy.com" />
              </Form.Item>
              <Form.Item label="Business email" required>
                <Input type="email" defaultValue="hello@hands-together-therapy.com" />
              </Form.Item>
              </Form>
            </Flex>
          </div>
          <div className={styles.uploadCol}>
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

        <Form layout="vertical">
        <Grid cols={2} gap="md">
          <Form.Item label={<span>Patient terminology <HintIcon /></span>} required>
            <Select
              options={[{ value: "Client", label: "Client" }, { value: "Patient", label: "Patient" }, { value: "Participant", label: "Participant" }]}
              defaultValue="Client"
            />
          </Form.Item>
          <Form.Item label="Currency code" required>
            <Input defaultValue="AUD" disabled />
          </Form.Item>
        </Grid>

        <Grid cols={2} gap="md">
          <Form.Item label="Country" required>
            <Select
              options={[{ value: "Australia", label: "Australia" }, { value: "New Zealand", label: "New Zealand" }, { value: "United Kingdom", label: "United Kingdom" }]}
              defaultValue="Australia"
              disabled
            />
          </Form.Item>
          <Form.Item label="Currency symbol" required>
            <Input defaultValue="A$" disabled />
          </Form.Item>
        </Grid>
        </Form>

        <Form layout="vertical">
        <Grid cols={2} gap="md">
          <div>
            <Form.Item label={<span>Default appointment communication preferences <HintIcon /></span>} required>
              <Select
                options={[{ value: "SMS & Email", label: "SMS & Email" }, { value: "SMS only", label: "SMS only" }, { value: "Email only", label: "Email only" }, { value: "None", label: "None" }]}
                defaultValue="SMS & Email"
              />
            </Form.Item>
            <div className={styles.checkboxRow}>
              <Checkbox
                label="Apply to all existing clients and override the current contact preferences"
                checked={applyToAll}
                onChange={(e) => setApplyToAll(e.target.checked)}
              />
            </div>
          </div>
          <div>
            <Form.Item label="Tax Label for invoices (E.g. ABN)" required>
              <Input defaultValue="ABN" />
            </Form.Item>
            <Text variant="body/md" color="secondary" mt={8}>
              Enter your business number in{" "}
              <Button type="link" size="small">Location settings</Button>
            </Text>
          </div>
        </Grid>
        </Form>

        <Divider variant="primary" spacing="sm" />

        <div>
          <Text variant="heading/lg" mb={12}>Email signature</Text>
          <Flex align="center" gap={8} className={styles.checkboxRow}>
            <Button
              type={emailSigTab === "Business" ? "primary" : "default"}
              size="small"
              onClick={() => setEmailSigTab("Business")}
              shape="round"
              className={styles.pillBtn}
            >
              Business <DownOutlined className={styles.pillBtnIcon} />
            </Button>
            <Button
              type={emailSigTab === "User" ? "primary" : "default"}
              size="small"
              onClick={() => setEmailSigTab("User")}
              shape="round"
              className={styles.pillBtn}
            >
              User <DownOutlined className={styles.pillBtnIcon} />
            </Button>
          </Flex>
          <Flex align="center" gap={4} className={styles.toolbar}>
            <Button type="text" className={styles.toolbarBold}>B</Button>
            <Button type="text" className={styles.toolbarItalic}>I</Button>
            <Divider orientation="vertical" spacing="xs" />
            <Button type="text" className={styles.toolbarAi}>AI</Button>
            <Divider orientation="vertical" spacing="xs" />
            <Button type="text">
              <svg className={styles.toolbarSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h18v18H3V3zm0 6h18M3 15h18M9 3v18M15 3v18" /></svg>
            </Button>
            <Button type="text">
              <svg className={styles.toolbarSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </Button>
            <Button type="text">+</Button>
            <Divider orientation="vertical" spacing="xs" />
            <Button type="text">
              <svg className={styles.toolbarSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h10M4 18h16" /></svg>
            </Button>
            <Button type="text">
              <svg className={styles.toolbarSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M7 12h10M4 18h16" /></svg>
            </Button>
            <Button type="text">
              <svg className={styles.toolbarSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            </Button>
          </Flex>
          <div className={styles.editor}>
            <p className={styles.editorStrike}>Warm Regards,</p>
            <p className={styles.editorVarSpaced}>{"{user_fullName}"}</p>
            <p className={styles.editorVar}>{"{user_professionTitle}"}</p>
            <p className={styles.editorVar}>{"{user_email}"}</p>
            <p className={styles.editorVarBlock}>{"{business_name}"}</p>
            <p className={styles.editorVar}>{"{business_email}"}</p>
            <p className={styles.editorVar}>{"{business_website}"}</p>
            <p className={styles.editorVar}>{"{user_signature}"}</p>
            <p className={styles.editorVar}>{"{user_workPhoneNumber}{user_professionTitle}"}</p>
            <div className={styles.editorWatermarkWrap}>
              <Text as="span" variant="display/lg" className={styles.editorWatermark}>splose</Text>
            </div>
          </div>
        </div>

        <Divider variant="primary" spacing="sm" />

        <div>
          <Text variant="heading/lg" mb={12}>Calendar lock dates</Text>
          <Text variant="body/md" color="secondary" mb={8}>
            Prevent users with the practitioner role from making changes on the calendar on and before
          </Text>
          <FormInput type="text" defaultValue="19 Dec 2025" className={styles.narrowField} />
        </div>

        <Divider variant="primary" spacing="sm" />

        <div>
          <Text variant="heading/lg" mb={12}>Google Tag Manager</Text>
          <FormInput label="Google Tag Manager ID" type="text" defaultValue="GTM-TEST1231" className={styles.narrowField} />
        </div>

        <Divider variant="primary" spacing="sm" />

        <div>
          <Text variant="heading/lg" mb={12}>Cases</Text>
          <Flex align="center" justify="space-between">
            <Text variant="body/md">Block bookings exceeding case or funding periods (default setting)</Text>
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
            <li key={i} className={styles.historyEntry}>
              <Text variant="body/md">{entry.description}</Text>
              <Text variant="body/sm" color="secondary" mt={2}>{entry.date}</Text>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}
