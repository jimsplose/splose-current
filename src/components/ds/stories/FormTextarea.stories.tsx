import type { Meta, StoryObj } from "@storybook/react";
import FormTextarea from "../FormTextarea";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof FormTextarea> = {
  title: "Forms/FormTextarea",
  component: FormTextarea,
  tags: ["extended"],
  parameters: {
    appPages: [
      { label: "Settings — Online bookings (edit)", vercel: "https://splose-current.vercel.app/settings/online-bookings/1", localhost: "http://localhost:3000/settings/online-bookings/1", production: "https://acme.splose.com/settings/online-bookings" },
      { label: "Settings — Forms (edit)", vercel: "https://splose-current.vercel.app/settings/forms/1", localhost: "http://localhost:3000/settings/forms/1", production: "https://acme.splose.com/settings/forms" },
      { label: "Settings — Invoice settings", vercel: "https://splose-current.vercel.app/settings/invoice-settings", localhost: "http://localhost:3000/settings/invoice-settings", production: "https://acme.splose.com/settings/invoice-settings" },
      { label: "Settings — AI", vercel: "https://splose-current.vercel.app/settings/ai", localhost: "http://localhost:3000/settings/ai", production: "https://acme.splose.com/settings/ai" },
    ],
    referenceUrl: "https://ant.design/components/input",
  },
  argTypes: {
    label: {
      control: "text",
      description: "Label shown above the textarea",
    },
    rows: {
      control: "number",
      description: "Number of visible text rows",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    error: {
      control: "text",
      description: "Error message shown below the textarea",
    },
    disabled: {
      control: "boolean",
      description: "Disables the textarea",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof FormTextarea>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    label: "Notes",
    rows: 4,
    placeholder: "Enter notes...",
    error: "",
    disabled: false,
  },
  decorators: [(Story) => <div style={{ width: 384 }}>{Story()}</div>],
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  args: { placeholder: "Type here..." },
  decorators: [(Story) => <div style={{ width: 384 }}>{Story()}</div>],
};

export const WithLabel: Story = {
  args: { label: "Description", placeholder: "Enter a description..." },
  decorators: [(Story) => <div style={{ width: 384 }}>{Story()}</div>],
};

export const WithError: Story = {
  args: {
    label: "Notes",
    placeholder: "Enter notes...",
    error: "This field is required",
  },
  decorators: [(Story) => <div style={{ width: 384 }}>{Story()}</div>],
};

export const Resizable: Story = {
  args: {
    label: "Resizable textarea",
    rows: 4,
    placeholder: "Drag the bottom-right corner to resize...",
  },
  decorators: [(Story) => <div style={{ width: 384 }}>{Story()}</div>],
};

export const Disabled: Story = {
  args: {
    label: "Locked field",
    disabled: true,
    defaultValue: "This content cannot be edited.",
    rows: 3,
  },
  decorators: [(Story) => <div style={{ width: 384 }}>{Story()}</div>],
};

/* ------------------------------------------------------------------ */
/*  All States side-by-side                                            */
/* ------------------------------------------------------------------ */

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', maxWidth: 448, flexDirection: 'column', gap: 16 }}>
      <FormTextarea label="Normal" placeholder="Type here..." />
      <FormTextarea label="With value" defaultValue="This is a sample description that spans multiple lines." rows={4} />
      <FormTextarea label="With error" error="This field is required" />
      <FormTextarea label="Disabled" disabled defaultValue="Cannot edit this content" rows={3} />
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  NoteContent                                                        */
/*  Pattern: Large textarea for writing progress notes                 */
/*  Source: /notes/new — Note content field (18 rows)                  */
/* ------------------------------------------------------------------ */

export const NoteContent: Story = {
  render: () => (
    <div style={{ maxWidth: 672 }}>
      <FormTextarea
        label="Note content"
        rows={18}
        placeholder="Start writing your progress note here..."
        defaultValue={`Client attended a 60-minute physiotherapy session. Presented with ongoing lower back pain (L4-L5 region), reporting 6/10 pain at rest and 8/10 with forward flexion.\n\nTreatment included:\n- Soft tissue release to lumbar paraspinals\n- Joint mobilisation (PA glides L4-L5)\n- Core stability exercises (dead bugs, bird-dogs)\n- Home exercise program review and progression\n\nClient reported reduced pain to 4/10 post-treatment. Will continue twice-weekly sessions for the next 4 weeks.`}
      />
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  AppointmentNotes                                                   */
/*  Pattern: Compact non-resizable textarea in appointment forms       */
/*  Source: /calendar — appointment side panel & create modal           */
/* ------------------------------------------------------------------ */

export const AppointmentNotes: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <FormTextarea
        label="Notes"
        rows={3}
        style={{ resize: 'none' }}
        placeholder="Add a note..."
      />
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  AIPromptEditor                                                     */
/*  Pattern: AI prompt configuration textarea                          */
/*  Source: /settings/ai — Prompt fields for note generation           */
/* ------------------------------------------------------------------ */

export const AIPromptEditor: Story = {
  render: () => (
    <div style={{ maxWidth: 512 }}>
      <FormTextarea
        label="Prompt"
        rows={6}
        defaultValue="Write a professional progress note based on the session. Include subjective complaints, objective findings, treatment provided, and plan for next session. Use formal clinical language appropriate for allied health documentation."
      />
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  PaymentNotes                                                       */
/*  Pattern: Optional note field in payment/invoice modal              */
/*  Source: /invoices/[id] — payment modal, /payments/new              */
/* ------------------------------------------------------------------ */

export const PaymentNotes: Story = {
  render: () => (
    <div style={{ width: 256 }}>
      <FormTextarea
        label="Notes"
        rows={3}
        placeholder="Optional"
        style={{ resize: 'none', fontSize: 12 }}
      />
    </div>
  ),
  parameters: { layout: "padded" },
};
