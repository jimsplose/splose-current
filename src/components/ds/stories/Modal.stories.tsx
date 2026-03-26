import type { Meta, StoryObj } from "@storybook/react";
import { AlertTriangle, Info } from "lucide-react";
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
    children: <p className="text-body-md text-text-secondary">Modal content goes here. Change the controls to experiment.</p>,
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
    children: <p className="text-body-md text-text-secondary">This is a basic modal with a title and content.</p>,
  },
};

export const Large: Story = {
  args: {
    open: true,
    title: "Create new record",
    maxWidth: "xl",
    children: <p className="text-body-md text-text-secondary">Extra-large modal for complex forms.</p>,
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
    children: <p className="text-body-md text-text-secondary">Are you sure you want to save your changes?</p>,
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
      <div className="space-y-4">
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
      <p className="text-body-md text-text-secondary">
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
      <div className="space-y-4">
        <Alert variant="warning" icon={<AlertTriangle className="h-4 w-4 text-yellow-600" />}>
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

        <div className="flex gap-4">
          <div className="flex-1">
            <FormSelect
              label="Start time *"
              options={[
                { value: "09:00", label: "9:00 AM" },
                { value: "09:30", label: "9:30 AM" },
                { value: "10:00", label: "10:00 AM" },
              ]}
            />
          </div>
          <div className="flex-1">
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
      <div className="space-y-4">
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
        <div className="flex items-center gap-2">
          <Badge variant="yellow">BETA</Badge>
          <span className="text-caption-md text-text-secondary">AI features are in beta. Results may vary.</span>
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
      <div className="space-y-4">
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
          <label className="mb-1 block text-label-lg text-text-secondary">
            Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-sm text-text-secondary">$</span>
            <FormInput type="number" step="0.01" min="0" placeholder="0.00" className="pl-7" />
          </div>
        </div>

        <FormTextarea label="Notes" rows={3} placeholder="Optional payment notes..." />

        <Alert variant="info" icon={<Info className="h-4 w-4 text-blue-600" />}>
          This payment will be linked to the client&apos;s outstanding invoices.
        </Alert>
      </div>
    </Modal>
  ),
};
