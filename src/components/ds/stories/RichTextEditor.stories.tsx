import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import RichTextEditor from "../RichTextEditor";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof RichTextEditor> = {
  title: "Forms/RichTextEditor",
  component: RichTextEditor,
  tags: ["extended"],
  argTypes: {
    value: {
      control: "text",
      description: "HTML content of the editor",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text shown when the editor is empty",
    },
    rows: {
      control: { type: "number", min: 2, max: 20 },
      description: "Minimum height in rows (each row = 24px)",
    },
    variables: {
      control: "object",
      description: "Optional list of template variables shown in the Insert variable dropdown",
    },
  },
  parameters: {
    layout: "padded",
    appPages: [
      {
        label: "Settings: Edit email template",
        vercel: "https://splose-current.vercel.app/settings/email-templates/edit/1",
        localhost: "http://localhost:3000/settings/email-templates/edit/1",
        production: "https://acme.splose.com/settings/email-templates/edit/1",
      },
      {
        label: "Settings: Edit progress note template",
        vercel: "https://splose-current.vercel.app/settings/progress-notes/edit/1",
        localhost: "http://localhost:3000/settings/progress-notes/edit/1",
        production: "https://acme.splose.com/settings/progress-notes/edit/1",
      },
      {
        label: "Settings: Edit letter template",
        vercel: "https://splose-current.vercel.app/settings/letter-templates/edit/1",
        localhost: "http://localhost:3000/settings/letter-templates/edit/1",
        production: "https://acme.splose.com/settings/letter-templates/edit/1",
      },
      {
        label: "Settings: Invoice settings (invoice notes editor)",
        vercel: "https://splose-current.vercel.app/settings/invoice-settings",
        localhost: "http://localhost:3000/settings/invoice-settings",
        production: "https://acme.splose.com/settings/invoice-settings",
      },
    ],
    referenceUrl: null,
  },
};

export default meta;
type Story = StoryObj<typeof RichTextEditor>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    value: "<p>Edit me in the controls panel.</p>",
    placeholder: "Start typing...",
    rows: 8,
    variables: ["patient_name", "appointment_date"],
  },
  render: (args) => {
    const [val, setVal] = useState(args.value ?? "");
    return (
      <RichTextEditor
        value={val}
        onChange={setVal}
        placeholder={args.placeholder}
        rows={args.rows}
        variables={args.variables}
      />
    );
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES — one per major feature                         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  WithVariables                                                      */
/*  Shows the "Insert variable" dropdown in the toolbar                */
/* ------------------------------------------------------------------ */

export const WithVariables: Story = {
  name: "With Variables",
  render: () => {
    const [value, setValue] = useState(
      "<p>Hi {patient_name},</p><p>Your next appointment is on {appointment_date}.</p>"
    );
    return (
      <RichTextEditor
        value={value}
        onChange={setValue}
        variables={[
          "patient_name",
          "appointment_date",
          "practitioner_name",
          "location",
          "service_type",
        ]}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "When a `variables` array is provided, an \"Insert variable\" dropdown appears in the toolbar. Clicking a variable inserts it at the cursor as `{variable_name}`.",
      },
    },
  },
};

/* ------------------------------------------------------------------ */
/*  CustomPlaceholder                                                  */
/*  Demonstrates the placeholder prop on an empty editor               */
/* ------------------------------------------------------------------ */

export const CustomPlaceholder: Story = {
  name: "Custom Placeholder",
  render: () => {
    const [value, setValue] = useState("");
    return (
      <RichTextEditor
        value={value}
        onChange={setValue}
        placeholder="Write your email body here..."
        rows={6}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Custom placeholder text is shown via a CSS `::before` pseudo-element when the editor content is empty.",
      },
    },
  },
};

/* ------------------------------------------------------------------ */
/*  LargeTextArea                                                      */
/*  Tall editor for long-form content                                  */
/* ------------------------------------------------------------------ */

export const LargeTextArea: Story = {
  name: "Large Text Area",
  render: () => {
    const [value, setValue] = useState(
      "<p>This editor uses <code>rows={14}</code> for long-form content such as letter bodies or detailed clinical notes.</p>"
    );
    return <RichTextEditor value={value} onChange={setValue} rows={14} />;
  },
  parameters: {
    docs: {
      description: {
        story: "The `rows` prop controls minimum height (rows * 24px). Use 14+ rows for long-form content like letter templates.",
      },
    },
  },
};

/* ================================================================== */
/*  3. ALL VARIANTS COMPARISON                                         */
/* ================================================================== */

/** Multiple RichTextEditor instances side-by-side showing different configurations. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Default (8 rows)</p>
        <RichTextEditor placeholder="Default editor..." />
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Compact (3 rows)</p>
        <RichTextEditor placeholder="Short editor..." rows={3} />
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', marginBottom: 4 }}>With variables</p>
        <RichTextEditor
          placeholder="Type and insert variables..."
          variables={["client_name", "date", "amount"]}
        />
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Pre-filled content</p>
        <RichTextEditor
          value="<p>Hi <strong>{client_name}</strong>,</p><p>Your invoice is attached.</p>"
          rows={4}
        />
      </div>
    </div>
  ),
};

/* ================================================================== */
/*  4. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  EmailTemplateEditor                                                */
/*  Pattern: Rich text body with template variable insertion           */
/*  Source: /settings/email-templates/edit/[id] — invoice/reminder     */
/*           email template with 8 variables and 14-row editor         */
/* ------------------------------------------------------------------ */

export const EmailTemplateEditor: Story = {
  name: "Recipe: Email Template Editor",
  render: () => {
    const [body, setBody] = useState(
      "<p>Hi {client_name},</p><p>This is a friendly reminder that invoice <strong>{invoice_number}</strong> for <strong>{amount}</strong> is due on {due_date}.</p><p>You can pay online using the following link:<br/><a href='#'>{payment_link}</a></p><p>Kind regards,<br/>{practice_name}</p>"
    );
    return (
      <div style={{ maxWidth: 768 }}>
        <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>
          Body
        </label>
        <RichTextEditor
          value={body}
          onChange={setBody}
          rows={14}
          variables={[
            "client_name",
            "practitioner_name",
            "practice_name",
            "invoice_number",
            "amount",
            "due_date",
            "payment_link",
            "unsubscribe_link",
          ]}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Email template editor with variable insertion dropdown. Matches the pattern used on /settings/email-templates/edit/[id].",
      },
    },
  },
};

/* ------------------------------------------------------------------ */
/*  ProgressNoteEditor                                                 */
/*  Pattern: Plain rich-text area for clinical free-text, no variables */
/*  Source: /settings/progress-notes/edit/[id] — free text section     */
/*           with 6-row editor for clinical note content               */
/* ------------------------------------------------------------------ */

export const ProgressNoteEditor: Story = {
  name: "Recipe: Progress Note Editor",
  render: () => {
    const [freeText, setFreeText] = useState("");
    return (
      <div style={{ maxWidth: 768 }}>
        <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>
          Free text section
        </label>
        <RichTextEditor
          value={freeText}
          onChange={setFreeText}
          placeholder="Enter clinical notes..."
          rows={8}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Plain rich-text editor for clinical progress notes — no template variables needed. Matches the pattern used on /settings/progress-notes/edit/[id].",
      },
    },
  },
};

/* ------------------------------------------------------------------ */
/*  SmsTemplateEditor                                                  */
/*  Pattern: Compact editor for SMS templates with character variables  */
/*  Source: /settings/appointment-templates/new — SMS body with        */
/*           3-row editor and appointment-related variables             */
/* ------------------------------------------------------------------ */

export const SmsTemplateEditor: Story = {
  name: "Recipe: SMS Template Editor",
  render: () => {
    const [smsBody, setSmsBody] = useState(
      "Hi {client_name}, this is a reminder for your appointment on {appointment_date} at {appointment_time} with {practitioner_name}."
    );
    return (
      <div style={{ maxWidth: 768 }}>
        <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>
          SMS body
        </label>
        <RichTextEditor
          value={smsBody}
          onChange={setSmsBody}
          placeholder="Enter SMS message..."
          rows={3}
          variables={[
            "client_name",
            "practitioner_name",
            "appointment_date",
            "appointment_time",
            "service_name",
            "location_name",
            "practice_name",
            "cancellation_link",
          ]}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Compact 3-row editor for SMS templates with appointment variables. Matches the pattern used on /settings/appointment-templates/new.",
      },
    },
  },
};
