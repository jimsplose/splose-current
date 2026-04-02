"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  FormInput,
  FormSelect,
  FormPage,
  RichTextEditor,
} from "@/components/ds";

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button variant="secondary" onClick={() => router.push("/settings/letter-templates")}>Cancel</Button>
          <Button variant="primary" onClick={() => router.push("/settings/letter-templates")}>Save</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <FormInput label="Template name" value={name} onChange={(e) => setName(e.target.value)} />
          <FormSelect label="Default recipient" value={recipient} onChange={setRecipient} options={recipientOptions} />
        </div>

        <FormInput label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />

        <div>
          <label className="text-label-lg text-text-secondary" style={{ marginBottom: 4, display: 'block' }}>Letter body</label>
          <RichTextEditor
            value={body}
            onChange={setBody}
            rows={18}
            variables={variables}
          />
        </div>
      </div>
    </FormPage>
  );
}
