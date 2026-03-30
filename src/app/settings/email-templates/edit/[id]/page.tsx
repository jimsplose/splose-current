"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  FormInput,
  FormSelect,
  Navbar,
  RichTextEditor,
  EmailPreview,
} from "@/components/ds";

const typeOptions = [
  { value: "invoice", label: "Invoice" },
  { value: "payment", label: "Payment" },
  { value: "progress-note", label: "Progress note" },
  { value: "form", label: "Form" },
  { value: "letter", label: "Letter" },
  { value: "general", label: "General" },
];

const variables = [
  "client_name", "practitioner_name", "practice_name", "invoice_number",
  "amount", "due_date", "payment_link", "unsubscribe_link",
];

export default function EditEmailTemplatePage() {
  const router = useRouter();
  const [name, setName] = useState("Invoice reminder");
  const [type, setType] = useState("invoice");
  const [subject, setSubject] = useState("Invoice {invoice_number} — payment reminder");
  const [body, setBody] = useState(
    "<p>Hi {client_name},</p><p>This is a friendly reminder that invoice <strong>{invoice_number}</strong> for <strong>{amount}</strong> is due on {due_date}.</p><p>You can pay online using the following link:<br/><a href='#'>{payment_link}</a></p><p>If you have already made payment, please disregard this email.</p><p>Kind regards,<br/>{practice_name}</p>"
  );
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div>
      <Navbar
        backHref="/settings/email-templates"
        title={name || "Edit email template"}
        children={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setShowPreview(true)}>Preview</Button>
            <Button variant="secondary" onClick={() => router.push("/settings/email-templates")}>Cancel</Button>
            <Button variant="primary" onClick={() => router.push("/settings/email-templates")}>Save</Button>
          </div>
        }
      />

      <div className="mx-auto max-w-3xl space-y-4 p-6">
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <FormSelect label="Type" value={type} onChange={setType} options={typeOptions} />
        </div>

        <FormInput label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />

        <div>
          <label className="mb-1 block text-label-lg text-text-secondary">Body</label>
          <RichTextEditor
            value={body}
            onChange={setBody}
            rows={14}
            variables={variables}
          />
        </div>
      </div>

      <EmailPreview
        open={showPreview}
        onClose={() => setShowPreview(false)}
        subject={subject.replace("{invoice_number}", "INV-031")}
        recipientName="Skyler Peterson"
        body={body
          .replace(/{client_name}/g, "Skyler")
          .replace(/{invoice_number}/g, "INV-031")
          .replace(/{amount}/g, "$148.71")
          .replace(/{due_date}/g, "28 Mar 2026")
          .replace(/{payment_link}/g, "https://pay.splose.com/inv-031")
          .replace(/{practice_name}/g, "Hands Together Therapies")
        }
      />
    </div>
  );
}
