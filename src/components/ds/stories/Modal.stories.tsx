import type { Meta, StoryObj } from "@storybook/react";
import { WarningOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Modal from "../Modal";
import Button from "../Button";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import FormTextarea from "../FormTextarea";
import Toggle from "../Toggle";
import Alert from "../Alert";
import Badge from "../Badge";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,
  argTypes: {
    open: {
      control: "boolean",
      description: "Whether the modal is visible",
    },
    title: {
      control: "text",
      description: "Header title text",
    },
    maxWidth: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "Maximum width of the modal dialog",
    },
    children: {
      control: false,
      description: "Modal body content",
    },
    footer: {
      control: false,
      description: "Footer content — typically action buttons",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    open: true,
    title: "Modal title",
    maxWidth: "lg",
    children: <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Modal content goes here. Change the controls to experiment.</p>,
    footer: (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save</Button>
      </>
    ),
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  args: {
    open: true,
    title: "Information",
    children: <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>This is a basic modal with a title and content.</p>,
  },
};

export const Large: Story = {
  args: {
    open: true,
    title: "Create new record",
    maxWidth: "xl",
    children: <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Extra-large modal for complex forms.</p>,
    footer: (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Create</Button>
      </>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    open: true,
    title: "Save changes",
    children: <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Are you sure you want to save your changes?</p>,
    footer: (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save</Button>
      </>
    ),
  },
};

export const WithForm: Story = {
  args: {
    open: true,
    title: "Edit details",
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FormInput label="Name" defaultValue="Dr Sarah Chen" />
        <FormInput label="Email" type="email" defaultValue="sarah@clinic.com.au" />
      </div>
    ),
    footer: (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save</Button>
      </>
    ),
  },
};

export const Confirmation: Story = {
  args: {
    open: true,
    title: "Delete appointment",
    maxWidth: "sm",
    children: (
      <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>
        Are you sure you want to delete this appointment? This action cannot be undone.
      </p>
    ),
    footer: (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button variant="danger">Delete</Button>
      </>
    ),
  },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  CreateAppointmentModal                                             */
/*  Pattern: Full form with selects, inputs, toggles, and alert        */
/*  Source: /calendar CalendarView — create appointment modal           */
/* ------------------------------------------------------------------ */

export const CreateAppointmentModal: Story = {
  render: () => (
    <Modal
      open={true}
      onClose={() => {}}
      title="New appointment"
      maxWidth="lg"
      footer={
        <>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Save</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Alert variant="warning" icon={<WarningOutlined style={{ fontSize: 16, color: '#ca8a04' }} />}>
          This appointment is in the past. Are you sure you want to create it?
        </Alert>

        <FormSelect
          label="Location"
          options={[
            { value: "main", label: "Main Clinic" },
            { value: "east", label: "East Clinics" },
          ]}
        />

        <FormSelect
          label="Practitioner *"
          options={[
            { value: "1", label: "Dr Sarah Chen" },
            { value: "2", label: "Tom Wilson" },
          ]}
        />

        <FormInput label="Client *" type="text" placeholder="Start typing to search client..." />

        <FormSelect
          label="Service *"
          options={[
            { value: "initial", label: "Initial Consultation (60 min)" },
            { value: "followup", label: "Follow-up (30 min)" },
            { value: "review", label: "Plan Review (45 min)" },
          ]}
        />

        <FormSelect
          label="Case"
          options={[{ value: "", label: "Choose a case" }]}
        />

        <FormInput label="Date *" type="date" defaultValue="2026-03-20" />

        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <FormSelect
              label="Start time *"
              options={[
                { value: "09:00", label: "9:00 AM" },
                { value: "09:30", label: "9:30 AM" },
                { value: "10:00", label: "10:00 AM" },
              ]}
            />
          </div>
          <div style={{ flex: 1 }}>
            <FormSelect
              label="End time *"
              options={[
                { value: "10:00", label: "10:00 AM" },
                { value: "10:30", label: "10:30 AM" },
                { value: "11:00", label: "11:00 AM" },
              ]}
            />
          </div>
        </div>

        <Toggle checked={false} onChange={() => {}} label="Send confirmation to client" />
      </div>
    </Modal>
  ),
};

/* ------------------------------------------------------------------ */
/*  EditPromptModal                                                    */
/*  Pattern: Modal with text inputs, select, and textarea              */
/*  Source: /settings/ai — edit prompt modal                           */
/* ------------------------------------------------------------------ */

export const EditPromptModal: Story = {
  render: () => (
    <Modal
      open={true}
      onClose={() => {}}
      title="Edit prompt"
      footer={
        <>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Save</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FormInput label="Prompt name" defaultValue="Session summary" />
        <FormSelect
          label="User group"
          options={[
            { value: "all", label: "All users" },
            { value: "admin", label: "Administrators" },
            { value: "practitioners", label: "Practitioners" },
          ]}
        />
        <FormTextarea
          label="Prompt"
          rows={6}
          defaultValue="Generate a detailed session summary based on the session context, including relevant clinical observations and findings."
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge variant="yellow">BETA</Badge>
          <span style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>AI features are in beta. Results may vary.</span>
        </div>
      </div>
    </Modal>
  ),
};

/* ------------------------------------------------------------------ */
/*  PaymentModal                                                       */
/*  Pattern: Payment form with amount ($ prefix), method, and notes    */
/*  Source: /payments/new — payment creation form                      */
/* ------------------------------------------------------------------ */

export const PaymentModal: Story = {
  render: () => (
    <Modal
      open={true}
      onClose={() => {}}
      title="Record payment"
      footer={
        <>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Save payment</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FormInput label="Client *" placeholder="Select client" />

        <FormInput label="Payment date *" type="date" defaultValue="2026-03-23" />

        <FormSelect
          label="Payment method *"
          options={[
            { value: "card", label: "Credit card" },
            { value: "cash", label: "Cash" },
            { value: "eft", label: "EFT / Bank transfer" },
            { value: "hicaps", label: "HICAPS" },
          ]}
        />

        <div>
          <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>
            Amount <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ top: '50%', position: 'absolute', left: 12, zIndex: 10, transform: 'translateY(-50%)', fontSize: 12, color: 'var(--color-text-secondary)' }}>$</span>
            <FormInput type="number" step="0.01" min="0" placeholder="0.00" style={{ paddingLeft: 28 }} />
          </div>
        </div>

        <FormTextarea label="Notes" rows={3} placeholder="Optional payment notes..." />

        <Alert variant="info" icon={<InfoCircleOutlined style={{ fontSize: 16, color: '#2563eb' }} />}>
          This payment will be linked to the client&apos;s outstanding invoices.
        </Alert>
      </div>
    </Modal>
  ),
};
