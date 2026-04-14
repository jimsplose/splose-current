"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  FormInput,
  FormSelect,
  Toggle,
  Collapse,
  FormPage,
  RichTextEditor,
  EmailPreview,
  Grid,
} from "@/components/ds";

const typeOptions = [
  { value: "confirmation", label: "Confirmation" },
  { value: "reminder", label: "Reminder" },
  { value: "cancellation", label: "Cancellation" },
  { value: "reschedule", label: "Reschedule" },
  { value: "follow-up", label: "Follow-up" },
];

const whenToSendOptions = [
  { value: "immediately", label: "Immediately" },
  { value: "1-hour-before", label: "1 hour before" },
  { value: "24-hours-before", label: "24 hours before" },
  { value: "48-hours-before", label: "48 hours before" },
  { value: "1-week-before", label: "1 week before" },
];

const variableTokens = [
  "client_name", "practitioner_name", "appointment_date", "appointment_time",
  "service_name", "location_name", "practice_name", "cancellation_link",
];

export default function NewAppointmentTemplatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState("confirmation");
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [smsBody, setSmsBody] = useState(
    "Hi {client_name}, this is a reminder for your appointment on {appointment_date} at {appointment_time} with {practitioner_name}."
  );
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [emailSubject, setEmailSubject] = useState("Appointment Confirmation — {appointment_date}");
  const [emailBody, setEmailBody] = useState(
    "<p>Hi {client_name},</p><p>This is to confirm your appointment on <strong>{appointment_date}</strong> at <strong>{appointment_time}</strong> with {practitioner_name} at {location_name}.</p><p>Please arrive 10 minutes early.</p><p>Regards,<br/>{practice_name}</p>"
  );
  const [whenToSend, setWhenToSend] = useState("immediately");
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <FormPage
        backHref="/settings/appointment-templates"
        title={name || "New appointment template"}
        maxWidth={768}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button variant="secondary" onClick={() => router.push("/settings/appointment-templates")}>Cancel</Button>
            <Button variant="primary" onClick={() => router.push("/settings/appointment-templates")}>Save</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Grid cols={2} gap="md">
          <FormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Appointment confirmation" />
          <FormSelect label="Type" value={type} onChange={setType} options={typeOptions} />
        </Grid>

        {type === "reminder" && (
          <FormSelect label="When to send" value={whenToSend} onChange={setWhenToSend} options={whenToSendOptions} />
        )}

        <Collapse title="SMS" defaultOpen={smsEnabled}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Toggle label="Enable SMS notification" checked={smsEnabled} onChange={setSmsEnabled} />
            {smsEnabled && (
              <div>
                <label className="text-label-lg text-text-secondary" style={{ marginBottom: 4, display: 'block' }}>Message</label>
                <textarea
                  className="text-body-md text-text"
                  style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none' }}
                  rows={4}
                  value={smsBody}
                  onChange={(e) => setSmsBody(e.target.value)}
                />
                <p className="text-caption-md text-text-secondary" style={{ marginTop: 4 }}>
                  Variables: {variableTokens.map((v) => `{${v}}`).join(", ")}
                </p>
              </div>
            )}
          </div>
        </Collapse>

        <Collapse title="Email" defaultOpen={emailEnabled}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Toggle label="Enable email notification" checked={emailEnabled} onChange={setEmailEnabled} />
            {emailEnabled && (
              <>
                <FormInput label="Subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
                <div>
                  <label className="text-label-lg text-text-secondary" style={{ marginBottom: 4, display: 'block' }}>Body</label>
                  <RichTextEditor
                    value={emailBody}
                    onChange={setEmailBody}
                    rows={10}
                    variables={variableTokens}
                  />
                </div>
                <Button variant="secondary" onClick={() => setShowPreview(true)}>Email preview</Button>
              </>
            )}
          </div>
        </Collapse>
        </div>
      </FormPage>

      <EmailPreview
        open={showPreview}
        onClose={() => setShowPreview(false)}
        subject={emailSubject.replace("{appointment_date}", "Mon 24 Mar 2026")}
        recipientName="Skyler Peterson"
        body={emailBody
          .replace(/{client_name}/g, "Skyler")
          .replace(/{practitioner_name}/g, "Dr. James Wilson")
          .replace(/{appointment_date}/g, "Monday, 24 March 2026")
          .replace(/{appointment_time}/g, "10:00 AM")
          .replace(/{location_name}/g, "East Clinics")
          .replace(/{practice_name}/g, "Hands Together Therapies")
          .replace(/{service_name}/g, "1:1 Consultation")
        }
      />
    </>
  );
}
