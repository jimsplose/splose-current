"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flex, Form } from "antd";
import { FormInput, FormSelect, FormPage, RichTextEditor, Grid } from "@/components/ds";

const recipientOptions = [
  { value: "client", label: "Client" },
  { value: "contact", label: "Contact" },
  { value: "referrer", label: "Referrer" },
  { value: "gp", label: "GP" },
  { value: "other", label: "Other" },
];

const variables = [
  "client_name", "client_dob", "client_address", "practitioner_name",
  "practitioner_title", "practice_name", "practice_address", "practice_phone",
  "date", "recipient_name", "recipient_address",
];

export default function EditLetterTemplatePage() {
  const router = useRouter();
  const [name, setName] = useState("GP Referral Letter");
  const [recipient, setRecipient] = useState("gp");
  const [subject, setSubject] = useState("Re: {client_name} — Referral");
  const [body, setBody] = useState(
    "<p>Dear {recipient_name},</p><p>I am writing to refer <strong>{client_name}</strong> (DOB: {client_dob}) for further assessment and treatment.</p><p><strong>Presenting concerns:</strong></p><p>[Enter presenting concerns here]</p><p><strong>Assessment findings:</strong></p><p>[Enter assessment findings here]</p><p><strong>Recommendations:</strong></p><p>[Enter recommendations here]</p><p>Please do not hesitate to contact me if you require further information.</p><p>Kind regards,<br/>{practitioner_name}<br/>{practitioner_title}<br/>{practice_name}<br/>{practice_phone}</p>"
  );

  return (
    <FormPage
      backHref="/settings/letter-templates"
      title={name || "Edit letter template"}
      maxWidth={768}
      actions={
        <Flex align="center" gap={8}>
          <Button onClick={() => router.push("/settings/letter-templates")}>Cancel</Button>
          <Button type="primary" onClick={() => router.push("/settings/letter-templates")}>Save</Button>
        </Flex>
      }
    >
      <Flex vertical gap={16}>
        <Grid cols={2} gap="md">
          <FormInput label="Template name" value={name} onChange={(e) => setName(e.target.value)} />
          <FormSelect label="Default recipient" value={recipient} onChange={setRecipient} options={recipientOptions} />
        </Grid>

        <FormInput label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />

        <div>
          <Form.Item label="Letter body" style={{ marginBottom: 4 }}>
            <RichTextEditor
              value={body}
              onChange={setBody}
              rows={18}
              variables={variables}
            />
          </Form.Item>
        </div>
      </Flex>
    </FormPage>
  );
}
