import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import EmailPreview from "../EmailPreview";
import { Button } from "antd";

const meta: Meta<typeof EmailPreview> = {
  title: "Overlays/EmailPreview",
  component: EmailPreview,
  parameters: { layout: "centered" },
  argTypes: {
    open: { control: "boolean" },
    subject: { control: "text" },
    recipientName: { control: "text" },
    body: { control: "text" },
    senderName: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof EmailPreview>;

/* ── Helpers ──────────────────────────────────────────────── */

function EmailPreviewStory(props: Omit<React.ComponentProps<typeof EmailPreview>, "open" | "onClose">) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Email Preview</Button>
      <EmailPreview open={open} onClose={() => setOpen(false)} {...props} />
    </>
  );
}

/* ── Playground ───────────────────────────────────────────── */

export const Playground: Story = {
  args: {
    open: true,
    subject: "Your appointment confirmation",
    recipientName: "Sarah Johnson",
    body: "Hi Sarah,\n\nThis is to confirm your appointment on Monday 14 April at 10:00 AM with Dr Emma Thompson at East Clinics.\n\nPlease arrive 10 minutes early.\n\nKind regards,\nHands Together Therapies",
    senderName: "Hands Together Therapies",
  },
  render: (args) => <EmailPreviewStory {...args} />,
};

/* ── Feature stories ──────────────────────────────────────── */

export const Default: Story = {
  render: () => (
    <EmailPreviewStory
      subject="Your appointment confirmation"
      recipientName="Sarah Johnson"
      body={"Hi Sarah,\n\nThis is to confirm your appointment on Monday 14 April at 10:00 AM with Dr Emma Thompson at East Clinics.\n\nPlease arrive 10 minutes early.\n\nKind regards,\nHands Together Therapies"}
    />
  ),
};

export const WithCustomSender: Story = {
  name: "With Custom Sender",
  render: () => (
    <EmailPreviewStory
      subject="Progress note summary"
      recipientName="Dr James Wilson"
      senderName="Splose OT Practice"
      body={"Dear Dr Wilson,\n\nPlease find attached the progress note summary for your patient.\n\nRegards,\nSplose OT Practice"}
    />
  ),
};

export const LongEmailBody: Story = {
  name: "Long Email Body",
  render: () => (
    <EmailPreviewStory
      subject="Detailed treatment plan — Q2 2026"
      recipientName="Margaret Chen"
      body={[
        "Dear Margaret,",
        "",
        "Following our assessment on 28 March 2026, I am writing to outline the proposed treatment plan for the next quarter.",
        "",
        "Goals:",
        "1. Improve upper limb range of motion by 15 degrees in flexion and abduction",
        "2. Increase grip strength from 12 kg to 18 kg bilaterally",
        "3. Achieve independent transfers from wheelchair to bed with standby assistance only",
        "4. Progress home exercise program to include resistance band exercises",
        "",
        "Session frequency: Twice weekly for 8 weeks, then weekly review.",
        "",
        "Equipment recommendations:",
        "- Theraband (yellow, progressing to red)",
        "- Foam roller for self-mobilisation",
        "- Grip strengthening putty (medium resistance)",
        "",
        "Please review the above and let me know if you have any questions or would like to discuss further. We can adjust the plan based on your feedback and progress at each session.",
        "",
        "I have also attached the NDIS report for your records.",
        "",
        "Kind regards,",
        "Dr Emma Thompson",
        "Senior Occupational Therapist",
        "Hands Together Therapies",
      ].join("\n")}
    />
  ),
};

/* ── Recipe stories ───────────────────────────────────────── */

/* Source: /invoices/[id] — invoice delivery email */
export const InvoiceEmail: Story = {
  name: "Recipe / Invoice Email",
  render: () => (
    <EmailPreviewStory
      subject="Invoice #INV-2026-0412 from Hands Together Therapies"
      recipientName="Sarah Johnson"
      body={"Hi Sarah,\n\nPlease find attached invoice #INV-2026-0412 for your appointment on 10 April 2026.\n\nAmount due: $185.00\nDue date: 24 April 2026\n\nYou can pay via bank transfer using the details on the invoice, or reply to this email if you have any questions.\n\nThank you,\nHands Together Therapies"}
    />
  ),
};

/* Source: /notes/[id] — sending note to referrer */
export const ProgressNoteEmail: Story = {
  name: "Recipe / Progress Note Email",
  render: () => (
    <EmailPreviewStory
      subject="Progress note — Sarah Johnson (10 Apr 2026)"
      recipientName="Dr James Wilson"
      senderName="Dr Emma Thompson via Splose"
      body={"Dear Dr Wilson,\n\nPlease find attached the progress note for your patient Sarah Johnson following her session on 10 April 2026.\n\nSummary: Upper limb ROM improved by 5 degrees in flexion since last review. Patient tolerating increased resistance in HEP. Grip strength stable at 14 kg bilaterally.\n\nPlease do not hesitate to contact me if you require any further information.\n\nKind regards,\nDr Emma Thompson\nSenior Occupational Therapist\nHands Together Therapies"}
    />
  ),
};

/* Source: /calendar — reminder email */
export const AppointmentReminder: Story = {
  name: "Recipe / Appointment Reminder",
  render: () => (
    <EmailPreviewStory
      subject="Reminder: Appointment tomorrow at 10:00 AM"
      recipientName="Sarah Johnson"
      body={"Hi Sarah,\n\nThis is a friendly reminder that you have an appointment tomorrow:\n\nDate: Monday 14 April 2026\nTime: 10:00 AM\nPractitioner: Dr Emma Thompson\nLocation: East Clinics, 42 Park Rd, Melbourne VIC 3000\n\nIf you need to reschedule, please contact us at least 24 hours in advance.\n\nSee you then!\nHands Together Therapies"}
    />
  ),
};
